import { phoneSchema } from './auth.validation.js';

type Profile = {
  phone: string;
  location: string;
  address: string;
  postcode: string;
  about: string;
};
export function isCareSeekerProfileComplete(profile: Profile | null | undefined): boolean {
  if (
    !profile ||
    ![profile.phone, profile.location, profile.address, profile.postcode, profile.about].every(
      (value) => value.trim().length > 0,
    )
  )
    return false;
  return phoneSchema.safeParse(profile.phone).success;
}
