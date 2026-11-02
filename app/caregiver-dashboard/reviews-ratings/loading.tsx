import CaregiverPage from "@/components/caregiver-dashboard/shared/CaregiverPage";
import CaregiverListSkeleton from "@/components/caregiver-dashboard/shared/CaregiverListSkeleton";
export default function Loading() { return <CaregiverPage title="Reviews & Ratings" description="See what care seekers say about working with you."><CaregiverListSkeleton /></CaregiverPage>; }
