import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function countCareRequest<T extends Prisma.CareRequestCountArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestCountArgs>,
) {
  return prisma.careRequest.count(args);
}
export function countApplication<T extends Prisma.ApplicationCountArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationCountArgs>,
) {
  return prisma.application.count(args);
}
export function countMessage<T extends Prisma.MessageCountArgs>(
  args: Prisma.SelectSubset<T, Prisma.MessageCountArgs>,
) {
  return prisma.message.count(args);
}
export function aggregateReview<T extends Prisma.ReviewAggregateArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewAggregateArgs>,
) {
  return prisma.review.aggregate(args);
}
export function findUniqueOrganisationProfile<T extends Prisma.OrganisationProfileFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.OrganisationProfileFindUniqueArgs>,
) {
  return prisma.organisationProfile.findUnique(args);
}
export function findManyCareRequest<T extends Prisma.CareRequestFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestFindManyArgs>,
) {
  return prisma.careRequest.findMany(args);
}
export function findUniqueUser<T extends Prisma.UserFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
) {
  return prisma.user.findUnique(args);
}
