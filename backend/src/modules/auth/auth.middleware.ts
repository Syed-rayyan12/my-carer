import type { RequestHandler } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../../config/env.js';
import { rateLimitsDisabled } from '../../config/rate-limit-policy.js';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { authenticate } from './auth.service.js';
import { csrfToken, matchesToken } from './auth.crypto.js';

export const sessionCookieName =
  env.NODE_ENV === 'production' ? '__Host-carer_session' : 'carer_session';
export const readSessionCookie = (header = '') => {
  const values = header
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.startsWith(`${sessionCookieName}=`));
  return values.length === 1 ? values[0]!.slice(sessionCookieName.length + 1) : '';
};
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const passiveCheck =
    req.baseUrl.endsWith('/auth') && req.path === '/me' && req.get('X-Session-Activity') !== '1';
  req.auth = await authenticate(readSessionCookie(req.headers.cookie), !passiveCheck);
  next();
});
export const requireGuest = asyncHandler(async (req, _res, next) => {
  const token = readSessionCookie(req.headers.cookie);
  if (token) {
    try {
      await authenticate(token, false);
    } catch (issue) {
      if (issue instanceof ApiError && issue.statusCode === 401) {
        next();
        return;
      }
      throw issue;
    }
    throw new ApiError(409, 'Sign out before signing into another account');
  }
  next();
});
export const requireRole =
  (role: 'ADMIN' | 'CARE_SEEKER' | 'CAREGIVER'): RequestHandler =>
  (req, _res, next) => {
    if (req.auth?.user.role !== role)
      throw new ApiError(403, 'Access denied for this account type');
    next();
  };
export const requireOrigin: RequestHandler = (req, _res, next) => {
  const allowed = env.CORS_ORIGIN.split(',').map((value) => value.trim());
  if (
    !req.headers.origin ||
    !allowed.includes(req.headers.origin) ||
    req.headers['sec-fetch-site'] === 'cross-site'
  )
    throw new ApiError(403, 'Request origin is not allowed');
  if (!req.is('application/json')) throw new ApiError(415, 'Use application/json');
  next();
};
export const requireCsrf: RequestHandler = (req, _res, next) => {
  const supplied = req.get('X-CSRF-Token') ?? '';
  if (!req.auth || !matchesToken(supplied, csrfToken(req.auth.token)))
    throw new ApiError(403, 'Invalid request token. Refresh and try again.');
  next();
};
export const authLimiter = rateLimit({
  skip: rateLimitsDisabled,
  windowMs: 15 * 60_000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new ApiError(429, 'Too many authentication attempts. Try again later.')),
});
export const signupLimiter = rateLimit({
  skip: rateLimitsDisabled,
  windowMs: 60 * 60_000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  handler: (_req, _res, next) =>
    next(new ApiError(429, 'Too many registrations. Try again later.')),
});
let passwordOperations = 0;
export const passwordWorkLimit: RequestHandler = (_req, res, next) => {
  if (passwordOperations >= 2)
    throw new ApiError(503, 'Sign-in is busy. Please try again shortly.');
  passwordOperations++;
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      passwordOperations--;
    }
  };
  res.once('finish', release);
  res.once('close', release);
  next();
};
