import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findUniqueMembership<T extends Prisma.MembershipFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.MembershipFindUniqueArgs>,
) {
  return prisma.membership.findUnique(args);
}
export function upsertMembership<T extends Prisma.MembershipUpsertArgs>(
  args: Prisma.SelectSubset<T, Prisma.MembershipUpsertArgs>,
) {
  return prisma.membership.upsert(args);
}
export function updateMembership<T extends Prisma.MembershipUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.MembershipUpdateArgs>,
) {
  return prisma.membership.update(args);
}
const transactionQueries = (tx: Prisma.TransactionClient) => ({
  lockUser: (id: string) => tx.$queryRaw`SELECT id FROM "User" WHERE id=${id}::uuid FOR UPDATE`,
  findFirstPricingPlan: <T extends Prisma.PricingPlanFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.PricingPlanFindFirstArgs>,
  ) => tx.pricingPlan.findFirst(args),
  findUniqueMembership: <T extends Prisma.MembershipFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.MembershipFindUniqueArgs>,
  ) => tx.membership.findUnique(args),
  countCareRequest: <T extends Prisma.CareRequestCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.CareRequestCountArgs>,
  ) => tx.careRequest.count(args),
  updateUser: <T extends Prisma.UserUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>,
  ) => tx.user.update(args),
  upsertOrganisationProfile: <T extends Prisma.OrganisationProfileUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrganisationProfileUpsertArgs>,
  ) => tx.organisationProfile.upsert(args),
  upsertMembership: <T extends Prisma.MembershipUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.MembershipUpsertArgs>,
  ) => tx.membership.upsert(args),
});
export function transaction<T>(
  work: (queries: ReturnType<typeof transactionQueries>) => Promise<T>,
) {
  return prisma.$transaction((tx) => work(transactionQueries(tx)));
}

export function findUniquePricingPlan<T extends Prisma.PricingPlanFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.PricingPlanFindUniqueArgs>,
) {
  return prisma.pricingPlan.findUnique(args);
}
