import { requireFeature } from '../membership/plans.js';
import { addCalendarMonths } from '../membership/plan-policy.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './package-tools.repository.js';
import * as validation from './package-tools.validation.js';

export async function getReportsMonthly(context: OperationInput) {
  await requireFeature(context.user!.id, 'monthlyReport');
  const month = validation.reportMonthSchema.parse(
    context.query.month ?? new Date().toISOString().slice(0, 7),
  );
  const from = new Date(`${month}-01T00:00:00Z`);
  const to = addCalendarMonths(from, 1);
  const createdAt = { gte: from, lt: to };
  const userId = context.user!.id;
  const [postings, applications, messages, reviews] = await Promise.all([
    repository.countCareRequest({ where: { ownerId: userId, createdAt } }),
    repository.countApplication({ where: { request: { ownerId: userId }, createdAt } }),
    repository.countMessage({ where: { recipientId: userId, createdAt } }),
    repository.aggregateReview({
      where: { caregiverId: userId, visible: true, createdAt },
      _count: true,
      _avg: { rating: true },
    }),
  ]);
  return {
    statusCode: 200,
    body: {
      data: {
        month,
        jobPostings: postings,
        incomingApplications: applications,
        incomingMessages: messages,
        reviews: reviews._count,
        averageRating: reviews._avg.rating,
      },
    },
  };
}
export async function getIntegrationsExport(context: OperationInput) {
  await requireFeature(context.user!.id, 'apiAccess');
  return {
    statusCode: 200,
    body: {
      data: {
        exportedAt: new Date(),
        organisation: await repository.findUniqueOrganisationProfile({
          where: { userId: context.user!.id },
        }),
        jobs: await repository.findManyCareRequest({
          where: { ownerId: context.user!.id },
          include: {
            applications: {
              select: {
                id: true,
                status: true,
                coverLetter: true,
                createdAt: true,
                caregiver: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    professional: {
                      select: { qualifications: true, services: true, experience: true },
                    },
                  },
                },
              },
            },
          },
        }),
      },
    },
  };
}
export async function getAnalytics(context: OperationInput) {
  await requireFeature(context.user!.id, 'analytics');
  const userId = context.user!.id;
  const [jobs, applications, messages, reviews] = await Promise.all([
    repository.countCareRequest({ where: { ownerId: userId } }),
    repository.countApplication({
      where:
        context.user!.role === 'CAREGIVER'
          ? { caregiverId: userId }
          : { request: { ownerId: userId } },
    }),
    repository.countMessage({ where: { recipientId: userId } }),
    repository.aggregateReview({
      where: { caregiverId: userId, visible: true },
      _count: true,
      _avg: { rating: true },
    }),
  ]);
  return {
    statusCode: 200,
    body: {
      data: {
        jobs,
        applications,
        incomingMessages: messages,
        reviews: reviews._count,
        averageRating: reviews._avg.rating,
      },
    },
  };
}
export async function getJobAlerts(context: OperationInput) {
  await requireFeature(context.user!.id, 'jobAlerts');
  const user = await repository.findUniqueUser({
    where: { id: context.user!.id },
    include: { professional: true },
  });
  const location = user?.professional?.location ?? '';
  return {
    statusCode: 200,
    body: {
      data: await repository.findManyCareRequest({
        where: {
          status: 'OPEN',
          owner: { status: 'ACTIVE', accountCategory: { in: ['CARE_AGENCY', 'CARE_HOME'] } },
          ...(location ? { location: { contains: location, mode: 'insensitive' } } : {}),
        },
        select: { id: true, title: true, location: true, budgetPence: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    },
  };
}
