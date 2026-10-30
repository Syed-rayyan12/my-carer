"use client";

import { useAdminDashboard } from "./AdminDashboardContext";
import { filterAdminUsers } from "./adminData";
import AdminStats from "./AdminStats";
import AdminRegistrationsTable from "./AdminRegistrationsTable";
import AdminRecentActivity from "./AdminRecentActivity";
import { AdminActivitySkeleton, AdminRegistrationsSkeleton } from "./AdminDashboardSkeleton";

export default function AdminOverview() {
  const { data, ready, storageError, notice, search } = useAdminDashboard();
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Welcome back, <span className="text-[#ff2f68]">Admin</span></h1><p className="font-nunito text-base text-[#363636]">Here&apos;s how My Carer is doing today.</p></section><p className="sr-only" role="status">{notice}</p>{storageError && <p className="mb-4 font-nunito text-sm text-amber-700" role="status">Browser storage is unavailable. Admin changes will only last for this visit.</p>}<AdminStats /><div className="grid grid-cols-[minmax(0,2.08fr)_minmax(290px,1fr)] items-start gap-6 max-[1250px]:grid-cols-1">{ready ? <><AdminRegistrationsTable users={filterAdminUsers(data.users, search)} /><AdminRecentActivity /></> : <><AdminRegistrationsSkeleton /><AdminActivitySkeleton /></>}</div></main>;
}
