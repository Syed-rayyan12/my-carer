import type { AccountStatus } from '../../generated/prisma/client.js';
import * as repository from './approvals.repository.js';
export const registrations = () => repository.listRegistrations();
export const decideAccount = (
  id: string,
  actorId: string,
  status: AccountStatus,
  reason?: string,
) => repository.decideAccount(id, actorId, status, reason);
