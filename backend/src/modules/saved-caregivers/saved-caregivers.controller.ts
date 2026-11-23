import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './saved-caregivers.service.js';
export const getSaved = asyncHandler(async (req, res) => {
  const result = await service.getSaved({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postSaved = asyncHandler(async (req, res) => {
  const result = await service.postSaved({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const deleteSavedById = asyncHandler(async (req, res) => {
  const result = await service.deleteSavedById({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
