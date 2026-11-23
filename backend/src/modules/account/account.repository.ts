import { prisma } from '../../config/db.js';
export const getAccountAccess = (userId: string) =>
  prisma.membership.findUnique({
    where: { userId },
    include: { plan: { select: { id: true, title: true, category: true, entitlements: true } } },
  });
export const getOwnAccount = (userId: string) =>
  prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { firstName: true, lastName: true, email: true, profile: true },
  });

import type { Prisma } from '../../generated/prisma/client.js';
export const findUserById = (id: string) =>
  prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, firstName: true, lastName: true, email: true, profile: true },
  });
export const updateSeekerProfile = (
  userId: string,
  names: { firstName: string; lastName: string },
  data: Prisma.CareSeekerProfileUpdateInput,
) =>
  prisma.user.update({
    where: { id: userId },
    data: { ...names, profile: { update: data } },
    include: { profile: true },
  });
