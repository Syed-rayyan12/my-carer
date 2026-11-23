import { Router } from 'express';
import * as controller from './membership.controller.js';
export const membershipRouter = Router();
membershipRouter.get('/membership', controller.getMembership);
membershipRouter.post('/membership/request', controller.postMembershipRequest);
membershipRouter.post('/membership/cancel', controller.postMembershipCancel);
membershipRouter.post('/membership/change', controller.postMembershipChange);
