import { env } from '../../config/env.js';
import { rateLimitsDisabled } from '../../config/rate-limit-policy.js';
import { ApiError } from '../../utils/ApiError.js';
import * as repository from './auth.repository.js';
import { hashPassword, verifyPassword, newToken, hashToken } from './auth.crypto.js';
import type { LoginInput, SignupInput } from './auth.validation.js';
import type { z } from 'zod';
import type { passwordChangeSchema } from './password.validation.js';
import { isCareSeekerProfileComplete } from './profile-completion.js';

export const publicUser = (user: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  accountCategory?: string | null;
  profile?: {
    phone: string;
    location: string;
    address: string;
    postcode: string;
    about: string;
  } | null;
}) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  status: user.status,
  accountCategory: user.accountCategory ?? null,
  profileComplete: user.role !== 'CARE_SEEKER' || isCareSeekerProfileComplete(user.profile),
});
export const signup = async (input: SignupInput) => {
  if (input.phone && (await repository.findUserByPhone(input.phone)))
    throw new ApiError(
      409,
      'This phone number is already registered. Use another number or sign in.',
    );
  const passwordHash = await hashPassword(input.password);
  await repository.createSeeker(input, passwordHash);
  return {
    status: 'success',
    message: 'Your account is awaiting admin approval. You can sign in after approval.',
  };
};
// Equal-cost password work for missing users, avoiding a trivial timing oracle.
let dummyHash: Promise<string> | undefined;
export const login = async (input: LoginInput) => {
  const user = await repository.findUserByEmail(input.email);
  const stored = user?.passwordHash ?? (await (dummyHash ??= hashPassword(newToken())));
  const valid = await verifyPassword(input.password, stored);
  if (!user || !valid || user.role !== input.role) {
    if (!rateLimitsDisabled() && user && user.role === input.role)
      await repository.recordFailedLogin(user.id);
    throw new ApiError(401, 'Invalid email or password for this account type');
  }
  if (!rateLimitsDisabled() && user.lockedUntil && user.lockedUntil > new Date())
    throw new ApiError(429, 'Too many sign-in attempts. Try again in 15 minutes.');
  if (user.status !== 'ACTIVE')
    throw new ApiError(
      403,
      user.status === 'PENDING'
        ? 'Your account is awaiting admin approval.'
        : 'Your account is not active. Contact support.',
    );
  const token = newToken();
  const durationMs = input.remember
    ? env.SESSION_REMEMBER_DAYS * 86400_000
    : env.SESSION_HOURS * 3600_000;
  await repository.createSession(
    user.id,
    hashToken(token),
    new Date(Date.now() + durationMs),
    user.passwordHash,
  );
  return { user: publicUser(user), token, durationMs, remember: input.remember };
};
export const authenticate = async (token: string, touch = true) => {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new ApiError(401, 'Please sign in');
  const session = await repository.findSession(hashToken(token));
  const now = Date.now();
  if (
    !session ||
    session.revokedAt ||
    session.expiresAt.getTime() <= now ||
    session.lastSeenAt.getTime() + env.SESSION_IDLE_MINUTES * 60_000 <= now ||
    session.user.status !== 'ACTIVE'
  )
    throw new ApiError(401, 'Session expired. Please sign in again.');
  if (touch && now - session.lastSeenAt.getTime() > 60_000)
    await repository.touchSession(session.id, new Date());
  return { sessionId: session.id, user: publicUser(session.user), token };
};

export const logout = (sessionId: string) => repository.revokeSession(sessionId);
export const changePassword = async (
  userId: string,
  input: z.infer<typeof passwordChangeSchema>,
) => {
  const user = await repository.findUserById(userId);
  if (!user || !(await verifyPassword(input.currentPassword, user.passwordHash)))
    throw new ApiError(401, 'Current password is incorrect');
  await repository.replacePassword(
    userId,
    await hashPassword(input.newPassword),
    user.passwordHash,
  );
};
