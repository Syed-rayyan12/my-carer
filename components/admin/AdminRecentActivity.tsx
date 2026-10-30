"use client";

import { Briefcase, CreditCard, Star, UserPen, UserPlus } from "lucide-react";
import { useAdminDashboard } from "./AdminDashboardContext";
import type { AdminActivity } from "./adminData";

const activityIcons: Record<AdminActivity["kind"], typeof UserPlus> = { registration: UserPlus, subscription: CreditCard, job: Briefcase, review: Star, profile: UserPen };

export default function AdminRecentActivity() {
  const { data } = useAdminDashboard();
  return <section className="min-w-0 overflow-hidden rounded-xl border border-[#e3e5e8] bg-white" aria-labelledby="admin-activity-heading"><h2 id="admin-activity-heading" className="min-h-[58px] border-b border-[#bfc2c5] px-5 py-3 font-commissioner text-xl font-bold text-[#202925]">Recent Activity</h2><ul className="space-y-4 px-5 py-3">{data.activity.slice(0, 5).map(item => { const Icon = activityIcons[item.kind]; return <li key={item.id} className="flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffebf1] text-[#ff2f68]"><Icon size={16} strokeWidth={1.6} /></span><div><p className="font-nunito text-[13px] leading-[1.55] text-black">{item.text}</p><p className="mt-1 font-nunito text-xs text-[#555]">{item.time}</p></div></li>; })}</ul></section>;
}
