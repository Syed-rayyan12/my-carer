import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './admin.service.js';
export const patchAdminMembershipsById = asyncHandler(async (req, res) => {
  const result = await service.patchAdminMembershipsById({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchAdminVerificationsById = asyncHandler(async (req, res) => {
  const result = await service.patchAdminVerificationsById({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchAdminReviewsById = asyncHandler(async (req, res) => {
  const result = await service.patchAdminReviewsById({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchOrganisationsByIdCqc = asyncHandler(async (req, res) => {
  const result = await service.patchOrganisationsByIdCqc({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchUsersByIdProfile = asyncHandler(async (req, res) => {
  const result = await service.patchUsersByIdProfile({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
