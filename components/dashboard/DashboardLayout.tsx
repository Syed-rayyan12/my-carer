"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { DashboardProvider, useDashboard } from "./DashboardContext";
import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import DashboardDialogs from "./DashboardDialogs";
import { CareRequirementsProvider } from "./requirements/CareRequirementsContext";

function DashboardShell({ children }: { children: ReactNode }) {
  const { mobileMenu, setMobileMenu } = useDashboard();

  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-[13px] text-[#202630]">
      {mobileMenu && <button className="fixed inset-0 z-30 bg-[#101929]/35" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}
      <DashboardSidebar />
      <div className="ml-[278px] min-w-0 flex-1 max-[1250px]:ml-[251px] max-[850px]:ml-[241px] max-[640px]:ml-0">
        <DashboardHeader />
        {children}
      </div>
      <DashboardDialogs />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user"><DashboardProvider><CareRequirementsProvider><DashboardShell>{children}</DashboardShell></CareRequirementsProvider></DashboardProvider></MotionConfig>;
}
