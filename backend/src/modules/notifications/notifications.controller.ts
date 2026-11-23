import { asyncHandler } from '../../utils/asyncHandler.js';
import { list } from './notifications.service.js';
export const get = asyncHandler(async (req, res) => {
  res.json({ data: await list(req.auth!.user.id, req.auth!.user.role) });
});
