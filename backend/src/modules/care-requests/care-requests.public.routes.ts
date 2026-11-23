import { Router } from 'express';
import * as controller from './care-requests.public.controller.js';
export const careRequestsPublicRouter = Router();
careRequestsPublicRouter.get('/open-requests', controller.getOpenRequests);
