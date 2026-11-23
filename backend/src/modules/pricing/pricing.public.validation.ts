import { z } from 'zod';
export const pricingQuerySchema = z.object({
  includeFamilies: z.enum(['true', 'false']).default('false'),
});
