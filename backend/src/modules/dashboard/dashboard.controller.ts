import { asyncHandler } from '../../utils/asyncHandler.js';
import { getOverview } from './dashboard.service.js';
export const get = asyncHandler(async (req, res) => {
  res.json({ data: await getOverview(req.auth!.user.id, req.auth!.user.role) });
});
