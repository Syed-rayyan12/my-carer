import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyApplication<T extends Prisma.ApplicationFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationFindManyArgs>,
) {
  return prisma.application.findMany(args);
}
export function findUniqueCareRequest<T extends Prisma.CareRequestFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.CareRequestFindUniqueArgs>,
) {
  return prisma.careRequest.findUnique(args);
}
export function createApplication<T extends Prisma.ApplicationCreateArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationCreateArgs>,
) {
  return prisma.application.create(args);
}
export function findUniqueApplication<T extends Prisma.ApplicationFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationFindUniqueArgs>,
) {
  return prisma.application.findUnique(args);
}
export function updateApplication<T extends Prisma.ApplicationUpdateArgs>(
  args: Prisma.SelectSubset<T, Prisma.ApplicationUpdateArgs>,
) {
  return prisma.application.update(args);
}
const transactionQueries = (tx: Prisma.TransactionClient) => ({
  findUniqueApplication: <T extends Prisma.ApplicationFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ApplicationFindUniqueArgs>,
  ) => tx.application.findUnique(args),
  updateManyApplication: <T extends Prisma.ApplicationUpdateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ApplicationUpdateManyArgs>,
  ) => tx.application.updateMany(args),
});
export function transaction<T>(
  work: (queries: ReturnType<typeof transactionQueries>) => Promise<T>,
) {
  return prisma.$transaction((tx) => work(transactionQueries(tx)));
}
