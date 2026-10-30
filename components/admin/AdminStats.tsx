"use client";

import { useAdminDashboard } from "./AdminDashboardContext";
import { useRouter } from "next/navigation";
import type { AdminSection } from "./adminData";
import { getAdminCaregivers, initialAdminCaregivers } from "./caregivers/adminCaregiverData";
import { getAdminCareSeekers, initialAdminCareSeekers } from "./care-seekers/adminCareSeekerData";

export default function AdminStats() {
  const { data, setDialog } = useAdminDashboard();
  const router = useRouter();
  const caregivers = getAdminCaregivers(data);
  const pending = 56 + caregivers.filter(user => user.verification === "Pending").length - initialAdminCaregivers.filter(user => user.verification === "Pending").length;
  const stats: { title: string; value: string; caption: string; section: AdminSection; highlight?: boolean }[] = [
    { title: "Total Caregivers", value: (1250 + caregivers.length - initialAdminCaregivers.length).toLocaleString("en-GB"), caption: "+12% this month", section: "caregivers" },
    { title: "Total Care Seekers", value: (4850 + getAdminCareSeekers(data).length - initialAdminCareSeekers.length).toLocaleString("en-GB"), caption: "+18% this month", section: "care-seekers" },
    { title: "Active Care Jobs", value: "340", caption: "Live right now", section: "care-jobs" },
    { title: "Monthly Revenue", value: "£12,450", caption: "+8% vs August", section: "subscriptions" },
    { title: "Pending Verification", value: String(pending), caption: "Caregivers Waiting For Document Checks", section: "verification", highlight: true },
  ];

  return <section className="mb-6 grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(240px,1.55fr)] gap-1.5 max-[1300px]:grid-cols-3 max-[850px]:grid-cols-2 max-[480px]:grid-cols-1" aria-label="Admin platform statistics">{stats.map(stat => <button type="button" className={`min-h-[120px] rounded-xl border p-3 text-left transition-shadow hover:shadow-md ${stat.highlight ? "border-[#ff2f68] bg-[#ff2f68] text-white" : "border-[#d9d9d9] bg-white text-black"}`} key={stat.title} onClick={() => stat.section === "caregivers" ? router.push("/admin-dashboard/caregivers") : stat.section === "care-seekers" ? router.push("/admin-dashboard/care-seekers") : stat.section === "verification" ? router.push("/admin-dashboard/verification") : stat.section === "care-jobs" ? router.push("/admin-dashboard/care-jobs") : stat.section === "subscriptions" ? router.push("/admin-dashboard/subscriptions") : setDialog({ type: "section", section: stat.section })}><h2 className="font-nunito text-[13px] font-normal">{stat.title}</h2><strong className={`mt-2 mb-1 block font-commissioner text-[27px] leading-tight font-bold tracking-tight ${stat.highlight ? "text-white" : "text-[#202925]"}`}>{stat.value}</strong><p className={`font-nunito text-[13px] leading-relaxed ${stat.highlight ? "text-white" : "text-[#ff2f68]"}`}>{stat.caption}</p></button>)}</section>;
}
