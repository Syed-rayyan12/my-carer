import { membershipAccess } from '../membership/plan-policy.js';

import * as repository from './account.repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { isCareSeekerProfileComplete } from '../auth/profile-completion.js';
import type { ProfileInput } from './account.types.js';

export async function getProfile(userId: string) {
  const user = await repository.findUserById(userId);
  if (!user) throw new ApiError(404, 'Account not found');
  const profile = user.profile;
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    accountEmail: user.email,
    email: profile?.contactEmail ?? user.email,
    phone: profile?.phone ?? '',
    dateOfBirth: profile?.dateOfBirth?.toISOString().slice(0, 10) ?? '',
    location: profile?.location ?? '',
    address: profile?.address ?? '',
    postcode: profile?.postcode ?? '',
    about: profile?.about ?? '',
    emergencyName: profile?.emergencyName ?? '',
    relationship: profile?.relationship ?? '',
    emergencyPhone: profile?.emergencyPhone ?? '',
    language: profile?.language ?? 'English (UK)',
    profileComplete: user.role !== 'CARE_SEEKER' || isCareSeekerProfileComplete(profile),
  };
}

export async function saveProfile(userId: string, input: ProfileInput) {
  const { firstName, lastName, email, dateOfBirth, ...profile } = input;
  await repository.updateSeekerProfile(userId, { firstName, lastName }, {
    ...profile,
    contactEmail: email || null,
    dateOfBirth: dateOfBirth ? new Date(`${dateOfBirth}T00:00:00Z`) : null,
  });
  return getProfile(userId);
}
export async function getAccount(userId: string) {
 const membership = await repository.getAccountAccess(userId);
 const access = membershipAccess(membership);
 return { membership:membership?{...membership,plan:{id:membership.plan.id,title:membership.plan.title,category:membership.plan.category}}:null, access: { active:access.active,trial:access.trial,entitlements:access.entitlements } };
}
