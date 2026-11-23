import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyUser<T extends Prisma.UserFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
) {
  return prisma.user.findMany(args);
}
export function findUniqueUser<T extends Prisma.UserFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
) {
  return prisma.user.findUnique(args);
}
export function findUniqueMembership<T extends Prisma.MembershipFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.MembershipFindUniqueArgs>,
) {
  return prisma.membership.findUnique(args);
}
export function updateMembership<T extends Prisma.MembershipUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.MembershipUpdateArgs>,
) {
  return prisma.membership.update(args);
}
export function updateVerification<T extends Prisma.VerificationUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.VerificationUpdateArgs>,
) {
  return prisma.verification.update(args);
}
export function updateReview<T extends Prisma.ReviewUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewUpdateArgs>,
) {
  return prisma.review.update(args);
}
export function findUniqueOrganisationProfile<T extends Prisma.OrganisationProfileFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.OrganisationProfileFindUniqueArgs>,
) {
  return prisma.organisationProfile.findUnique(args);
}
export function updateOrganisationProfile<T extends Prisma.OrganisationProfileUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.OrganisationProfileUpdateArgs>,
) {
  return prisma.organisationProfile.update(args);
}
export function findManyCareRequest<T extends Prisma.CareRequestFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestFindManyArgs>,
) {
  return prisma.careRequest.findMany(args);
}
export function findManyVerification<T extends Prisma.VerificationFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.VerificationFindManyArgs>,
) {
  return prisma.verification.findMany(args);
}
export function findManyReview<T extends Prisma.ReviewFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewFindManyArgs>,
) {
  return prisma.review.findMany(args);
}
export function findManyMessage<T extends Prisma.MessageFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.MessageFindManyArgs>,
) {
  return prisma.message.findMany(args);
}
export function findManyAccountStatusHistory<T extends Prisma.AccountStatusHistoryFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.AccountStatusHistoryFindManyArgs>,
) {
  return prisma.accountStatusHistory.findMany(args);
}
export function countUser<T extends Prisma.UserCountArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserCountArgs>,
) {
  return prisma.user.count(args);
}
export function countCareRequest<T extends Prisma.CareRequestCountArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestCountArgs>,
) {
  return prisma.careRequest.count(args);
}
export function countVerification<T extends Prisma.VerificationCountArgs>(
  args: Prisma.SelectSubset<T, Prisma.VerificationCountArgs>,
) {
  return prisma.verification.count(args);
}
const transactionQueries = (tx: Prisma.TransactionClient) => ({
  lockUser: (id: string) => tx.$queryRaw`SELECT id FROM "User" WHERE id=${id}::uuid FOR UPDATE`,
  findProfessional: (id: string) => tx.professionalProfile.findUnique({ where: { userId: id } }),
  updateUser: <T extends Prisma.UserUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>,
  ) => tx.user.update(args),
  upsertProfessionalProfile: <T extends Prisma.ProfessionalProfileUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.ProfessionalProfileUpsertArgs>,
  ) => tx.professionalProfile.upsert(args),
});
export function transaction<T>(
  work: (queries: ReturnType<typeof transactionQueries>) => Promise<T>,
) {
  return prisma.$transaction((tx) => work(transactionQueries(tx)));
}

export function findManyApplication<T extends Prisma.ApplicationFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationFindManyArgs>,
) {
  return prisma.application.findMany(args);
}
