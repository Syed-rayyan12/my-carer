import { membershipAccess } from '../membership/plan-policy.js';
type Membership = Parameters<typeof membershipAccess>[0];
export function publicCaregiver<
  T extends {
    membership?: Membership;
    professional?: {
      bio?: string;
      qualifications?: string;
      availability?: string;
      services?: string;
    } | null;
    verifications?: { kind: string }[];
  },
>(record: T) {
  const { membership, ...safe } = record;
  const access = membershipAccess(membership ?? null);
  const e = access.entitlements;
  const professional = record.professional
    ? {
        ...record.professional,
        bio: e.bio === true ? record.professional.bio : '',
        qualifications: e.qualifications === true ? record.professional.qualifications : '',
        availability: e.availability === true ? record.professional.availability : '',
        services: record.professional.services
          ?.split(/[,\n]/)
          .filter(Boolean)
          .slice(
            0,
            typeof e.specialismsLimit === 'number'
              ? e.specialismsLimit
              : e.specialismsLimit === null
                ? undefined
                : 1,
          )
          .join(', '),
      }
    : null;
  return {
    ...safe,
    professional,
    featured: e.featured === true,
    verifications: (record.verifications ?? []).filter((v) =>
      v.kind === 'DBS'
        ? e.dbs === true
        : v.kind === 'QUALIFICATION'
          ? e.qualifications === true
          : e.rightToWork === true,
    ),
  };
}
