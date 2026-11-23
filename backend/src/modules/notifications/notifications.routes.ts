import { Router } from 'express';
import { get } from './notifications.controller.js';
import { z } from 'zod';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { update } from './notifications.service.js';
export const notificationsRouter = Router();
notificationsRouter.get('/notifications', get);
notificationsRouter.patch('/notifications', asyncHandler(async (req, res) => {
  const input = z.strictObject({ id: z.string().max(200).optional(), action: z.enum(['read', 'unread', 'dismiss', 'restore', 'read-all']) }).parse(req.body);
  await update(req.auth!.user.id, req.auth!.user.role, input);
  res.json({ data: null });
}));
