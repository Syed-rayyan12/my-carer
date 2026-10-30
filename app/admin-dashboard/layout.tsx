import type { ReactNode } from "react";
import AdminDashboardLayout from "@/components/admin/AdminDashboardLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
