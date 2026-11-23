import type { authenticate } from '../modules/auth/auth.service.js';
declare global {
  namespace Express {
    interface Request {
      auth?: Awaited<ReturnType<typeof authenticate>>;
    }
  }
}
export {};
