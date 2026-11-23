import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './organisations.service.js';
export const getOrganisation = asyncHandler(async (req, res) => {
  const result = await service.getOrganisation({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchOrganisation = asyncHandler(async (req, res) => {
  const result = await service.patchOrganisation({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
