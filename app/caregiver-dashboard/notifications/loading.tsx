import CaregiverPage from "@/components/caregiver-dashboard/shared/CaregiverPage";
import CaregiverListSkeleton from "@/components/caregiver-dashboard/shared/CaregiverListSkeleton";
export default function Loading() { return <CaregiverPage title="Notifications" description="Updates about your jobs, messages, verification and reviews."><CaregiverListSkeleton /></CaregiverPage>; }
