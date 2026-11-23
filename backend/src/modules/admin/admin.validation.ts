import { z } from 'zod';
import { nameSchema, phoneSchema } from '../auth/auth.validation.js';

import { text, uuid } from '../shared/validation.js';
import { adminAvailabilitySchema } from '../caregivers/availability.validation.js';
export const membershipUserIdSchema = uuid;
export const activateMembershipSchema = z.strictObject({
  paidThrough: z.iso.datetime(),
  paymentReference: text(160),
});
export const verificationDecisionSchema = z.strictObject({
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: text(1000),
});
export const verificationIdSchema = uuid;
export const reviewVisibilitySchema = z.strictObject({ visible: z.boolean() });
export const reviewIdSchema = uuid;
export const organisationUserIdSchema = z.uuid();
export const cqcVerificationSchema = z.strictObject({
  rating: z.enum(['Outstanding', 'Good', 'Requires improvement', 'Inadequate', 'Not rated']),
  sourceUrl: z
    .url()
    .max(100)
    .refine((value) => {
      const url = new URL(value);
      return (
        url.protocol === 'https:' &&
        (url.hostname === 'www.cqc.org.uk' || url.hostname === 'cqc.org.uk')
      );
    }, 'Use the official CQC record URL'),
});
export const userIdSchema = z.uuid();
export const updateUserProfileSchema = z.strictObject({
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  location: z.string().trim().max(120),
  hourlyRatePence: z.number().int().min(0).max(1000000).optional(),
  availability: z.string().max(2000).optional(),
  availabilitySchedule: adminAvailabilitySchema.optional(),
  services: z.string().max(2000).optional(),
  qualifications: z.string().max(2000).optional(),
});
