import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './membership.service.js';
export const getMembership = asyncHandler(async (req, res) => {
  const result = await service.getMembership({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postMembershipRequest = asyncHandler(async (req, res) => {
  const result = await service.postMembershipRequest({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postMembershipCancel = asyncHandler(async (req, res) => {
  const result = await service.postMembershipCancel({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const postMembershipChange = asyncHandler(async (req, res) => {
  const result = await service.postMembershipChange({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
