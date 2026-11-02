import CaregiverPage from "@/components/caregiver-dashboard/shared/CaregiverPage";
import { SettingsContentSkeleton } from "@/components/dashboard/loading/AccountPagesSkeleton";
export default function Loading() { return <CaregiverPage title="Account Settings" description="Manage your account, notifications and privacy."><SettingsContentSkeleton /></CaregiverPage>; }
