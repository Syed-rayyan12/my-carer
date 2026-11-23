import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findManySavedCaregiver<T extends Prisma.SavedCaregiverFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.SavedCaregiverFindManyArgs>,
) {
  return prisma.savedCaregiver.findMany(args);
}
export function findFirstUser<T extends Prisma.UserFindFirstArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>,
) {
  return prisma.user.findFirst(args);
}
export function upsertSavedCaregiver<T extends Prisma.SavedCaregiverUpsertArgs>(
  args: Prisma.SelectSubset<T, Prisma.SavedCaregiverUpsertArgs>,
) {
  return prisma.savedCaregiver.upsert(args);
}
export function deleteManySavedCaregiver<T extends Prisma.SavedCaregiverDeleteManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.SavedCaregiverDeleteManyArgs>,
) {
  return prisma.savedCaregiver.deleteMany(args);
}
