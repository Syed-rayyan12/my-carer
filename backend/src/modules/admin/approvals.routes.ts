import { Router } from 'express';
import { requireAuth, requireRole, requireOrigin, requireCsrf } from '../auth/auth.middleware.js';
import * as controller from './approvals.controller.js';
export const adminAuthRouter = Router();
adminAuthRouter.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store, private');
  next();
});
adminAuthRouter.use(requireAuth, requireRole('ADMIN'));
adminAuthRouter.get('/registrations', controller.registrations);
adminAuthRouter.patch('/registrations/:id/status', requireOrigin, requireCsrf, controller.decision);
