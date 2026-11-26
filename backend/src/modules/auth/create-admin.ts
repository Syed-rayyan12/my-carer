import { env } from '../../config/env.js';
import { disconnectDatabase } from '../../config/db.js';
import { logger } from '../../config/logger.js';
import { ensureAdmin } from './admin-provisioning.service.js';

try {
  const result = await ensureAdmin(env.ADMIN_SEED_EMAIL, env.ADMIN_SEED_PASSWORD);
  if (result === 'created') logger.info('Admin created. Remove ADMIN_SEED_PASSWORD from the environment now.');
  else if (result === 'exists') logger.info('Admin already exists. Provisioning skipped; existing credentials preserved.');
  else logger.info('Admin provisioning skipped: no seed variables configured.');
} catch (error) {
  logger.error({ err: error }, 'Admin provisioning failed');
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
