"use client";

import Link from "next/link";
import { Moon, Play } from "lucide-react";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";

export default function HibernatedDashboard() {
  const { setHibernating, storageError } = useCaregiverDashboard();
  return <main className="mx-auto max-w-3xl px-6 py-12"><section className="rounded-2xl border border-[#ddd6fe] bg-white px-6 py-12 text-center shadow-sm"><span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#f5f3ff] text-[#7c3aed]"><Moon size={30} /></span><h1 className="font-jakarta text-2xl font-bold">Your dashboard is hibernating</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#667085]">Your dashboard is paused on this device. Your profile, messages and saved information are preserved.</p><button type="button" onClick={() => setHibernating(false)} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-5 py-3 text-sm font-semibold text-white hover:bg-[#6d28d9]"><Play size={17} />Resume Dashboard</button><Link href="/caregiver-dashboard/account-settings" className="mt-4 block text-sm text-[#7c3aed] underline">Account Settings</Link>{storageError && <p role="status" className="mt-4 text-xs text-amber-700">Browser storage is unavailable. The pause may only last for this visit.</p>}</section></main>;
}
