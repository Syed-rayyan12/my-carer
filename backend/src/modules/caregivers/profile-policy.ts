import { ApiError } from '../../utils/ApiError.js';
import type { Entitlements } from '../membership/plan-policy.js';
const object = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
const meaningful = (v: unknown): boolean =>
  Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim().length > 0 : !!v;
export function validateProfessionalChange(
  data: Record<string, unknown>,
  before: Record<string, unknown> | null,
  entitlements: Entitlements,
) {
  const old = before ?? {};
  const details = object(data.details);
  const oldDetails = object(old.details);
  const profile = object(details.profile);
  const oldProfile = object(oldDetails.profile);
  const check = (feature: string, value: unknown, previous: unknown, label: string) => {
    if (
      entitlements[feature] !== true &&
      meaningful(value) &&
      JSON.stringify(value) !== JSON.stringify(previous)
    )
      throw new ApiError(
        403,
        `Your package does not include ${label}. Change your package in Membership.`,
      );
  };
  check('bio', data.bio, old.bio, 'a profile bio');
  check('bio', profile.about, oldProfile.about, 'a profile bio');
  check('bio', profile.photo, oldProfile.photo, 'a profile photo');
  check('qualifications', data.qualifications, old.qualifications, 'qualifications');
  check('qualifications', profile.qualifications, oldProfile.qualifications, 'qualifications');
  check('availability', data.availability, old.availability, 'an availability calendar');
  check('availability', details.availability, oldDetails.availability, 'an availability calendar');
  check('availability', details.timeOff, oldDetails.timeOff, 'availability time off');
  const limit = entitlements.specialismsLimit;
  const services =
    typeof data.services === 'string' ? data.services.split(/[,\n]/).filter((s) => s.trim()) : [];
  const detailServices = Array.isArray(details.services)
    ? details.services.filter((v) => object(v).shown !== false)
    : [];
  if (typeof limit === 'number' && Math.max(services.length, detailServices.length) > limit)
    throw new ApiError(403, `Your package allows ${limit} specialism${limit === 1 ? '' : 's'}.`);
}
