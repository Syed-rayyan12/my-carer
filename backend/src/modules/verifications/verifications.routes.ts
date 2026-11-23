import { Router } from 'express';
import { requireRole } from '../auth/auth.middleware.js';
import * as controller from './verifications.controller.js';
export const verificationsRouter = Router();
verificationsRouter.get('/verifications', controller.getVerifications);
verificationsRouter.post('/verifications', requireRole('CAREGIVER'), controller.postVerifications);
