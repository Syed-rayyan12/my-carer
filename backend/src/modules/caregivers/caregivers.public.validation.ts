import { z } from 'zod';

export const directorySearchSchema = z.string().trim().max(120);
export const directoryOrderSchema = z.enum(['featured', 'latest']).default('featured');
export const directoryLimitSchema = z.coerce.number().int().min(1).max(100).default(100);
