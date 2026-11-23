import { Router } from 'express';
import * as controller from './caregivers.public.controller.js';
export const caregiversPublicRouter = Router();
caregiversPublicRouter.get('/directory', controller.getDirectory);
caregiversPublicRouter.get('/directory/:id', controller.getDirectoryProfile);
