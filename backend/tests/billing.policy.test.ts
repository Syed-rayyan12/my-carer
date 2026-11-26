import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { checkoutTrialEnd, subscriptionAccessStatus } from '../src/modules/billing/billing.policy.js';
import { planRole } from '../src/modules/membership/plan-policy.js';

describe('subscription trial and account policy', () => {
  const now = new Date('2026-08-31T10:00:00Z');
  it('uses six calendar months, including the February month-end', () => {
    expect(checkoutTrialEnd({ trialStartedAt: null, trialEndsAt: null }, 6, now))
      .toBe(Date.parse('2027-02-28T10:00:00Z') / 1000);
  });
  it('preserves the remaining trial when restarting checkout or changing billing interval', () => {
    const end = new Date('2026-12-01T00:00:00Z');
    expect(checkoutTrialEnd({ trialStartedAt: new Date('2026-06-01'), trialEndsAt: end }, 6, now))
      .toBe(end.getTime() / 1000);
  });
  it('does not grant another trial after expiry', () => {
    expect(checkoutTrialEnd({ trialStartedAt: new Date('2025-01-01'), trialEndsAt: new Date('2025-07-01') }, 6, now)).toBeUndefined();
  });
  it('does not give free plans a trial', () => {
    expect(checkoutTrialEnd({ trialStartedAt: null, trialEndsAt: null }, 0, now)).toBeUndefined();
  });
  it('all provider plans use the caregiver role, with only Family using care seeker', () => {
    const plans = JSON.parse(readFileSync(new URL('../docs/pricing-catalogue.json', import.meta.url), 'utf8'));
    for (const plan of plans) expect(planRole(plan.id)).toBe('CAREGIVER');
    expect(planRole('FAMILY_FREE')).toBe('CARE_SEEKER');
  });
  it.each([
    ['trialing', false, 'TRIAL'], ['trialing', true, 'CANCELLED'],
    ['active', false, 'ACTIVE'], ['active', true, 'CANCELLED'],
    ['incomplete', false, 'PENDING'], ['paused', false, 'PENDING'],
    ['canceled', false, 'CANCELLED'],
  ])('maps %s with cancellation %s to %s', (status, cancel, expected) => {
    expect(subscriptionAccessStatus(String(status), Boolean(cancel))).toBe(expected);
  });
});
