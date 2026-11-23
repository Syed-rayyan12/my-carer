"use client";

import { useAdminDashboard } from "./AdminDashboardContext";
import { useRouter } from "next/navigation";
import type { AdminSection } from "./adminData";

export default function AdminStats() {
  const { snapshot, ready, setDialog } = useAdminDashboard();
  const router = useRouter();
  const counts = snapshot.counts;
  const stats: { title: string; value: string; caption: string; section: AdminSection; highlight?: boolean }[] = [
    { title: "Total Caregivers", value: ready ? counts.caregivers.toLocaleString('en-GB') : '…', caption: "Registered accounts", section: "caregivers" },
    { title: "Total Care Seekers", value: ready ? counts.seekers.toLocaleString('en-GB') : '…', caption: "Registered accounts", section: "care-seekers" },
    { title: "Active Care Jobs", value: ready ? String(counts.openRequests) : '…', caption: "Live right now", section: "care-jobs" },
    { title: "Monthly Revenue", value: "—", caption: "Manual payments; no revenue ledger", section: "subscriptions" },
    { title: "Pending Verification", value: ready ? String(counts.pendingVerifications) : '…', caption: "Documents waiting for review", section: "verification", highlight: true },
  ];

  return <section className="mb-6 grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(240px,1.55fr)] gap-1.5 max-[1300px]:grid-cols-3 max-[850px]:grid-cols-2 max-[480px]:grid-cols-1" aria-label="Admin platform statistics">{stats.map(stat => <button type="button" className={`min-h-[120px] rounded-xl border p-3 text-left transition-shadow hover:shadow-md ${stat.highlight ? "border-[#ff2f68] bg-[#ff2f68] text-white" : "border-[#d9d9d9] bg-white text-black"}`} key={stat.title} onClick={() => stat.section === "caregivers" ? router.push("/admin-dashboard/caregivers") : stat.section === "care-seekers" ? router.push("/admin-dashboard/care-seekers") : stat.section === "verification" ? router.push("/admin-dashboard/verification") : stat.section === "care-jobs" ? router.push("/admin-dashboard/care-jobs") : stat.section === "subscriptions" ? router.push("/admin-dashboard/subscriptions") : setDialog({ type: "section", section: stat.section })}><h2 className="font-nunito text-[13px] font-normal">{stat.title}</h2><strong className={`mt-2 mb-1 block font-commissioner text-[27px] leading-tight font-bold tracking-tight ${stat.highlight ? "text-white" : "text-[#202925]"}`}>{stat.value}</strong><p className={`font-nunito text-[13px] leading-relaxed ${stat.highlight ? "text-white" : "text-[#ff2f68]"}`}>{stat.caption}</p></button>)}</section>;
}
