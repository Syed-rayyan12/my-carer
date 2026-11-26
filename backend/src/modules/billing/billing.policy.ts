import { addCalendarMonths } from '../membership/plan-policy.js';

export function checkoutTrialEnd(
  membership: { trialStartedAt: Date | null; trialEndsAt: Date | null },
  trialMonths: number,
  now = new Date(),
) {
  const end = membership.trialStartedAt
    ? membership.trialEndsAt
    : trialMonths > 0 ? addCalendarMonths(now, trialMonths) : null;
  return end && end > now ? Math.floor(end.getTime() / 1000) : undefined;
}

export function subscriptionAccessStatus(status: string, cancelAtPeriodEnd: boolean) {
  if (status === 'trialing') return cancelAtPeriodEnd ? 'CANCELLED' : 'TRIAL';
  if (status === 'active') return cancelAtPeriodEnd ? 'CANCELLED' : 'ACTIVE';
  // A failed renewal retains only the previously paid period, never the unpaid extension.
  if (status === 'past_due') return 'ACTIVE';
  if (status === 'canceled' || status === 'incomplete_expired') return 'CANCELLED';
  return 'PENDING';
}
