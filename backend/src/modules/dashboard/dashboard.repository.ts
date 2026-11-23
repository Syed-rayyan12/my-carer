import { prisma } from '../../config/db.js';
import { identity, publicProfessional } from '../shared/user-select.js';
const caregiverSelect = {
  ...identity,
  membership: { include: { plan: true } },
  professional: { select: publicProfessional },
  verifications: { where: { status: 'APPROVED' }, select: { kind: true } },
  reviewsReceived: { where: { visible: true }, select: { rating: true } },
} as const;
export async function seekerOverview(userId: string) {
  const [
    openRequests,
    savedCount,
    messageCount,
    arrangements,
    requests,
    caregivers,
    reviews,
    requestActivity,
    messageActivity,
    applicationActivity,
  ] = await Promise.all([
    prisma.careRequest.count({ where: { ownerId: userId, status: 'OPEN' } }),
    prisma.savedCaregiver.count({ where: { userId } }),
    prisma.message.count({ where: { recipientId: userId } }),
    prisma.application.count({ where: { request: { ownerId: userId }, status: 'ACCEPTED' } }),
    prisma.careRequest.findMany({
      where: { ownerId: userId, status: 'OPEN' },
      select: {
        id: true,
        title: true,
        status: true,
        location: true,
        schedule: true,
        budgetPence: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),
    prisma.user.findMany({
      where: { role: 'CAREGIVER', status: 'ACTIVE', professional: { isNot: null } },
      select: { ...caregiverSelect, savedBy: { where: { userId }, select: { userId: true } } },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),
    prisma.review.findMany({
      where: { OR: [{ authorId: userId }, { caregiverId: userId, visible: true }] },
      select: { id: true, rating: true, body: true, caregiver: { select: identity } },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),
    prisma.careRequest.findMany({
      where: { ownerId: userId },
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.message.findMany({
      where: { recipientId: userId },
      select: { id: true, createdAt: true, sender: { select: { firstName: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.application.findMany({
      where: { request: { ownerId: userId } },
      select: {
        id: true,
        createdAt: true,
        caregiver: { select: { firstName: true } },
        request: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);
  return {
    stats: { openRequests, savedCount, messageCount, arrangements },
    requests,
    caregivers,
    saved: caregivers.filter((p) => p.savedBy.length > 0).map((p) => ({ caregiverId: p.id })),
    reviews,
    requestActivity,
    messageActivity,
    applicationActivity,
  };
}
export async function caregiverOverview(userId: string) {
  const [
    jobCount,
    applicationCount,
    pendingApplications,
    conversations,
    requests,
    applications,
    reviews,
    verifications,
    professional,
    messages,
  ] = await Promise.all([
    prisma.careRequest.count({ where: { status: 'OPEN', owner: { status: 'ACTIVE' } } }),
    prisma.application.count({ where: { caregiverId: userId } }),
    prisma.application.count({ where: { caregiverId: userId, status: 'PENDING' } }),
    prisma.$queryRaw<
      { count: bigint }[]
    >`SELECT COUNT(*) AS count FROM (SELECT "senderId" AS id FROM "Message" WHERE "recipientId"=${userId}::uuid UNION SELECT "recipientId" AS id FROM "Message" WHERE "senderId"=${userId}::uuid) AS contacts`,
    prisma.careRequest.findMany({
      where: { status: 'OPEN', owner: { status: 'ACTIVE' } },
      include: {
        owner: { select: identity },
        applications: {
          where: { caregiverId: userId, status: { not: 'WITHDRAWN' } },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
    prisma.application.findMany({
      where: { caregiverId: userId },
      include: { request: { include: { owner: { select: identity } } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.review.findMany({
      where: { caregiverId: userId, visible: true },
      include: { author: { select: identity }, caregiver: { select: identity } },
      orderBy: { createdAt: 'desc' },
      take: 2,
    }),
    prisma.verification.findMany({
      where: { userId },
      select: {
        id: true,
        kind: true,
        status: true,
        reference: true,
        reason: true,
        createdAt: true,
      },
    }),
    prisma.professionalProfile.findUnique({
      where: { userId },
      select: { bio: true, qualifications: true, details: true },
    }),
    prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { recipientId: userId }] },
      include: { sender: { select: identity }, recipient: { select: identity } },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);
  return {
    stats: {
      jobCount,
      applicationCount,
      pendingApplications,
      conversationCount: Number(conversations[0]?.count ?? 0),
    },
    requests: requests.map(({ applications, ...r }) => ({
      ...r,
      applied: applications.length > 0,
    })),
    applications,
    reviews,
    verifications,
    professional,
    messages: messages.reverse(),
  };
}
