"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { AdminDashboardProvider, useAdminDashboard } from "./AdminDashboardContext";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminDialogs from "./AdminDialogs";
import { AdminContentProvider } from "./AdminContentContext";

function AdminShell({ children }: { children: ReactNode }) {
  const { mobileMenu, setMobileMenu } = useAdminDashboard();
  return <div className="flex min-h-screen bg-[#f3f4f6] text-[13px] text-[#202630]">{mobileMenu && <button className="fixed inset-0 z-30 bg-[#101929]/35" aria-label="Close admin navigation" onClick={() => setMobileMenu(false)} />}<AdminSidebar /><div className="ml-[278px] min-w-0 flex-1 max-[1250px]:ml-[251px] max-[850px]:ml-[241px] max-[640px]:ml-0"><AdminHeader />{children}</div><AdminDialogs /></div>;
}

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user"><AdminDashboardProvider><AdminContentProvider><AdminShell>{children}</AdminShell></AdminContentProvider></AdminDashboardProvider></MotionConfig>;
}
