import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './caregivers.public.service.js';
export const getDirectoryProfile = asyncHandler(async (req, res) => {
  const result = await service.getDirectoryProfile({ user: req.auth?.user, body: req.body, params: req.params, query: req.query });
  res.status(result.statusCode).json(result.body);
});
export const getDirectory = asyncHandler(async (req, res) => {
  const result = await service.getDirectory({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
