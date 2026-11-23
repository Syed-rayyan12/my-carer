"use client";

import { Moon, Play } from "lucide-react";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";

export default function HibernateAccountCard() {
  const { hibernating, setHibernating, ready } = useCaregiverDashboard();
  return <section className="mb-6 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-[#ddd6fe] bg-white p-6">
    <div className="flex items-start gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#7c3aed]"><Moon size={22} /></span><div><h2 className="font-nunito text-base font-bold text-[#101828]">Hibernate Account</h2><p className="mt-1 max-w-xl font-nunito text-sm leading-6 text-[#667085]">Take a break by pausing your dashboard. Your profile, messages and saved information stay intact, and you can resume at any time.</p><p className="mt-2 font-nunito text-xs text-[#7c3aed]">Account hibernation is not enabled.</p></div></div>
    <button type="button" disabled title="Account hibernation is not enabled" onClick={() => setHibernating(!hibernating)} className="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-3 font-nunito text-sm font-semibold text-white hover:bg-[#6d28d9] disabled:opacity-50">{hibernating ? <Play size={16} /> : <Moon size={16} />}{hibernating ? "Resume Dashboard" : "Hibernate Dashboard"}</button>
    {hibernating && <p role="status" className="w-full rounded-lg bg-[#f5f3ff] px-4 py-3 font-nunito text-sm text-[#6d28d9]">Your dashboard is paused. Resume it whenever you are ready.</p>}
  </section>;
}
