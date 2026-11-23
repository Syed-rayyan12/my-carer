import { z } from 'zod';

import { text, uuid } from '../shared/validation.js';
export const verificationFilterSchema = z.enum(['DBS', 'QUALIFICATION']).optional();
export const createApplicationSchema = z.strictObject({
  requestId: uuid,
  coverLetter: text(2000),
  details: z
    .strictObject({
      hourlyRatePence: z.number().int().min(1).max(1000000),
      availability: text(2000),
    })
    .optional(),
});
export const applicationIdSchema = uuid;
export const applicationStatusSchema = z.strictObject({
  status: z.enum(['ACCEPTED', 'REJECTED', 'WITHDRAWN']),
});
export const arrangementApplicationIdSchema = uuid;
export const arrangementSchema = z.strictObject({
  status: z.enum(['upcoming', 'active', 'completed']),
  startDate: z.iso.date(),
  schedule: text(2000),
  location: text(120),
  notes: z.string().max(2000),
});
export const shortlistApplicationIdSchema = uuid;
export const shortlistSchema = z.strictObject({ shortlisted: z.boolean() });

export const requestIdQuery = z.uuid();
export const applicationStatusQuery = z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN']);
