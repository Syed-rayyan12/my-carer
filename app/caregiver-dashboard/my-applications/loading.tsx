import CaregiverPage from "@/components/caregiver-dashboard/shared/CaregiverPage";
import CaregiverListSkeleton from "@/components/caregiver-dashboard/shared/CaregiverListSkeleton";
export default function Loading() { return <CaregiverPage title="My Applications" description="Track every job you've applied for."><CaregiverListSkeleton /></CaregiverPage>; }
