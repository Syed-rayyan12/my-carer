import { Router } from 'express';
import * as controller from './organisations.controller.js';
export const organisationsRouter = Router();
organisationsRouter.get('/organisation', controller.getOrganisation);
organisationsRouter.patch('/organisation', controller.patchOrganisation);
