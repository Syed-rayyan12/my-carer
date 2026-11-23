import { z } from 'zod';
import { phoneSchema } from '../auth/auth.validation.js';

export const safeUrl = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => !value || (/^https:\/\//.test(value) && z.url().safeParse(value).success),
    'Use a complete HTTPS URL',
  );
export const schema = z.strictObject({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(4000),
  address: z.string().trim().max(300),
  postcode: z.string().trim().max(12),
  phone: phoneSchema,
  website: safeUrl,
  coverage: z.string().trim().max(1000),
  services: z.string().trim().max(2000),
  feeRange: z.string().trim().max(200),
  gallery: z.array(safeUrl.pipe(z.string().min(1))),
  team: z.string().trim().max(2000),
  virtualTour: safeUrl,
  branches: z.array(
    z.strictObject({
      name: z.string().trim().min(1).max(160),
      address: z.string().trim().min(1).max(300),
    }),
  ),
  cqcReference: z.string().trim().max(100),
});
export const organisationUpdateSchema = schema;
