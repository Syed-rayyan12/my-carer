"use client";
import FullCaregiverProfileModal from '@/components/platform/FullCaregiverProfileModal';
import { useOwnPublicProfile } from './useOwnPublicProfile';
export default function CaregiverPublicProfile({ onContact }: { onContact: () => void }) {
  const profile = useOwnPublicProfile();
  return <FullCaregiverProfileModal open inline profile={profile} onClose={() => {}} onContact={onContact} />;
}
