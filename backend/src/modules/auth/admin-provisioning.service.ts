import { findUserByEmail, provisionAdmin } from './auth.repository.js';
import { hashPassword } from './auth.crypto.js';
import { passwordSchema } from './auth.validation.js';

export async function ensureAdmin(email?: string, password?: string) {
  if (!email && !password) return 'not-configured' as const;
  if (!email) throw new Error('ADMIN_SEED_EMAIL is required when an admin password is configured.');
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await findUserByEmail(normalizedEmail);
  if (existing) {
    if (existing.role === 'ADMIN' && existing.status === 'ACTIVE') return 'exists' as const;
    throw new Error('The admin seed email belongs to a non-admin or inactive account. No privileges or credentials were changed.');
  }
  if (!password) throw new Error('ADMIN_SEED_PASSWORD is required to create the first admin.');
  const hash = await hashPassword(passwordSchema.parse(password));
  try {
    await provisionAdmin(normalizedEmail, hash);
  } catch (error) {
    // Two deploying instances can provision simultaneously. Only an already
    // active admin is a safe no-op; never convert a customer to an admin.
    const concurrent = await findUserByEmail(normalizedEmail);
    if (concurrent?.role === 'ADMIN' && concurrent.status === 'ACTIVE') return 'exists' as const;
    throw error;
  }
  return 'created' as const;
}
