import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { addCalendarMonths, membershipAccess } from '../src/modules/membership/plan-policy.js';
import { validateProfessionalChange } from '../src/modules/caregivers/profile-policy.js';
import { publicCaregiver } from '../src/modules/caregivers/directory-policy.js';
import type { Entitlements } from '../src/modules/membership/plan-policy.js';
type CataloguePlan = { id: string; pricePence: number; annualPricePence: number; entitlements: Entitlements; featureRows: { section: string; label: string; value: string }[] };
const catalogue: CataloguePlan[] = JSON.parse(
  readFileSync(new URL('../docs/pricing-catalogue.json', import.meta.url), 'utf8'),
);
const source = JSON.parse(
  readFileSync(new URL('../docs/pricing-source.json', import.meta.url), 'utf8').replace(
    /^\uFEFF/,
    '',
  ),
);
describe('client pricing document fidelity', () => {
  it('preserves all ten monthly prices and the stated annual prices', () => {
    expect(catalogue.map(p => p.pricePence)).toEqual([
      0, 999, 1999, 0, 7900, 14900, 4900, 12900, 12900, 24900,
    ]);
    expect(catalogue.map(p => p.annualPricePence)).toEqual([
      0, 9900, 19900, 0, 79000, 149000, 49000, 129000, 129000, 249000,
    ]);
  });
  it('preserves every feature cell, including both identical Growth tiers', () => {
    let offset = 0;
    for (const table of source) {
      for (let tier = 1; tier < table.rows[0].length; tier++) {
        const plan = catalogue[offset++];
        let section = '';
        const rows = [];
        for (const row of table.rows.slice(3)) {
          if (row.length === 1) section = row[0];
          else rows.push({ section, label: row[0], value: row[tier] });
        }
        expect(plan.featureRows).toEqual(rows);
      }
    }
  });
});
describe('access periods', () => {
  const now = new Date('2026-11-19T12:00:00Z');
  const member = {
    status: 'TRIAL',
    pricePence: 999,
    paidThrough: null,
    trialEndsAt: new Date('2027-05-19T12:00:00Z'),
    plan: { entitlements: { directMessages: true } },
  };
  it('enables paid features during the six-month trial without a paid period', () =>
    expect(membershipAccess(member, now)).toMatchObject({
      active: true,
      trial: true,
      entitlements: { directMessages: true },
    }));
  it('expires at the boundary and does not retain paid entitlements', () =>
    expect(membershipAccess(member, member.trialEndsAt!)).toEqual({
      active: false,
      trial: false,
      entitlements: {},
    }));
  it('keeps a free tier available without a payment or trial', () =>
    expect(
      membershipAccess({ ...member, status: 'ACTIVE', pricePence: 0, trialEndsAt: null }, now)
        .active,
    ).toBe(true));
  it('retains a cancelled trial until its end', () =>
    expect(membershipAccess({ ...member, status: 'CANCELLED' }, now).active).toBe(true));
  it('does not enable a suspended package with a future date', () =>
    expect(membershipAccess({ ...member, status: 'SUSPENDED' }, now).active).toBe(false));
  it('retains verified paid access, and expires it exactly on time', () => {
    const paid = {
      ...member,
      status: 'ACTIVE',
      trialEndsAt: null,
      paidThrough: new Date('2026-12-19T12:00:00Z'),
    };
    expect(membershipAccess(paid, now).active).toBe(true);
    expect(membershipAccess(paid, paid.paidThrough!).active).toBe(false);
  });
  it('uses calendar months and clamps month-end dates', () => {
    expect(addCalendarMonths(new Date('2026-08-31T09:00:00Z'), 6).toISOString()).toBe(
      '2027-02-28T09:00:00.000Z',
    );
    expect(addCalendarMonths(new Date('2027-08-31T09:00:00Z'), 6).toISOString()).toBe(
      '2028-02-29T09:00:00.000Z',
    );
  });
});
describe('profile feature restrictions', () => {
  const free = catalogue.find(p => p.id === 'CARER_FREE')!.entitlements;
  const verified = catalogue.find(p => p.id === 'CARER_VERIFIED')!.entitlements;
  const pro = catalogue.find(p => p.id === 'CARER_PRO')!.entitlements;
  it('allows basic details and one specialism on Free', () =>
    expect(() =>
      validateProfessionalChange(
        { bio: '', services: 'Companionship', location: 'York' },
        null,
        free,
      ),
    ).not.toThrow());
  it('rejects a second specialism on Free', () =>
    expect(() =>
      validateProfessionalChange({ services: 'Companionship,Personal care' }, null, free),
    ).toThrow('1 specialism'));
  it('rejects qualification and photo injection through JSON details', () => {
    expect(() =>
      validateProfessionalChange(
        { details: { profile: { qualifications: [{ name: 'NVQ' }] } } },
        null,
        verified,
      ),
    ).toThrow('qualifications');
    expect(() =>
      validateProfessionalChange(
        { details: { profile: { photo: 'https://example.com/photo.jpg' } } },
        null,
        free,
      ),
    ).toThrow('photo');
  });
  it('rejects bio and calendar changes on Free even when called directly', () => {
    expect(() => validateProfessionalChange({ bio: 'Biography' }, null, free)).toThrow('bio');
    expect(() =>
      validateProfessionalChange({ details: { availability: { monday: true } } }, null, free),
    ).toThrow('availability');
  });
  it('allows a bio and five specialisms on Verified, and qualifications on Pro', () => {
    expect(() =>
      validateProfessionalChange({ bio: 'Biography', services: 'a,b,c,d,e' }, null, verified),
    ).not.toThrow();
    expect(() =>
      validateProfessionalChange(
        { qualifications: 'NVQ', availability: 'Monday', services: 'a,b,c,d,e,f' },
        null,
        pro,
      ),
    ).not.toThrow();
  });
  it('hides historic paid fields and badges when publicly listing a Free profile', () => {
    const result = publicCaregiver({
      id: 'test',
      professional: {
        bio: 'Private paid bio',
        qualifications: 'NVQ',
        services: 'a,b',
        availability: 'Monday',
      },
      verifications: [{ kind: 'DBS' }],
      membership: {
        status: 'ACTIVE',
        pricePence: 0,
        trialEndsAt: null,
        paidThrough: null,
        plan: { entitlements: free },
      },
    });
    expect(result.professional).toMatchObject({
      bio: '',
      qualifications: '',
      availability: '',
      services: 'a',
    });
    expect(result.verifications).toEqual([]);
    expect(result).not.toHaveProperty('membership');
  });
});


