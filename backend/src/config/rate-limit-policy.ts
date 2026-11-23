import { env } from './env.js';

// Temporary local testing switch; production always enforces limits.
export const rateLimitsDisabled = () =>
  env.NODE_ENV === 'development' && env.DISABLE_RATE_LIMITS === 'true';
