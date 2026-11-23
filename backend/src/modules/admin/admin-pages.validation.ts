import { z } from 'zod';
export const accountsQuery = z.object({
  role: z.enum(['CAREGIVER', 'CARE_SEEKER']).optional(),
  id: z.uuid().optional(),
  ids: z
    .string()
    .transform((v) => v.split(','))
    .pipe(z.array(z.uuid()).max(100))
    .optional(),
  organisations: z.enum(['true', 'false']).optional(),
  view: z.enum(['accounts', 'memberships', 'identities']).default('accounts'),
});
export const requestsQuery = z.object({ id: z.uuid().optional(), ownerId: z.uuid().optional() });
export const reviewsQuery = z.object({ caregiverId: z.uuid().optional() });

export const applicationsQuery = z.object({
  requestId: z.uuid().optional(),
  ownerId: z.uuid().optional(),
});
