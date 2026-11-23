import { useAuth } from '@/components/auth/AuthBoundary';
import { useCaregiverDashboard } from '../CaregiverDashboardContext';
import { listingCaregiverProfile } from '@/components/platform/listing-caregiver-profile';
export function useOwnPublicProfile() {
  const auth = useAuth()!;
  const { profile } = useCaregiverDashboard();
  return listingCaregiverProfile({ id: auth.user.id, firstName: profile.personal.firstName, lastName: profile.personal.lastName, photo: profile.photo,
    professional: { bio: profile.about, location: profile.personal.city, hourlyRatePence: Math.round((profile.hourlyRate ?? 0) * 100), qualifications: '', services: '' } });
}
