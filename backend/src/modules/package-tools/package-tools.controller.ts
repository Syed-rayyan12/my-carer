import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './package-tools.service.js';
export const getReportsMonthly = asyncHandler(async (req, res) => {
  const result = await service.getReportsMonthly({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const getIntegrationsExport = asyncHandler(async (req, res) => {
  const result = await service.getIntegrationsExport({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const getAnalytics = asyncHandler(async (req, res) => {
  const result = await service.getAnalytics({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const getJobAlerts = asyncHandler(async (req, res) => {
  const result = await service.getJobAlerts({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
