import { Router } from 'express';
import * as controller from './package-tools.controller.js';
export const packageToolsRouter = Router();
packageToolsRouter.get('/reports/monthly', controller.getReportsMonthly);
packageToolsRouter.get('/integrations/export', controller.getIntegrationsExport);
packageToolsRouter.get('/analytics', controller.getAnalytics);
packageToolsRouter.get('/job-alerts', controller.getJobAlerts);
