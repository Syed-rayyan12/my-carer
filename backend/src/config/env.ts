import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import pino from 'pino';
import { z } from 'zod';

if (existsSync('.env')) loadEnvFile('.env');

const envSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.url().refine((value) => /^postgres(?:ql)?:\/\//.test(value), {
      message: 'Must be a PostgreSQL connection URL',
    }),
    CORS_ORIGIN: z.string().min(1).refine(
      (value) => value === '*' || value.split(',').every((origin) => {
        try {
          const url = new URL(origin.trim());
          return ['http:', 'https:'].includes(url.protocol) && url.origin === origin.trim();
        } catch {
          return false;
        }
      }),
      { message: 'Use * or comma-separated HTTP(S) origins without trailing slashes' },
    ),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().max(2147483647),
    RATE_LIMIT_MAX: z.coerce.number().int().positive(),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
  })
  .superRefine((value, context) => {
    if (value.NODE_ENV === 'production' && value.CORS_ORIGIN === '*') {
      context.addIssue({
        code: 'custom',
        path: ['CORS_ORIGIN'],
        message: 'Wildcard CORS origins are forbidden in production',
      });
    }
  });

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const details = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
  pino().fatal({ errors: details }, 'Invalid environment configuration');
  process.exit(1);
}

export const env = Object.freeze(result.data);
