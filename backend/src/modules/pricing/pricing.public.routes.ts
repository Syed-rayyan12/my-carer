import { Router } from 'express';
import * as controller from './pricing.public.controller.js';
export const pricingPublicRouter = Router();
pricingPublicRouter.get('/plans', controller.getPlans);
