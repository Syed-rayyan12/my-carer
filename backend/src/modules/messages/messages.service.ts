import { pagination, paginated } from '../shared/pagination.validation.js';
import { ApiError } from '../../utils/ApiError.js';
import { requireFeature } from '../membership/plans.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './messages.repository.js';
import * as validation from './messages.validation.js';
import { identity } from '../shared/user-select.js';

export async function getMessages(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  const id = context.user!.id;
  return {
    statusCode: 200,
    body: paginated(
      (
        await repository.findManyMessage({
          where: { OR: [{ senderId: id }, { recipientId: id }] },
          include: { sender: { select: identity }, recipient: { select: identity } },
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          skip,
          take,
        })
      ).reverse(),
      page,
      limit,
    ),
  };
}
export async function postMessages(context: OperationInput) {
  const data = validation.sendMessageSchema.parse(context.body);
  const user = context.user!;
  const recipient = await repository.findUniqueUser({ where: { id: data.recipientId } });
  if (
    !recipient ||
    recipient.status !== 'ACTIVE' ||
    recipient.id === user.id ||
    (user.role === recipient.role &&
      user.role !== 'ADMIN' &&
      !(
        user.role === 'CARE_SEEKER' &&
        ((user.accountCategory === 'CARE_SEEKER' &&
          ['CARE_HOME', 'CARE_AGENCY'].includes(recipient.accountCategory ?? '')) ||
          (recipient.accountCategory === 'CARE_SEEKER' &&
            ['CARE_HOME', 'CARE_AGENCY'].includes(user.accountCategory ?? '')))
      ))
  )
    throw new ApiError(400, 'Choose an active account of the other care role');
  if (user.role !== 'ADMIN' && recipient.role !== 'ADMIN') {
    await requireFeature(user.id, 'directMessages');
    await requireFeature(recipient.id, 'directMessages');
  }
  return {
    statusCode: 201,
    body: { data: await repository.createMessage({ data: { ...data, senderId: user.id } }) },
  };
}
