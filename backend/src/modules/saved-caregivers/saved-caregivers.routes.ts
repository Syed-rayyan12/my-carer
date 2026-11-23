import { Router } from 'express';
import { requireRole } from '../auth/auth.middleware.js';
import * as controller from './saved-caregivers.controller.js';
export const savedCaregiversRouter = Router();
savedCaregiversRouter.get('/saved', requireRole('CARE_SEEKER'), controller.getSaved);
savedCaregiversRouter.post('/saved', requireRole('CARE_SEEKER'), controller.postSaved);
savedCaregiversRouter.delete('/saved/:id', requireRole('CARE_SEEKER'), controller.deleteSavedById);
