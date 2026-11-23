import { prisma } from '../../config/db.js';
import type { Prisma } from '../../generated/prisma/client.js';
export function findUniqueOrganisationProfile<T extends Prisma.OrganisationProfileFindUniqueArgs>(
  args: Prisma.SelectSubset<T, Prisma.OrganisationProfileFindUniqueArgs>,
) {
  return prisma.organisationProfile.findUnique(args);
}
export function upsertOrganisationProfile<T extends Prisma.OrganisationProfileUpsertArgs>(
  args: Prisma.SelectSubset<T, Prisma.OrganisationProfileUpsertArgs>,
) {
  return prisma.organisationProfile.upsert(args);
}
