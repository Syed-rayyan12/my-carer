import { ApiError } from '../../utils/ApiError.js';
import { accessFor } from './plans.js';

export const activeMembership = async (id: string) => {
  const access = await accessFor(id);
  if (!access.active)
    throw new ApiError(
      402,
      'Your package trial or paid period has ended. Open Membership to renew.',
    );
  return access;
};
