"use client";
import FullCaregiverProfileModal from '@/components/platform/FullCaregiverProfileModal';
import { useOwnPublicProfile } from './useOwnPublicProfile';
export default function CareSeekerPreviewModal({ onClose, onContact }: { onClose: () => void; onContact: () => void }) {
  const profile = useOwnPublicProfile();
  return <FullCaregiverProfileModal open profile={profile} onClose={onClose} onContact={onContact} />;
}
