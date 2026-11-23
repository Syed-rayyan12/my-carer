import { pagination, paginated } from '../shared/pagination.validation.js';
import { ApiError } from '../../utils/ApiError.js';
import { requireFeature } from '../membership/plans.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './applications.repository.js';
import * as validation from './applications.validation.js';
import { publicCaregiver } from '../caregivers/directory-policy.js';
import { publicProfessional } from '../shared/user-select.js';
import { identity } from '../shared/user-select.js';
import { activeMembership } from '../membership/membership-access.service.js';

export async function getApplications(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const user = context.user!;
  const verification = validation.verificationFilterSchema.parse(context.query.verification);
  if (verification) await requireFeature(user.id, 'candidateFilters');
  if (user.role === 'CAREGIVER') {
    const rows = await repository.findManyApplication({
      where: {
        caregiverId: user.id,
        ...(context.query.requestId
          ? { requestId: validation.requestIdQuery.parse(context.query.requestId) }
          : {}),
        ...(context.query.status
          ? { status: validation.applicationStatusQuery.parse(context.query.status) }
          : {}),
        ...(verification
          ? { caregiver: { verifications: { some: { kind: verification, status: 'APPROVED' } } } }
          : {}),
      },
      include: { request: { include: { owner: { select: identity } } } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take,
    });
    return { statusCode: 200, body: paginated(rows, page, limit) };
  }
  return {
    statusCode: 200,
    body: paginated(
      (
        await repository.findManyApplication({
          where: {
            ...(context.query.requestId
              ? { requestId: validation.requestIdQuery.parse(context.query.requestId) }
              : {}),
            ...(context.query.status
              ? { status: validation.applicationStatusQuery.parse(context.query.status) }
              : {}),
            ...(verification
              ? {
                  caregiver: {
                    verifications: { some: { kind: verification, status: 'APPROVED' } },
                  },
                }
              : {}),
            ...(user.role === 'CARE_SEEKER' ? { request: { ownerId: user.id } } : {}),
          },
          include: {
            caregiver: {
              select: {
                ...identity,
                membership: { include: { plan: true } },
                professional: { select: publicProfessional },
                verifications: { where: { status: 'APPROVED' }, select: { kind: true } },
                reviewsReceived: { where: { visible: true }, select: { rating: true } },
                savedBy: { where: { userId: user.id }, select: { userId: true } },
              },
            },
            request: { include: { owner: { select: identity } } },
          },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          skip,
          take,
        })
      ).map((row) => {
        const { savedBy, ...person } = row.caregiver;
        return { ...row, caregiver: { ...publicCaregiver(person), saved: savedBy.length > 0 } };
      }),
      page,
      limit,
    ),
  };
}
export async function postApplications(context: OperationInput) {
  const data = validation.createApplicationSchema.parse(context.body);
  await activeMembership(context.user!.id);
  const record = await repository.findUniqueCareRequest({
    where: { id: data.requestId },
    include: { owner: true },
  });
  if (!record || record.status !== 'OPEN' || record.owner.status !== 'ACTIVE')
    throw new ApiError(409, 'Care request is unavailable');
  return {
    statusCode: 201,
    body: {
      data: await repository.createApplication({
        data: { ...data, caregiverId: context.user!.id },
      }),
    },
  };
}
export async function patchApplicationsById(context: OperationInput) {
  const id = validation.applicationIdSchema.parse(context.params.id);
  const { status } = validation.applicationStatusSchema.parse(context.body);
  const user = context.user!;
  const result = await repository.transaction(async (tx) => {
    const item = await tx.findUniqueApplication({ where: { id }, include: { request: true } });
    if (
      !item ||
      (status === 'WITHDRAWN' ? item.caregiverId !== user.id : item.request.ownerId !== user.id)
    )
      throw new ApiError(404, 'Application not found');
    const changed = await tx.updateManyApplication({
      where: { id, status: 'PENDING' },
      data: { status },
    });
    if (!changed.count) throw new ApiError(409, 'Application already decided');
    return tx.findUniqueApplication({ where: { id } });
  });
  return { statusCode: 200, body: { data: result } };
}
export async function patchApplicationsByIdArrangement(context: OperationInput) {
  const id = validation.arrangementApplicationIdSchema.parse(context.params.id);
  const input = validation.arrangementSchema.parse(context.body);
  const application = await repository.findUniqueApplication({
    where: { id },
    include: { request: true },
  });
  if (
    !application ||
    application.request.ownerId !== context.user!.id ||
    application.status !== 'ACCEPTED'
  )
    throw new ApiError(404, 'Accepted arrangement not found');
  const details =
    application.details &&
    typeof application.details === 'object' &&
    !Array.isArray(application.details)
      ? application.details
      : {};
  return {
    statusCode: 200,
    body: {
      data: await repository.updateApplication({
        where: { id },
        data: { details: { ...details, arrangement: input } },
      }),
    },
  };
}
export async function patchApplicationsByIdShortlist(context: OperationInput) {
  const id = validation.shortlistApplicationIdSchema.parse(context.params.id);
  const input = validation.shortlistSchema.parse(context.body);
  await requireFeature(context.user!.id, 'shortlist');
  const application = await repository.findUniqueApplication({
    where: { id },
    include: { request: true },
  });
  if (!application || application.request.ownerId !== context.user!.id)
    throw new ApiError(404, 'Application not found');
  const details =
    application.details &&
    typeof application.details === 'object' &&
    !Array.isArray(application.details)
      ? application.details
      : {};
  return {
    statusCode: 200,
    body: {
      data: await repository.updateApplication({
        where: { id },
        data: { details: { ...details, shortlisted: input.shortlisted } },
      }),
    },
  };
}
