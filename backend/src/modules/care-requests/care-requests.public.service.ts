import { pagination } from '../shared/pagination.validation.js';

import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './care-requests.public.repository.js';

export async function getOpenRequests(context: OperationInput) {
  const { skip, take } = pagination(context.query);
  return {
    statusCode: 200,
    body: {
      data: await repository.findManyCareRequest({
        where: { status: 'OPEN', owner: { status: 'ACTIVE' } },
        select: { id: true, title: true, location: true, budgetPence: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
    },
  };
}
