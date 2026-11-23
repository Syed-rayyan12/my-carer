import { profileSchema } from '../account/account.validation.js';
import { z } from 'zod';

import { detailsSchema } from '../shared/validation.js';
export const professionalSchema = z.strictObject({
  bio: z.string().max(2000),
  location: z.string().max(120),
  qualifications: z.string().max(2000),
  experience: z.string().max(2000),
  hourlyRatePence: z.number().int().min(0).max(1000000),
  travelRadiusMiles: z.number().int().min(0).max(500),
  services: z.string().max(2000),
  availability: z.string().max(2000),
  references: z.string().max(2000),
  details: detailsSchema.optional(),
});

export const caregiverProfileSchema = profileSchema.extend({ professional: professionalSchema });
export const professionalUpdateSchema = professionalSchema.partial();
export const professionalSectionSchema = z
  .enum(['profile', 'services', 'availability', 'job-preferences'])
  .default('profile');
export const caregiverSearchSchema = z.string().max(120);
