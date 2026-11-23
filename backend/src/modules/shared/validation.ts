import { z } from 'zod';

export const text = (max: number) => z.string().trim().min(1).max(max);
export const uuid = z.uuid();
export const detailsSchema = z
  .record(z.string().max(80), z.json())
  .refine((value) => JSON.stringify(value).length <= 10000, 'Profile details are too large');
