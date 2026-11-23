import { asyncHandler } from '../../utils/asyncHandler.js';
import * as service from './organisations.public.service.js';
export const getOrganisations = asyncHandler(async (req, res) => {
  const result = await service.getOrganisations({
    user: req.auth?.user,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  res.status(result.statusCode).json(result.body);
});
