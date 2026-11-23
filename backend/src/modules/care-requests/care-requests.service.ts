import { pagination, paginated } from '../shared/pagination.validation.js';
import { ApiError } from '../../utils/ApiError.js';
import { accessFor } from '../membership/plans.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './care-requests.repository.js';
import * as validation from './care-requests.validation.js';
import { identity } from '../shared/user-select.js';
import { activeMembership } from '../membership/membership-access.service.js';

export async function getRequests(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const user = context.user!;
  const where = {
    ...(context.query.id ? { id: validation.requestIdQuery.parse(context.query.id) } : {}),
    ...(user.role === 'CARE_SEEKER'
      ? { ownerId: user.id }
      : user.role === 'CAREGIVER'
        ? { status: 'OPEN', owner: { status: 'ACTIVE' as const } }
        : {}),
  };
  if (user.role === 'CAREGIVER') {
    const rows = await repository.findManyCareRequest({
      where,
      include: {
        owner: { select: identity },
        applications: {
          where: { caregiverId: user.id, status: { not: 'WITHDRAWN' } },
          select: { id: true },
          take: 1,
        },
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      skip,
      take,
    });
    return {
      statusCode: 200,
      body: paginated(
        rows.map(({ applications, ...row }) => ({ ...row, applied: applications.length > 0 })),
        page,
        limit,
      ),
    };
  }
  const rows = await repository.findManyCareRequest({
    where,
    include: { owner: { select: identity }, _count: { select: { applications: true } } },
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    skip,
    take,
  });
  return { statusCode: 200, body: paginated(rows, page, limit) };
}
export async function postRequests(context: OperationInput) {
  const data = validation.createRequestSchema.parse(context.body);
  const userId = context.user!.id;
  const access = await activeMembership(userId);
  const request = await repository.transaction(async (tx) => {
    await tx.lockUser(userId);
    const count = await tx.countCareRequest({ where: { ownerId: userId, status: 'OPEN' } });
    const limit = access.entitlements.jobLimit;
    if (typeof limit === 'number' && count >= limit)
      throw new ApiError(
        403,
        `Your package allows ${limit} open job postings. Close a posting or change your package.`,
      );
    return tx.createCareRequest({ data: { ...data, ownerId: userId } });
  });
  return { statusCode: 201, body: { data: request } };
}
export async function patchRequestsById(context: OperationInput) {
  const id = validation.requestIdSchema.parse(context.params.id);
  const user = context.user!;
  const record = await repository.findUniqueCareRequest({ where: { id } });
  if (!record || (record.ownerId !== user.id && user.role !== 'ADMIN'))
    throw new ApiError(404, 'Care request not found');
  const data = validation.updateRequestSchema.parse(context.body);
  if (user.role !== 'ADMIN') await activeMembership(user.id);
  const updated = await repository.transaction(async (tx) => {
    if (data.status === 'OPEN' && record.status !== 'OPEN') {
      await tx.lockUser(record.ownerId);
      const access = await accessFor(record.ownerId);
      const limit = access.entitlements.jobLimit;
      if (
        typeof limit === 'number' &&
        (await tx.countCareRequest({ where: { ownerId: record.ownerId, status: 'OPEN' } })) >= limit
      )
        throw new ApiError(403, 'Your package job-posting limit has been reached');
    }
    return tx.updateCareRequest({ where: { id }, data });
  });
  return { statusCode: 200, body: { data: updated } };
}
