import { findUniqueProfessionalProfile } from './caregivers.repository.js';
import { validateProfessionalChange } from './profile-policy.js';

import { activeMembership } from '../membership/membership-access.service.js';
export async function checkProfessional(userId: string, data: Record<string, unknown>) {
  const access = await activeMembership(userId);
  const before = await findUniqueProfessionalProfile({ where: { userId } });
  validateProfessionalChange(data, before, access.entitlements);
}
