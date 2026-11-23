import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './caregivers.service.js';
export const patchProfile = asyncHandler(async (req, res) => {
  const result = await service.patchProfile({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const getProfessional = asyncHandler(async (req, res) => {
  const result = await service.getProfessional({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const patchProfessional = asyncHandler(async (req, res) => {
  const result = await service.patchProfessional({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
export const getCaregivers = asyncHandler(async (req, res) => {
  const result = await service.getCaregivers({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});

export const getProfilePage = asyncHandler(async (req, res) => {
  const result = await service.getProfilePage({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.json(result.body);
});

export const getApplicationProfile = asyncHandler(async (req, res) => {
  const r = await service.getApplicationProfile({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.json(r.body);
});
