import { z } from 'zod';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { decisionSchema } from './approvals.validation.js';
import * as service from './approvals.service.js';
export const registrations = asyncHandler(async (_req, res) => {
  res.json({ status: 'success', data: await service.registrations() });
});
export const decision = asyncHandler(async (req, res) => {
  const id = z.uuid().parse(req.params.id);
  const input = decisionSchema.parse(req.body);
  if (id === req.auth!.user.id) throw new ApiError(403, 'You cannot approve your own account');
  await service.decideAccount(id, req.auth!.user.id, input.status, input.reason);
  res.json({ status: 'success', message: `Account ${input.status.toLowerCase()}` });
});
