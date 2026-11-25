import { z } from 'zod';

export const submitVerificationSchema = z.strictObject({
  kind: z.enum(['DBS', 'QUALIFICATION', 'IDENTITY', 'RIGHT_TO_WORK']),
  uploadId: z.uuid(),
});
