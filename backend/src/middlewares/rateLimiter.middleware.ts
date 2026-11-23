import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { rateLimitsDisabled } from '../config/rate-limit-policy.js';

export const isPublicPlansRequest = (req: { method: string; path: string }) =>
  ['GET', 'HEAD'].includes(req.method) && /^\/api\/v1\/platform\/plans\/?$/.test(req.path);

// Pricing reads have a separate budget from authenticated dashboard traffic.
export const publicPlansLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => rateLimitsDisabled() || !isPublicPlansRequest(req),
  handler: (_req, _res, next) => next(new ApiError(429, 'Too many package requests. Try again shortly.')),
});

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => rateLimitsDisabled() || isPublicPlansRequest(req),
  handler: (_req, _res, next) => next(new ApiError(429, 'Too many requests')),
});
