import { Router } from 'express';
import { checkDatabase } from '../config/db.js';
import { logger } from '../config/logger.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authRouter } from '../modules/auth/auth.routes.js';
import { adminAuthRouter } from '../modules/admin/approvals.routes.js';
import { seekerRouter } from '../modules/account/care-seekers.routes.js';

export const router = Router();
import { platformRouter } from './platform.routes.js';
router.use('/platform', platformRouter);
router.use('/auth', authRouter);
router.use('/admin', adminAuthRouter);
router.use('/care-seekers', seekerRouter);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

router.get(
  '/health/ready',
  asyncHandler(async (_req, res) => {
    try {
      await checkDatabase();
    } catch (error) {
      logger.error({ err: error }, 'Database readiness check failed');
      throw new ApiError(503, 'Database unavailable');
    }
    res.json({ status: 'ok' });
  }),
);
