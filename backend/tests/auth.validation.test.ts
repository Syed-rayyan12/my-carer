import { describe, expect, it } from 'vitest';
import { signupSchema, loginSchema, phoneSchema } from '../src/modules/auth/auth.validation.js';
import { profileSchema } from '../src/modules/account/account.validation.js';
import {
  hashPassword,
  verifyPassword,
  newToken,
  hashToken,
  csrfToken,
  matchesToken,
} from '../src/modules/auth/auth.crypto.js';
const valid = {
  firstName: 'Aisha',
  lastName: 'Khan',
  email: '  AISHA@example.com ',
  password: 'A secure password 123!',
  confirmPassword: 'A secure password 123!',
  consent: true,
  role: 'CARE_SEEKER',
};
describe('UK phone numbers', () => {
  it.each([
    ['07712 345678', '+447712345678'],
    ['+44 7712 345678', '+447712345678'],
    ['0044 7712 345678', '+447712345678'],
    ['+44 (0)7712 345678', '+447712345678'],
    ['07700 900123', '+447700900123'],
    ['+44 7700 900123', '+447700900123'],
    ['0044 7700 900123', '+447700900123'],
    ['+44 (0)7700 900123', '+447700900123'],
    ['(020) 7946-0018', '+442079460018'],
    ['  ', ''],
  ])('normalizes %s for storage', (input, expected) => {
    expect(phoneSchema.parse(input)).toBe(expected);
  });
  it.each([
    '07700',
    '0770090012',
    '077123456784',
    '+1 202 555 0123',
    '+92 300 1234567',
    '++44 7712 345678',
    'Call 07712 345678',
    '020 7946 0018 ext 123',
  ])('rejects invalid or non-UK input %s', (input) => {
    expect(phoneSchema.safeParse(input).success).toBe(false);
  });
  it.each(['CARE_SEEKER', 'CAREGIVER'])('normalizes phone during %s signup', (role) => {
    expect(signupSchema.parse({ ...valid, role, phone: '07712 345678' }).phone).toBe(
      '+447712345678',
    );
  });
  it('normalizes both profile phone fields', () => {
    const profile = profileSchema.parse({
      firstName: 'Aisha',
      lastName: 'Khan',
      email: '',
      phone: '07712 345678',
      dateOfBirth: '',
      address: '',
      postcode: '',
      about: '',
      emergencyName: '',
      relationship: '',
      emergencyPhone: '020 7946 0018',
    });
    expect(profile.phone).toBe('+447712345678');
    expect(profile.emergencyPhone).toBe('+442079460018');
  });
});
describe('Authentication validation and cryptography', () => {
  it('normalizes emails and names', () => {
    const value = signupSchema.parse(valid);
    expect(value.email).toBe('aisha@example.com');
  });
  it.each([
    { role: 'ADMIN' },
    { role: 'CARE_JOB' },
    { status: 'ACTIVE' },
    { consent: false },
    { firstName: '   ' },
    { firstName: '<script>' },
    { email: 'invalid' },
    { password: 'short', confirmPassword: 'short' },
    { confirmPassword: 'different' },
    { password: 'x'.repeat(129), confirmPassword: 'x'.repeat(129) },
  ])('rejects malformed or privileged signup fields: %o', (change) => {
    expect(signupSchema.safeParse({ ...valid, ...change }).success).toBe(false);
  });
  it.each(['CARE_SEEKER', 'CAREGIVER'])('accepts %s signup and login', (role) => {
    expect(signupSchema.safeParse({ ...valid, role }).success).toBe(true);
    expect(
      loginSchema.safeParse({ email: 'a@example.com', password: 'password', role }).success,
    ).toBe(true);
  });
  it('rejects arbitrary fields on login', () => {
    expect(
      loginSchema.safeParse({
        email: 'a@example.com',
        password: 'password',
        role: 'CARE_SEEKER',
        userId: 'other',
      }).success,
    ).toBe(false);
  });
  it('stores salted scrypt hashes and compares them correctly', async () => {
    const first = await hashPassword(valid.password);
    const second = await hashPassword(valid.password);
    expect(first).not.toBe(second);
    expect(first).not.toContain(valid.password);
    expect(await verifyPassword(valid.password, first)).toBe(true);
    expect(await verifyPassword('wrong password', first)).toBe(false);
  }, 15000);
  it('generates independent session and CSRF tokens', () => {
    const first = newToken();
    const second = newToken();
    expect(first).not.toBe(second);
    expect(hashToken(first)).not.toBe(first);
    expect(matchesToken(csrfToken(first), csrfToken(first))).toBe(true);
    expect(matchesToken(csrfToken(second), csrfToken(first))).toBe(false);
    expect(matchesToken('forged', csrfToken(first))).toBe(false);
  });
  it('rejects impossible birth dates and profile ownership injection', () => {
    expect(
      profileSchema.safeParse({ dateOfBirth: '2026-02-30', userId: 'someone-else' }).success,
    ).toBe(false);
  });
});

describe('document packages use their dedicated login role',()=>{
 for(const planId of ['CARER_FREE','CARER_VERIFIED','CARER_PRO','HOME_BASIC','HOME_ENHANCED','HOME_PREMIUM','AGENCY_STARTER','AGENCY_GROWTH','AGENCY_GROWTH_PLUS','AGENCY_ENTERPRISE','FAMILY_FREE']) {
  const role=planId==='FAMILY_FREE'?'CARE_SEEKER':'CAREGIVER';
  const input={...valid,role,planId,organisationName:'Test organisation'};
  it('accepts '+planId+' with '+role,()=>expect(signupSchema.parse(input)).toMatchObject({role,planId}));
  it('rejects the wrong role for '+planId,()=>expect(signupSchema.safeParse({...input,role:role==='CAREGIVER'?'CARE_SEEKER':'CAREGIVER'}).success).toBe(false));
 }
 it.each([{planId:'ADMIN'},{planId:'CAREGIVER'},{pricePence:1},{annualPricePence:1},{trialEndsAt:'2099-01-01'},{accountCategory:'CARE_AGENCY'},{role:'ADMIN'}])('rejects forged price, trial or permissions %j',extra=>expect(signupSchema.safeParse({...valid,...extra}).success).toBe(false));
 it('requires an organisation name',()=>expect(signupSchema.safeParse({...valid,planId:'HOME_BASIC'}).success).toBe(false));
});

