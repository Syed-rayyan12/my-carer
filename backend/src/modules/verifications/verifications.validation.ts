import { z } from 'zod';

import { text } from '../shared/validation.js';
export const submitVerificationSchema = z.strictObject({
  kind: z.enum(['DBS', 'QUALIFICATION', 'IDENTITY', 'RIGHT_TO_WORK']),
  reference: text(300),
});
