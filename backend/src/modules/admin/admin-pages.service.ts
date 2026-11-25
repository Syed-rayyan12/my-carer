import { identity } from '../shared/user-select.js';
import { pagination, paginated } from '../shared/pagination.validation.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as validation from './admin-pages.validation.js';
import * as repository from './admin.repository.js';

const accountSelect = {
  ...identity,
  email: true,
  status: true,
  createdAt: true,
  accountCategory: true,
  profile: { select: { phone: true, location: true } },
  professional: {
    select: {
      location: true,
      experience: true,
      hourlyRatePence: true,
      services: true,
      qualifications: true,
      availability: true,
      details: true,
    },
  },
  organisation: {
    select: { name: true, cqcReference: true, cqcRating: true, cqcVerifiedAt: true },
  },
  membership: { include: { plan: { select: { title: true } } } },
  verifications: { select: { status: true, kind: true, createdAt: true } },
} as const;

export async function getOverview() {
  const [caregivers, seekers, openRequests, pendingVerifications, users, history, jobs, reviews] =
    await Promise.all([
      repository.countUser({ where: { role: 'CAREGIVER' } }),
      repository.countUser({ where: { role: 'CARE_SEEKER' } }),
      repository.countCareRequest({ where: { status: 'OPEN', owner: { status: 'ACTIVE' } } }),
      repository.countVerification({ where: { status: 'PENDING' } }),
      repository.findManyUser({
        where: { role: { in: ['CARE_SEEKER', 'CAREGIVER'] } },
        select: { ...identity, email: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      repository.findManyAccountStatusHistory({
        select: { id: true, toStatus: true, createdAt: true, user: { select: identity } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      repository.findManyCareRequest({
        select: { id: true, title: true, createdAt: true, owner: { select: identity } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      repository.findManyReview({
        select: {
          id: true,
          createdAt: true,
          author: { select: identity },
          caregiver: { select: identity },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);
  const activity = [
    ...users.map((u) => ({
      id: 'registration-' + u.id,
      kind: 'registration' as const,
      text: u.firstName + ' ' + u.lastName + ' registered',
      time: u.createdAt,
    })),
    ...history.map((h) => ({
      id: h.id,
      kind: 'profile' as const,
      text: h.user.firstName + ' account ' + h.toStatus.toLowerCase(),
      time: h.createdAt,
    })),
    ...jobs.map((j) => ({
      id: 'request-' + j.id,
      kind: 'job' as const,
      text: j.owner.firstName + ' posted ' + j.title,
      time: j.createdAt,
    })),
    ...reviews.map((r) => ({
      id: 'review-' + r.id,
      kind: 'review' as const,
      text: r.author.firstName + ' reviewed ' + r.caregiver.firstName,
      time: r.createdAt,
    })),
  ]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 10);
  return { counts: { caregivers, seekers, openRequests, pendingVerifications }, users, activity };
}
export async function getAccounts(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const query = validation.accountsQuery.parse(context.query);
  const where = {
    role: query.role ?? { in: ['CARE_SEEKER', 'CAREGIVER'] as ('CARE_SEEKER' | 'CAREGIVER')[] },
    ...(query.id ? { id: query.id } : {}),
    ...(query.ids ? { id: { in: query.ids } } : {}),
    ...(query.organisations === 'true'
      ? { accountCategory: { in: ['CARE_HOME', 'CARE_AGENCY'] as ('CARE_HOME' | 'CARE_AGENCY')[] } }
      : {}),
  };
  const rows =
    query.view === 'identities'
      ? await repository.findManyUser({
          where,
          select: { ...identity, email: true, status: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          skip,
          take,
        })
      : query.view === 'memberships'
        ? await repository.findManyUser({
            where,
            select: {
              ...identity,
              email: true,
              status: true,
              createdAt: true,
              membership: { include: { plan: { select: { title: true } } } },
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
          })
        : await repository.findManyUser({
            where,
            select: accountSelect,
            orderBy: { createdAt: 'desc' },
            skip,
            take,
          });
  return paginated(rows, page, limit);
}
export async function getRequests(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const query = validation.requestsQuery.parse(context.query);
  return paginated(
    await repository.findManyCareRequest({
      where: {
        ...(query.id ? { id: query.id } : {}),
        ...(query.ownerId ? { ownerId: query.ownerId } : {}),
      },
      include: { owner: { select: identity }, _count: { select: { applications: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    page,
    limit,
  );
}
export async function getReviews(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const query = validation.reviewsQuery.parse(context.query);
  return paginated(
    await repository.findManyReview({
      where: query.caregiverId ? { caregiverId: query.caregiverId } : {},
      include: { author: { select: identity }, caregiver: { select: identity } },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    page,
    limit,
  );
}
export async function getVerifications(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  return paginated(
    await repository.findManyVerification({
      include: {
        user: { select: { ...identity, professional: { select: { location: true } } } },
        upload: { select: { id: true, name: true, type: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    page,
    limit,
  );
}

export async function getApplications(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const query = validation.applicationsQuery.parse(context.query);
  return paginated(
    await repository.findManyApplication({
      where: {
        ...(query.requestId ? { requestId: query.requestId } : {}),
        ...(query.ownerId ? { request: { ownerId: query.ownerId }, status: 'ACCEPTED' } : {}),
      },
      select: {
        id: true,
        requestId: true,
        caregiverId: true,
        status: true,
        createdAt: true,
        caregiver: { select: identity },
        ...(query.ownerId ? { request: { include: { owner: { select: identity } } } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    page,
    limit,
  );
}
