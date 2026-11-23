"use client";
import { useAuth } from '@/components/auth/AuthBoundary';
import FullCaregiverProfileModal from '@/components/platform/FullCaregiverProfileModal';
import { listingCaregiverProfile } from '@/components/platform/listing-caregiver-profile';
import type { CaregiverProfile } from './caregiverProfileData';
export default function ProfilePreviewModal({ profile, onClose }: { profile: CaregiverProfile; onClose: () => void }) {
  const auth = useAuth()!;
  const publicProfile = listingCaregiverProfile({ id: auth.user.id, firstName: profile.personal.firstName, lastName: profile.personal.lastName, photo: profile.photo,
    professional: { bio: profile.about, location: profile.personal.city, hourlyRatePence: Math.round((profile.hourlyRate ?? 0) * 100), qualifications: '', services: '' } });
  return <FullCaregiverProfileModal open profile={publicProfile} onClose={onClose} />;
}
