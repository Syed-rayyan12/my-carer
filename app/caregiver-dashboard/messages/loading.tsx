import CaregiverPage from "@/components/caregiver-dashboard/shared/CaregiverPage";
import CaregiverListSkeleton from "@/components/caregiver-dashboard/shared/CaregiverListSkeleton";
export default function Loading() { return <CaregiverPage title="Messages" description="Track conversations with care seekers."><CaregiverListSkeleton /></CaregiverPage>; }
