import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './care-requests.public.service.js';
export const getOpenRequests = asyncHandler(async (req, res) => {
  const result = await service.getOpenRequests({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
