import { describe, expect, it } from 'vitest';
import { isCareSeekerProfileComplete } from '../src/modules/auth/profile-completion.js';

const complete = {
  phone: '+447700900123',
  location: 'London',
  address: '10 Test Street',
  postcode: 'SW1A 1AA',
  about: 'Looking for companionship support for my parent.',
};
describe('Care seeker profile completion', () => {
  it('accepts a completed profile with a UK-format test phone number', () => {
    expect(isCareSeekerProfileComplete(complete)).toBe(true);
  });
  it.each(['phone', 'location', 'address', 'postcode', 'about'])('requires %s', (field) => {
    expect(isCareSeekerProfileComplete({ ...complete, [field]: '  ' })).toBe(false);
  });
  it('rejects a missing profile or malformed phone number', () => {
    expect(isCareSeekerProfileComplete(null)).toBe(false);
    expect(isCareSeekerProfileComplete({ ...complete, phone: '12345' })).toBe(false);
  });
});

