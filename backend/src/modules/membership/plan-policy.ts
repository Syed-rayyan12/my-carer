export const planIds = [
  'CARER_FREE',
  'CARER_VERIFIED',
  'CARER_PRO',
  'HOME_BASIC',
  'HOME_ENHANCED',
  'HOME_PREMIUM',
  'AGENCY_STARTER',
  'AGENCY_GROWTH',
  'AGENCY_GROWTH_PLUS',
  'AGENCY_ENTERPRISE',
  'FAMILY_FREE',
] as const;
export type PlanId = (typeof planIds)[number];
export const defaultPlanId = (role: string): PlanId =>
  role === 'CAREGIVER' ? 'CARER_FREE' : 'FAMILY_FREE';
export const planRole = (id: string) => (id.startsWith('CARER_') ? 'CAREGIVER' : 'CARE_SEEKER');
export type Entitlements = Record<string, boolean | number | null>;
export function addCalendarMonths(date: Date, months: number) {
  const result = new Date(date);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const last = new Date(
    Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0),
  ).getUTCDate();
  result.setUTCDate(Math.min(day, last));
  return result;
}
export function membershipAccess(
  membership: {
    status: string;
    pricePence: number;
    paidThrough: Date | null;
    trialEndsAt: Date | null;
    plan: { entitlements: unknown };
  } | null,
  now = new Date(),
) {
  if (!membership) return { active: false, trial: false, entitlements: {} as Entitlements };
  const trial =
    !!membership.trialEndsAt &&
    membership.trialEndsAt > now &&
    ['TRIAL', 'ACTIVE', 'CANCELLED'].includes(membership.status);
  const paid =
    !!membership.paidThrough &&
    membership.paidThrough > now &&
    ['ACTIVE', 'CANCELLED'].includes(membership.status);
  const active =
    (membership.pricePence === 0 && membership.status !== 'SUSPENDED') || trial || paid;
  return {
    active,
    trial,
    entitlements: active ? (membership.plan.entitlements as Entitlements) : ({} as Entitlements),
  };
}
