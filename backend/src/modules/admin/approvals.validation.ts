import { z } from 'zod';
export const decisionSchema = z
  .strictObject({
    status: z.enum(['ACTIVE', 'REJECTED', 'SUSPENDED']),
    reason: z.string().trim().min(1).max(1000).optional(),
  })
  .refine((value) => value.status === 'ACTIVE' || !!value.reason, {
    path: ['reason'],
    message: 'A reason is required',
  });
