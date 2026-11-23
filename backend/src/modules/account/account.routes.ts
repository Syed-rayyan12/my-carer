import { Router } from 'express';
import { get } from './account.controller.js';
export const accountRouter = Router();
accountRouter.get('/account', get);
