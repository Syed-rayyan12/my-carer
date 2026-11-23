import { z } from 'zod';
import { nameSchema, emailSchema, phoneSchema as phone } from '../auth/auth.validation.js';
const date = z
  .string()
  .refine(
    (value) =>
      !value ||
      (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
        !Number.isNaN(Date.parse(value)) &&
        new Date(value).toISOString().slice(0, 10) === value &&
        value <= new Date().toISOString().slice(0, 10)),
    'Enter a valid date of birth',
  );
export const profileSchema = z.strictObject({
  firstName: nameSchema,
  lastName: nameSchema,
  email: z.union([emailSchema, z.literal('')]),
  phone,
  dateOfBirth: date,
  location: z.string().trim().max(120).default(''),
  address: z.string().trim().max(300),
  postcode: z.string().trim().toUpperCase().max(12),
  about: z.string().trim().max(2000),
  emergencyName: z.string().trim().max(160),
  relationship: z.string().trim().max(80),
  emergencyPhone: phone,
  language: z.enum(['English (UK)', 'Welsh', 'Urdu', 'Punjabi']).default('English (UK)'),
});
