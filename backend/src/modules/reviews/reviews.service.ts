import { pagination, paginated } from '../shared/pagination.validation.js';
import { ApiError } from '../../utils/ApiError.js';
import { requireFeature } from '../membership/plans.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './reviews.repository.js';
import * as validation from './reviews.validation.js';
import { identity } from '../shared/user-select.js';

export async function getReviews(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const user = context.user!;
  const received = validation.receivedReviewsSchema.parse(context.query.received) === 'true';
  return {
    statusCode: 200,
    body: paginated(
      await repository.findManyReview({
        where: received
          ? { caregiverId: user.id, visible: true }
          : user.role === 'ADMIN'
            ? {}
            : user.role === 'CAREGIVER'
              ? { caregiverId: user.id, visible: true }
              : { OR: [{ authorId: user.id }, { caregiverId: user.id, visible: true }] },
        include: { author: { select: identity }, caregiver: { select: identity } },
        skip,
        take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      page,
      limit,
    ),
  };
}
export async function postReviews(context: OperationInput) {
  const data = validation.createReviewSchema.parse(context.body);
  const authorId = context.user!.id;
  if (authorId === data.caregiverId || context.user!.role === 'ADMIN')
    throw new ApiError(403, 'You cannot review this account');
  const accepted = await repository.findFirstApplication({
    where: {
      status: 'ACCEPTED',
      OR: [
        { caregiverId: data.caregiverId, request: { ownerId: authorId } },
        { caregiverId: authorId, request: { ownerId: data.caregiverId } },
      ],
    },
  });
  if (!accepted) {
    const [outgoing, incoming] = await Promise.all([
      repository.findFirstMessage({ where: { senderId: authorId, recipientId: data.caregiverId } }),
      repository.findFirstMessage({ where: { senderId: data.caregiverId, recipientId: authorId } }),
    ]);
    if (!outgoing || !incoming)
      throw new ApiError(
        403,
        'Reviews require an accepted application or a two-way enquiry conversation',
      );
  }
  await requireFeature(data.caregiverId, 'reviewsCollect');
  return {
    statusCode: 201,
    body: { data: await repository.createReview({ data: { ...data, authorId } }) },
  };
}
export async function patchReviewsByIdResponse(context: OperationInput) {
  const userId = context.user!.id;
  await requireFeature(userId, 'reviewsRespond');
  const id = validation.responseReviewIdSchema.parse(context.params.id);
  const { response } = validation.reviewResponseSchema.parse(context.body);
  const record = await repository.findUniqueReview({ where: { id } });
  if (!record || record.caregiverId !== userId || !record.visible)
    throw new ApiError(404, 'Review not found');
  return {
    statusCode: 200,
    body: {
      data: await repository.updateReview({
        where: { id },
        data: { response, respondedAt: new Date() },
      }),
    },
  };
}
export async function postReviewsByIdDispute(context: OperationInput) {
  const userId = context.user!.id;
  await requireFeature(userId, 'reviewsDispute');
  const id = validation.disputeReviewIdSchema.parse(context.params.id);
  const { reason } = validation.reviewDisputeSchema.parse(context.body);
  const record = await repository.findUniqueReview({ where: { id } });
  if (!record || record.caregiverId !== userId) throw new ApiError(404, 'Review not found');
  return {
    statusCode: 200,
    body: {
      data: await repository.updateReview({ where: { id }, data: { disputeReason: reason } }),
    },
  };
}

export async function getCandidates(context: OperationInput) {
  return {
    statusCode: 200,
    body: { data: (await repository.reviewCandidates(context.user!.id)).map((a) => a.caregiver) },
  };
}
