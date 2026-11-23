import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { ApiError } from '../../utils/ApiError.js';

// OWASP scrypt configuration: N=2^17, r=8, p=1 (128 MiB per hash).
let activeHashes = 0;
const derive = async (password: string, salt: string): Promise<Buffer> => {
  if (activeHashes >= 2) throw new ApiError(503, 'Sign-in is busy. Please try again shortly.');
  activeHashes++;
  try {
    return await new Promise<Buffer>((resolve, reject) => {
      scrypt(
        password,
        salt,
        64,
        { N: 131072, r: 8, p: 1, maxmem: 160 * 1024 * 1024 },
        (error, key) => (error ? reject(error) : resolve(key)),
      );
    });
  } finally {
    activeHashes--;
  }
};
export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex');
  return `scrypt$${salt}$${(await derive(password, salt)).toString('hex')}`;
};
export const verifyPassword = async (password: string, stored: string) => {
  const [algorithm, salt, key] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !key || !/^[a-f0-9]{128}$/.test(key)) return false;
  return timingSafeEqual(await derive(password, salt), Buffer.from(key, 'hex'));
};
export const newToken = () => randomBytes(32).toString('hex');
export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const csrfToken = (sessionToken: string) =>
  createHmac('sha256', sessionToken).update('carer-csrf-v1').digest('hex');
export const matchesToken = (actual: string, expected: string) =>
  /^[a-f0-9]{64}$/.test(actual) &&
  timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
