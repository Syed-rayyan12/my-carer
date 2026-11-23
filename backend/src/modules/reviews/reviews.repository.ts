import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyReview<T extends Prisma.ReviewFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewFindManyArgs>,
) {
  return prisma.review.findMany(args);
}
export function findFirstApplication<T extends Prisma.ApplicationFindFirstArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationFindFirstArgs>,
) {
  return prisma.application.findFirst(args);
}
export function findFirstMessage<T extends Prisma.MessageFindFirstArgs>(
  args: Prisma.SelectSubset<T, Prisma.MessageFindFirstArgs>,
) {
  return prisma.message.findFirst(args);
}
export function createReview<T extends Prisma.ReviewCreateArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewCreateArgs>,
) {
  return prisma.review.create(args);
}
export function findUniqueReview<T extends Prisma.ReviewFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewFindUniqueArgs>,
) {
  return prisma.review.findUnique(args);
}
export function updateReview<T extends Prisma.ReviewUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.ReviewUpdateArgs>,
) {
  return prisma.review.update(args);
}

export const reviewCandidates = (userId: string) =>
  prisma.application.findMany({
    where: { request: { ownerId: userId }, status: 'ACCEPTED' },
    distinct: ['caregiverId'],
    select: { caregiver: { select: { id: true, firstName: true, lastName: true, role: true } } },
    take: 100,
  });
