import { z } from 'zod';

import { text, uuid } from '../shared/validation.js';
export const createReviewSchema = z.strictObject({
  caregiverId: uuid,
  rating: z.number().int().min(1).max(5),
  body: text(2000),
});
export const responseReviewIdSchema = z.uuid();
export const reviewResponseSchema = z.strictObject({
  response: z.string().trim().min(1).max(2000),
});
export const disputeReviewIdSchema = z.uuid();
export const reviewDisputeSchema = z.strictObject({ reason: z.string().trim().min(1).max(1000) });

export const receivedReviewsSchema = z.enum(['true', 'false']).default('false');
