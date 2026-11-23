"use client";

import {PackageAccess} from '@/components/platform/PackageAccess';
import { WorkspaceFeedback } from "@/components/platform/LiveWorkspace";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import HibernatedDashboard from "./settings/HibernatedDashboard";
import { MotionConfig } from "framer-motion";
import { CaregiverDashboardProvider, useCaregiverDashboard } from "./CaregiverDashboardContext";
import CaregiverHeader from "./CaregiverHeader";
import CaregiverSidebar from "./CaregiverSidebar";

function CaregiverShell({ children }: { children: ReactNode }) { const { mobileMenu, setMobileMenu, hibernating, hibernateReady } = useCaregiverDashboard(); const pathname = usePathname(); return <div className="flex min-h-screen bg-[#f3f4f6] text-[13px] text-[#202630]">{mobileMenu && <button type="button" className="fixed inset-0 z-30 bg-[#101929]/35" aria-label="Close navigation" onClick={() => setMobileMenu(false)} />}<CaregiverSidebar /><div className="ml-[278px] min-w-0 flex-1 max-[1250px]:ml-[251px] max-[850px]:ml-[241px] max-[640px]:ml-0"><CaregiverHeader /><WorkspaceFeedback />{!hibernateReady ? <p role="status" className="p-6 text-sm text-[#667085]">Loading dashboard...</p> : hibernating && pathname !== "/caregiver-dashboard/account-settings" ? <HibernatedDashboard /> : <PackageAccess>{children}</PackageAccess>}</div></div>; }
export default function CaregiverDashboardLayout({ children }: { children: ReactNode }) { return <MotionConfig reducedMotion="user"><CaregiverDashboardProvider><CaregiverShell>{children}</CaregiverShell></CaregiverDashboardProvider></MotionConfig>; }
