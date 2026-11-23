import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyCareRequest<T extends Prisma.CareRequestFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestFindManyArgs>,
) {
  return prisma.careRequest.findMany(args);
}
