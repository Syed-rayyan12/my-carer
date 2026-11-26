import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import pino from 'pino';
import { z } from 'zod';
import { billingReturnOriginSchema } from './billing-origin.js';

if (existsSync('.env')) loadEnvFile('.env');

const envSchema = z
  .object({
    STRIPE_ENABLED: z.enum(['true', 'false']).default('false'),
    STRIPE_MODE: z.enum(['test', 'live']).default('test'),
    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
    BILLING_RETURN_ORIGIN: billingReturnOriginSchema.optional(),
    PORT: z.coerce.number().int().min(1).max(65535),
    NODE_ENV: z.enum(['development', 'test', 'production']),
    DATABASE_URL: z.url().refine((value) => /^postgres(?:ql)?:\/\//.test(value), {
      message: 'Must be a PostgreSQL connection URL',
    }),
    CORS_ORIGIN: z
      .string()
      .min(1)
      .refine(
        (value) =>
          value === '*' ||
          value.split(',').every((origin) => {
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
    DISABLE_RATE_LIMITS: z.enum(['true', 'false']).default('false'),
    UPLOAD_DIR: z.string().min(1).default('storage/uploads'),
    TRUST_PROXY: z.coerce.number().int().min(0).default(0),
    DATABASE_POOL_MAX: z.coerce.number().int().min(1).max(100).default(5),
    SESSION_HOURS: z.coerce.number().int().min(1).max(24).default(12),
    SESSION_REMEMBER_DAYS: z.coerce.number().int().min(1).max(30).default(30),
    SESSION_IDLE_MINUTES: z.coerce.number().int().min(5).max(1440).default(60),
    ADMIN_SEED_EMAIL: z.email().optional(),
    ADMIN_SEED_PASSWORD: z.string().min(12).max(128).optional(),
    FRONTEND_TEST_URL: z.url().optional(),
  })
  .superRefine((value, context) => {
    if (value.STRIPE_ENABLED === 'true') {
      if (!value.STRIPE_SECRET_KEY?.startsWith(value.STRIPE_MODE === 'test' ? 'sk_test_' : 'sk_live_'))
        context.addIssue({ code: 'custom', path: ['STRIPE_SECRET_KEY'], message: 'Set a secret key matching STRIPE_MODE' });
      if (!value.STRIPE_WEBHOOK_SECRET)
        context.addIssue({ code: 'custom', path: ['STRIPE_WEBHOOK_SECRET'], message: 'Set the endpoint signing secret' });
      if (!value.BILLING_RETURN_ORIGIN || !value.CORS_ORIGIN.split(',').map(v => v.trim()).includes(value.BILLING_RETURN_ORIGIN))
        context.addIssue({ code: 'custom', path: ['BILLING_RETURN_ORIGIN'], message: 'Use the application frontend origin from CORS_ORIGIN' });
    }
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
