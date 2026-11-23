import type { CookieOptions } from 'express';
import { env } from '../../config/env.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { signupSchema, loginSchema } from './auth.validation.js';
import * as service from './auth.service.js';
import { passwordChangeSchema } from './password.validation.js';
import { sessionCookieName } from './auth.middleware.js';
import { csrfToken } from './auth.crypto.js';

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};
export const signup = asyncHandler(async (req, res) => {
  res.status(201).json(await service.signup(signupSchema.parse(req.body)));
});
export const login = asyncHandler(async (req, res) => {
  const result = await service.login(loginSchema.parse(req.body));
  res.cookie(sessionCookieName, result.token, {
    ...cookieOptions,
    ...(result.remember ? { maxAge: result.durationMs } : {}),
  });
  res.json({ status: 'success', data: { user: result.user, csrfToken: csrfToken(result.token) } });
});
export const me = asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    data: { user: req.auth!.user, csrfToken: csrfToken(req.auth!.token) },
  });
});
export const logout = asyncHandler(async (req, res) => {
  await service.logout(req.auth!.sessionId);
  res.clearCookie(sessionCookieName, cookieOptions);
  res.json({ status: 'success', message: 'Signed out' });
});
export const changePassword = asyncHandler(async (req, res) => {
  await service.changePassword(req.auth!.user.id, passwordChangeSchema.parse(req.body));
  res.clearCookie(sessionCookieName, cookieOptions);
  res.json({ status: 'success', message: 'Password changed. All devices have been signed out.' });
});
