import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './pricing.public.service.js';
export const getPlans = asyncHandler(async (req, res) => {
  const result = await service.getPlans({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
