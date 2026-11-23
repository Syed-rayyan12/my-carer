import { env } from '../../config/env.js';
import { disconnectDatabase } from '../../config/db.js';
import { logger } from '../../config/logger.js';
import { hashPassword } from './auth.crypto.js';
import { findUserByEmail, provisionAdmin } from './auth.repository.js';
import { passwordSchema } from './auth.validation.js';

try {
  if (!env.ADMIN_SEED_EMAIL || !env.ADMIN_SEED_PASSWORD)
    throw new Error(
      'Set ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD in backend/.env, then rerun. No default admin password is created.',
    );
  const email = env.ADMIN_SEED_EMAIL.trim().toLowerCase();
  if (await findUserByEmail(email))
    throw new Error('This email already exists. Existing credentials have not been changed.');
  await provisionAdmin(email, await hashPassword(passwordSchema.parse(env.ADMIN_SEED_PASSWORD)));
  logger.info('Admin created. Remove ADMIN_SEED_PASSWORD from the environment now.');
} catch (error) {
  logger.error({ err: error }, 'Admin provisioning failed');
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
