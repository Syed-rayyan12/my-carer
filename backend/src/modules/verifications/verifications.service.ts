import { pagination, paginated } from '../shared/pagination.validation.js';
import { requireFeature } from '../membership/plans.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './verifications.repository.js';
import * as validation from './verifications.validation.js';
import { identity } from '../shared/user-select.js';

export async function getVerifications(context: OperationInput) {
  const { page, limit, skip, take } = pagination(context.query);
  return {
    statusCode: 200,
    body: paginated(
      await repository.findManyVerification({
        where: context.user!.role === 'ADMIN' ? {} : { userId: context.user!.id },
        include: { user: { select: identity } },
        skip,
        take,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      }),
      page,
      limit,
    ),
  };
}
export async function postVerifications(context: OperationInput) {
  const data = validation.submitVerificationSchema.parse(context.body);
  await requireFeature(
    context.user!.id,
    data.kind === 'QUALIFICATION' ? 'qualifications' : data.kind === 'DBS' ? 'dbs' : 'rightToWork',
  );
  return {
    statusCode: 201,
    body: {
      data: await repository.createVerification({ data: { ...data, userId: context.user!.id } }),
    },
  };
}
