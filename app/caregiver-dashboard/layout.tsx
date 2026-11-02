import type { ReactNode } from "react";
import CaregiverDashboardLayout from "@/components/caregiver-dashboard/CaregiverDashboardLayout";
export default function Layout({ children }: { children: ReactNode }) { return <CaregiverDashboardLayout>{children}</CaregiverDashboardLayout>; }
