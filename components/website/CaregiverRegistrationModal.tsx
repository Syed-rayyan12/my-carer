"use client";
import { SignupModal } from './SignupModal';
export default function CaregiverRegistrationModal({ onClose }: { onClose: () => void }) { return <SignupModal initialRole="CAREGIVER" onClose={onClose} />; }
