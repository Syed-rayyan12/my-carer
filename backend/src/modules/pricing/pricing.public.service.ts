import { pricingQuerySchema } from './pricing.public.validation.js';
import type { OperationInput } from '../shared/operation.types.js';
import * as repository from './pricing.public.repository.js';

export async function getPlans(context: OperationInput) {
  return {
    statusCode: 200,
    body: {
      data: await repository.listPlans(
        pricingQuerySchema.parse(context.query).includeFamilies === 'true',
      ),
    },
  };
}
