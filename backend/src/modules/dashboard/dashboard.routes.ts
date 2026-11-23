import { Router } from 'express';
import { get } from './dashboard.controller.js';
export const dashboardRouter = Router();
dashboardRouter.get('/overview', get);
