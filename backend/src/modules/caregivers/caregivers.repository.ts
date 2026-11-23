import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findUniqueProfessionalProfile<T extends Prisma.ProfessionalProfileFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.ProfessionalProfileFindUniqueArgs>,
) {
  return prisma.professionalProfile.findUnique(args);
}
export function upsertProfessionalProfile<T extends Prisma.ProfessionalProfileUpsertArgs>(
  args: Prisma.SelectSubset<T, Prisma.ProfessionalProfileUpsertArgs>,
) {
  return prisma.professionalProfile.upsert(args);
}
export function findManyUser<T extends Prisma.UserFindManyArgs>(
  args: Prisma.SelectSubset<T, Prisma.UserFindManyArgs>,
) {
  return prisma.user.findMany(args);
}
const transactionQueries = (tx: Prisma.TransactionClient) => ({
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

export async function professionalSection(
  userId: string,
  section: 'services' | 'availability' | 'job-preferences',
) {
  if (section === 'services') {
    const [r] = await prisma.$queryRaw<
      { services: string; items: Prisma.JsonValue }[]
    >`SELECT services, details->'services' AS items FROM "ProfessionalProfile" WHERE "userId"=${userId}::uuid`;
    return r ? { services: r.services, details: { services: r.items } } : null;
  }
  if (section === 'availability') {
    const [r] = await prisma.$queryRaw<
      { availability: string; calendar: Prisma.JsonValue; timeOff: Prisma.JsonValue }[]
    >`SELECT availability, details->'availability' AS calendar, details->'timeOff' AS "timeOff" FROM "ProfessionalProfile" WHERE "userId"=${userId}::uuid`;
    return r
      ? { availability: r.availability, details: { availability: r.calendar, timeOff: r.timeOff } }
      : null;
  }
  const [r] = await prisma.$queryRaw<
    { location: string; savedJobs: Prisma.JsonValue }[]
  >`SELECT location, details->'savedJobs' AS "savedJobs" FROM "ProfessionalProfile" WHERE "userId"=${userId}::uuid`;
  return r ? { location: r.location, details: { savedJobs: r.savedJobs } } : null;
}
export async function applicationProfile(userId: string) {
  const [r] = await prisma.$queryRaw<
    { availability: string; photo: string | null }[]
  >`SELECT availability, details->'profile'->>'photo' AS photo FROM "ProfessionalProfile" WHERE "userId"=${userId}::uuid`;
  return { availability: r?.availability ?? '', photo: r?.photo ?? '' };
}
export async function patchProfessional(
  userId: string,
  patch: import('./caregivers.types.js').ProfessionalUpdateSchemaInput,
  check: (data: Record<string, unknown>, before: Record<string, unknown> | null) => void,
) {
  return prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "User" WHERE id=${userId}::uuid FOR UPDATE`;
    const before = await tx.professionalProfile.findUnique({ where: { userId } });
    const oldDetails =
      before?.details && typeof before.details === 'object' && !Array.isArray(before.details)
        ? before.details
        : {};
    const data = {
      ...patch,
      ...(patch.details ? { details: { ...oldDetails, ...patch.details } } : {}),
    };
    check(data, before);
    return tx.professionalProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  });
}
