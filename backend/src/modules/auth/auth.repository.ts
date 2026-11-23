import { prisma } from '../../config/db.js';
import { rateLimitsDisabled } from '../../config/rate-limit-policy.js';
import { ApiError } from '../../utils/ApiError.js';
import type { SignupInput } from './auth.validation.js';
import { defaultPlanId } from '../membership/plan-policy.js';
import type { AccountCategory } from '../../generated/prisma/client.js';

export const findUserByEmail = (email: string) =>
  prisma.user.findUnique({ where: { email }, include: { profile: true } });
export const findUserById = (id: string) =>
  prisma.user.findUnique({ where: { id }, include: { profile: true } });
export const createSeeker = (input: SignupInput, passwordHash: string) =>
  prisma.$transaction(async (tx) => {
    const planId = input.planId ?? defaultPlanId(input.role);
    const plan = await tx.pricingPlan.findUnique({ where: { id: planId, active: true } });
    if (!plan) throw new ApiError(400, 'Choose an available membership plan');
    return tx.user.create({
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        passwordHash,
        role: input.role,
        accountCategory: plan.category as AccountCategory,
        ...(['CARE_HOME', 'CARE_AGENCY'].includes(plan.category)
          ? { organisation: { create: { name: input.organisationName! } } }
          : {}),
        membership: {
          create: {
            planId,
            pricePence:
              input.billingInterval === 'annual' ? plan.annualPricePence : plan.pricePence,
            billingInterval: input.billingInterval,
            status: plan.pricePence === 0 ? 'ACTIVE' : 'PENDING',
          },
        },
        ...(input.role === 'CAREGIVER'
          ? { professional: { create: { location: input.location } } }
          : {}),
        profile: { create: { phone: input.phone, location: input.location } },
      },
    });
  });
export const recordFailedLogin = async (id: string) =>
  prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${id}::uuid FOR UPDATE`;
    const user = await tx.user.findUniqueOrThrow({ where: { id } });
    const attempts =
      user.lockedUntil && user.lockedUntil <= new Date() ? 1 : user.failedLoginAttempts + 1;
    await tx.user.update({
      where: { id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: attempts >= 5 ? new Date(Date.now() + 15 * 60_000) : null,
      },
    });
  });
export const createSession = (
  userId: string,
  tokenHash: string,
  expiresAt: Date,
  expectedPasswordHash: string,
) =>
  prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId}::uuid FOR UPDATE`;
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.passwordHash !== expectedPasswordHash)
      throw new ApiError(401, 'Credentials changed. Please sign in again.');
    if (user.status !== 'ACTIVE' || (!rateLimitsDisabled() && user.lockedUntil && user.lockedUntil > new Date()))
      throw new ApiError(403, 'Account is not available for sign in');
    await tx.user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
    return tx.session.create({ data: { userId, tokenHash, expiresAt } });
  });
export const findSession = (tokenHash: string) =>
  prisma.session.findUnique({
    where: { tokenHash },
    include: { user: { include: { profile: true } } },
  });
export const touchSession = (id: string, lastSeenAt: Date) =>
  prisma.session.updateMany({ where: { id, revokedAt: null }, data: { lastSeenAt } });
export const revokeSession = (id: string) =>
  prisma.session.updateMany({ where: { id, revokedAt: null }, data: { revokedAt: new Date() } });
export const replacePassword = (
  userId: string,
  passwordHash: string,
  expectedPasswordHash: string,
) =>
  prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId}::uuid FOR UPDATE`;
    const user = await tx.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.passwordHash !== expectedPasswordHash || user.status !== 'ACTIVE')
      throw new ApiError(409, 'Account changed. Please sign in again.');
    await tx.user.update({
      where: { id: userId },
      data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
    });
    await tx.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  });
export const provisionAdmin = (email: string, passwordHash: string) =>
  prisma.user.create({
    data: {
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
