import * as repository from './membership.repository.js';
import { defaultPlanId, membershipAccess } from './plan-policy.js';
import { ApiError } from '../../utils/ApiError.js';
export { planIds, defaultPlanId } from './plan-policy.js';
export const planFor = (role: string) =>
  role === 'ADMIN'
    ? Promise.resolve(null)
    : repository.findUniquePricingPlan({ where: { id: defaultPlanId(role) } });
export async function accessFor(userId: string) {
  const membership = await repository.findUniqueMembership({
    where: { userId },
    include: { plan: true },
  });
  return { membership, ...membershipAccess(membership) };
}
export async function requireFeature(userId: string, feature: string) {
  const access = await accessFor(userId);
  if (!access.active || access.entitlements[feature] !== true)
    throw new ApiError(
      403,
      `Your current package does not include ${feature.replace(/([A-Z])/g, ' $1').toLowerCase()}. View Membership for package details.`,
    );
  return access;
}
