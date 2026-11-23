import { z } from 'zod';
import { planIds } from './plan-policy.js';

export const changeMembershipSchema = z.strictObject({
  planId: z.enum(planIds),
  billingInterval: z.enum(['monthly', 'annual']),
});
