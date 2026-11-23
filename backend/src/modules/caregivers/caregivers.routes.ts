import { Router } from 'express';
import { requireRole } from '../auth/auth.middleware.js';
import * as controller from './caregivers.controller.js';
export const caregiversRouter = Router();
caregiversRouter.patch('/profile', requireRole('CAREGIVER'), controller.patchProfile);
caregiversRouter.get('/professional', requireRole('CAREGIVER'), controller.getProfessional);
caregiversRouter.patch('/professional', requireRole('CAREGIVER'), controller.patchProfessional);
caregiversRouter.get('/caregivers', controller.getCaregivers);

caregiversRouter.get('/profile', requireRole('CAREGIVER'), controller.getProfilePage);

caregiversRouter.get(
  '/application-profile',
  requireRole('CAREGIVER'),
  controller.getApplicationProfile,
);
