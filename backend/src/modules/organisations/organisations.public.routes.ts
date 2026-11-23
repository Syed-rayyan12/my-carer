import { Router } from 'express';
import * as controller from './organisations.public.controller.js';
export const organisationsPublicRouter = Router();
organisationsPublicRouter.get('/organisations', controller.getOrganisations);
