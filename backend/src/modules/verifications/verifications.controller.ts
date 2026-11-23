import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './verifications.service.js';
export const getVerifications = asyncHandler(async (req, res) => {
  const result = await service.getVerifications({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postVerifications = asyncHandler(async (req, res) => {
  const result = await service.postVerifications({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
