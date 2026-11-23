import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyCareRequest<T extends Prisma.CareRequestFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestFindManyArgs>,
) {
  return prisma.careRequest.findMany(args);
}
export function findUniqueCareRequest<T extends Prisma.CareRequestFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestFindUniqueArgs>,
) {
  return prisma.careRequest.findUnique(args);
}
const transactionQueries = (tx: Prisma.TransactionClient) => ({
  lockUser: (id: string) => tx.$queryRaw`SELECT id FROM "User" WHERE id=${id}::uuid FOR UPDATE`,
  countCareRequest: <T extends Prisma.CareRequestCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.CareRequestCountArgs>,
  ) => tx.careRequest.count(args),
  createCareRequest: <T extends Prisma.CareRequestCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CareRequestCreateArgs>,
  ) => tx.careRequest.create(args),
  updateCareRequest: <T extends Prisma.CareRequestUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.CareRequestUpdateArgs>,
  ) => tx.careRequest.update(args),
});
export function transaction<T>(
  work: (queries: ReturnType<typeof transactionQueries>) => Promise<T>,
) {
  return prisma.$transaction((tx) => work(transactionQueries(tx)));
}
