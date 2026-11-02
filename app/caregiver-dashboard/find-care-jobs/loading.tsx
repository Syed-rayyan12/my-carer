import CaregiverPage from "@/components/caregiver-dashboard/shared/CaregiverPage";
import CaregiverListSkeleton from "@/components/caregiver-dashboard/shared/CaregiverListSkeleton";
export default function Loading() { return <CaregiverPage title="Find Care Jobs" description="Discover care opportunities that match your skills and availability."><CaregiverListSkeleton cards /></CaregiverPage>; }
