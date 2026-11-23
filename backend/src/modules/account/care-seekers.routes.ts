import { Router } from 'express';
import { requireAuth, requireRole, requireOrigin, requireCsrf } from '../auth/auth.middleware.js';
import * as controller from './account.controller.js';
export const seekerRouter = Router();
seekerRouter.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, private');
  next();
});
seekerRouter.use(requireAuth, requireRole('CARE_SEEKER'));
seekerRouter.get('/me', controller.profile);
seekerRouter.patch('/me', requireOrigin, requireCsrf, controller.saveProfile);
