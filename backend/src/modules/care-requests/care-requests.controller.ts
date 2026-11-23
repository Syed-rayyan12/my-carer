import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './care-requests.service.js';
export const getRequests = asyncHandler(async (req, res) => {
  const result = await service.getRequests({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postRequests = asyncHandler(async (req, res) => {
  const result = await service.postRequests({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchRequestsById = asyncHandler(async (req, res) => {
  const result = await service.patchRequestsById({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
