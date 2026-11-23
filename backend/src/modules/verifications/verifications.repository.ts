import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyVerification<T extends Prisma.VerificationFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.VerificationFindManyArgs>,
) {
  return prisma.verification.findMany(args);
}
export function createVerification<T extends Prisma.VerificationCreateArgs>(
  args: Prisma.SelectSubset<T, Prisma.VerificationCreateArgs>,
) {
  return prisma.verification.create(args);
}
