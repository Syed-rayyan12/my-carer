import { Router } from 'express';
import { requireRole, requireHiringAccount } from '../auth/auth.middleware.js';
import * as controller from './applications.controller.js';
export const applicationsRouter = Router();
applicationsRouter.get('/applications', controller.getApplications);
applicationsRouter.post('/applications', requireRole('CAREGIVER'), controller.postApplications);
applicationsRouter.patch('/applications/:id', controller.patchApplicationsById);
applicationsRouter.patch(
  '/applications/:id/arrangement',
  requireHiringAccount,
  controller.patchApplicationsByIdArrangement,
);
applicationsRouter.patch(
  '/applications/:id/shortlist',
  requireHiringAccount,
  controller.patchApplicationsByIdShortlist,
);
