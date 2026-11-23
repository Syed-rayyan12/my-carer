import { SettingsContentSkeleton } from "@/components/dashboard/loading/AccountPagesSkeleton";
import AdminPage from "@/components/admin/shared/AdminPage";
export default function Loading() { return <AdminPage title="Settings" description="Manage your account, notifications and privacy."><SettingsContentSkeleton /></AdminPage>; }
