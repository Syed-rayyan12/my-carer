import { Router } from 'express';
import * as controller from './auth.controller.js';
import {
  requireAuth,
  requireGuest,
  requireOrigin,
  requireCsrf,
  authLimiter,
  signupLimiter,
  passwordWorkLimit,
} from './auth.middleware.js';

export const authRouter = Router();
authRouter.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, private');
  next();
});
authRouter.post(
  '/signup',
  requireOrigin,
  signupLimiter,
  requireGuest,
  passwordWorkLimit,
  controller.signup,
);
authRouter.post(
  '/login',
  requireOrigin,
  authLimiter,
  requireGuest,
  passwordWorkLimit,
  controller.login,
);
authRouter.get('/me', requireAuth, controller.me);
authRouter.post('/logout', requireOrigin, requireAuth, requireCsrf, controller.logout);
authRouter.post(
  '/password',
  requireOrigin,
  requireAuth,
  requireCsrf,
  authLimiter,
  passwordWorkLimit,
  controller.changePassword,
);
