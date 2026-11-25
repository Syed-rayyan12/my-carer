import { Router } from 'express';
import { requireHiringAccount } from '../auth/auth.middleware.js';
import * as controller from './care-requests.controller.js';
export const careRequestsRouter = Router();
careRequestsRouter.get('/requests', controller.getRequests);
careRequestsRouter.post('/requests', requireHiringAccount, controller.postRequests);
careRequestsRouter.patch('/requests/:id', controller.patchRequestsById);
