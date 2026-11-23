import { asyncHandler } from '../../utils/asyncHandler.js';
import { getAccount } from './account.service.js';
export const get = asyncHandler(async (req, res) => {
  res.json({ data: await getAccount(req.auth!.user.id) });
});

import * as service from './account.service.js';
import { profileSchema } from './account.validation.js';
export const profile = asyncHandler(async (req, res) => {
  res.json({ status: 'success', data: await service.getProfile(req.auth!.user.id) });
});
export const saveProfile = asyncHandler(async (req, res) => {
  res.json({
    status: 'success',
    data: await service.saveProfile(req.auth!.user.id, profileSchema.parse(req.body)),
  });
});
