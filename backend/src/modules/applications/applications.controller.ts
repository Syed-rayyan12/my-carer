import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './applications.service.js';
export const getApplications = asyncHandler(async (req, res) => {
  const result = await service.getApplications({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postApplications = asyncHandler(async (req, res) => {
  const result = await service.postApplications({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchApplicationsById = asyncHandler(async (req, res) => {
  const result = await service.patchApplicationsById({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchApplicationsByIdArrangement = asyncHandler(async (req, res) => {
  const result = await service.patchApplicationsByIdArrangement({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchApplicationsByIdShortlist = asyncHandler(async (req, res) => {
  const result = await service.patchApplicationsByIdShortlist({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
