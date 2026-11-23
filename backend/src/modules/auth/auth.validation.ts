import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js/max';
import { planIds, planRole } from '../membership/plan-policy.js';

export const nameSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[\p{L}\p{M} .'-]+$/u, 'Enter a valid name')
  .refine((value) => /\p{L}/u.test(value), 'Name must contain letters');
export const emailSchema = z.string().trim().toLowerCase().pipe(z.email().max(254));
export const phoneSchema = z
  .string()
  .trim()
  .max(64, 'Enter a UK phone number, for example 07712 345678 or +44 7712 345678')
  .transform((value, context) => {
    if (!value) return '';
    const formatted = value.replace(/[‐‑‒–—]/g, '-');
    const number = parsePhoneNumberFromString(formatted, { defaultCountry: 'GB', extract: false });
    // Validate the UK dialling format, including reserved UK test-number ranges.
    const ukFormat =
      number &&
      (/^[1235789]\d{9}$/.test(number.nationalNumber) ||
        /^1\d{8}$/.test(number.nationalNumber) ||
        number.isValid());
    if (
      !number ||
      number.countryCallingCode !== '44' ||
      !number.isPossible() ||
      !ukFormat ||
      number.ext ||
      !/^[+\d\s()-]+$/.test(formatted)
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Enter a valid UK phone number, for example 07712 345678 or +44 7712 345678',
      });
      return z.NEVER;
    }
    return number.number;
  });
export const passwordSchema = z
  .string()
  .min(12, 'Use at least 12 characters')
  .max(128)
  .refine((value) => !/^\s|\s$/.test(value), 'Password must not start or end with whitespace')
  .refine(
    (value) =>
      !/^(.)\1+$/.test(value) &&
      !['password123!', 'password12345', 'qwerty123456', 'letmein123456', '123456789012'].includes(
        value.toLowerCase(),
      ),
    'Choose a less predictable password',
  );
export const signupSchema = z
  .strictObject({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().max(128),
    consent: z.literal(true),
    role: z.enum(['CARE_SEEKER', 'CAREGIVER']),
    planId: z.enum(planIds).optional(),
    billingInterval: z.enum(['monthly', 'annual']).default('monthly'),
    organisationName: z.string().trim().min(1).max(160).optional(),
    phone: phoneSchema.optional(),
    location: z.string().trim().max(120).optional(),
  })
  .refine((value) => !value.planId || planRole(value.planId) === value.role, {
    path: ['planId'],
    message: 'Choose the account type belonging to this package',
  })
  .refine(
    (value) =>
      !value.planId ||
      !(value.planId.startsWith('HOME_') || value.planId.startsWith('AGENCY_')) ||
      !!value.organisationName,
    { path: ['organisationName'], message: 'Enter your organisation name' },
  )
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });
export const loginSchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1).max(128),
  role: z.enum(['CARE_SEEKER', 'CAREGIVER', 'ADMIN']),
  remember: z.boolean().default(false),
});
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
