import { prisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import type { AccountStatus } from '../../generated/prisma/client.js';
import { addCalendarMonths } from '../membership/plan-policy.js';
export const listRegistrations = () =>
  prisma.user.findMany({
    where: { role: { in: ['CARE_SEEKER', 'CAREGIVER'] } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      profile: { select: { phone: true, location: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
export const decideAccount = (
  userId: string,
  actorId: string,
  status: AccountStatus,
  reason?: string,
) =>
  prisma.$transaction(async (tx) => {
    // Approval and login serialize on this row, preventing a suspension/login race.
    await tx.$queryRaw`SELECT id FROM "User" WHERE id = ${userId}::uuid FOR UPDATE`;
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || user.role === 'ADMIN') throw new ApiError(404, 'Account not found');
    if (user.status === status) throw new ApiError(409, 'Account already has this status');
    if (status === 'REJECTED' && user.status !== 'PENDING')
      throw new ApiError(409, 'Only pending registrations can be rejected');
    if (status === 'SUSPENDED' && user.status !== 'ACTIVE')
      throw new ApiError(409, 'Only active accounts can be suspended');
    await tx.user.update({ where: { id: userId }, data: { status } });
    if (status === 'ACTIVE') {
      const membership = await tx.membership.findUnique({
        where: { userId },
        include: { plan: true },
      });
      if (membership && !membership.trialStartedAt && membership.plan.trialMonths > 0) {
        const start = new Date();
        await tx.membership.update({
          where: { userId },
          data: {
            status: 'TRIAL',
            trialStartedAt: start,
            trialEndsAt: addCalendarMonths(start, membership.plan.trialMonths),
          },
        });
      }
    }
    await tx.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    await tx.accountStatusHistory.create({
      data: { userId, actorId, fromStatus: user.status, toStatus: status, reason },
    });
  });
