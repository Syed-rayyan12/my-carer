import * as pages from './admin-pages.controller.js';
import { Router } from 'express';
import { requireRole } from '../auth/auth.middleware.js';
import * as controller from './admin.controller.js';
export const adminRouter = Router();
adminRouter.use('/admin', requireRole('ADMIN'));
adminRouter.get('/admin/overview', pages.overview);
adminRouter.get('/admin/users', pages.accounts);
adminRouter.get('/admin/requests', pages.requests);
adminRouter.get('/admin/reviews', pages.reviews);
adminRouter.get('/admin/verifications', pages.verifications);
adminRouter.patch(
  '/admin/memberships/:id',
  requireRole('ADMIN'),
  controller.patchAdminMembershipsById,
);
adminRouter.patch(
  '/admin/verifications/:id',
  requireRole('ADMIN'),
  controller.patchAdminVerificationsById,
);
adminRouter.patch('/admin/reviews/:id', requireRole('ADMIN'), controller.patchAdminReviewsById);
adminRouter.patch('/admin/organisations/:id/cqc', controller.patchOrganisationsByIdCqc);

adminRouter.patch('/admin/users/:id/profile', controller.patchUsersByIdProfile);

adminRouter.get('/admin/applications', pages.applications);
