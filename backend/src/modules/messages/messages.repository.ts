import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManyMessage<T extends Prisma.MessageFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.MessageFindManyArgs>,
) {
  return prisma.message.findMany(args);
}
export function findUniqueUser<T extends Prisma.UserFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>,
) {
  return prisma.user.findUnique(args);
}
export function createMessage<T extends Prisma.MessageCreateArgs>(
  args: Prisma.SelectSubset<T, Prisma.MessageCreateArgs>,
) {
  return prisma.message.create(args);
}
