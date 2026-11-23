import { prisma } from '../../config/db.js';
export const recentMessages = (userId: string) =>
  prisma.message.findMany({
    where: { recipientId: userId },
    select: { id: true, createdAt: true, sender: { select: { firstName: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
export const recentVerifications = (userId: string) =>
  prisma.verification.findMany({
    where: { userId },
    select: { id: true, kind: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
export const recentRegistrations = () =>
  prisma.user.findMany({
    where: { role: { in: ['CARE_SEEKER', 'CAREGIVER'] } },
    select: { id: true, firstName: true, lastName: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

export const states = (userId: string) => prisma.notificationState.findMany({ where: { userId } });
export const saveStates = (userId: string, ids: string[], data: { read?: boolean; dismissed?: boolean }) =>
  prisma.$transaction(ids.map(eventId => prisma.notificationState.upsert({
    where: { userId_eventId: { userId, eventId } }, create: { userId, eventId, ...data }, update: data,
  })));
export const recentApplications = (userId: string, role: string) => prisma.application.findMany({
  where: role === 'ADMIN' ? {} : role === 'CAREGIVER' ? { caregiverId: userId } : { request: { ownerId: userId } },
  include: { request: { select: { title: true } }, caregiver: { select: { firstName: true } } },
  orderBy: { createdAt: 'desc' }, take: 100,
});
export const recentReviews = (userId: string, role: string) => prisma.review.findMany({
  where: role === 'ADMIN' ? {} : { OR: [{ authorId: userId }, { caregiverId: userId }] },
  select: { id: true, rating: true, createdAt: true, visible: true, response: true },
  orderBy: { createdAt: 'desc' }, take: 100,
});
export const accountDecisions = (userId: string) => prisma.accountStatusHistory.findMany({
  where: { userId }, orderBy: { createdAt: 'desc' }, take: 20,
});
export const pendingVerifications = () => prisma.verification.findMany({
  where: { status: 'PENDING' }, orderBy: { createdAt: 'desc' }, take: 100,
});
