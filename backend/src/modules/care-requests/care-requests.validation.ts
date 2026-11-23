import { uuid } from '../shared/validation.js';
import { z } from 'zod';

import { text, detailsSchema } from '../shared/validation.js';
export const requestSchema = z.strictObject({
  title: text(160),
  description: text(4000),
  location: text(120),
  budgetPence: z.number().int().min(1).max(1000000),
  fundingType: text(100),
  tasks: text(2000),
  schedule: text(2000),
  details: detailsSchema.optional(),
});

export const createRequestSchema = requestSchema;
export const requestIdSchema = uuid;
export const updateRequestSchema = requestSchema
  .partial()
  .extend({ status: z.enum(['OPEN', 'CLOSED']).optional() })
  .strict();

export const requestIdQuery = z.uuid();
