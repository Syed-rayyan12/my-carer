"use client";

import { useState } from "react";
import { useAdminDashboard } from "../AdminDashboardContext";
import { useCareJobs } from "./CareJobsContext";
import { filterCareJobs, type CareJobStatus } from "./careJobsData";
import CareJobsTable from "./CareJobsTable";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

const tabs: { label: string; value: CareJobStatus | "All" }[] = [{ label: "All", value: "All" }, { label: "Awaiting approval", value: "Pending" }, { label: "Active", value: "Active" }, { label: "Removed", value: "Removed" }];
export default function CareJobsPage() {
  const { jobs, ready, storageError, notice } = useCareJobs();
  const { search: globalSearch } = useAdminDashboard();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<CareJobStatus | "All">("All");
  const results = filterCareJobs(filterCareJobs(jobs, tab, search), "All", globalSearch);
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 font-nunito text-[#182522] max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-[#ff2f68] max-[640px]:text-[32px]">Care Jobs</h1><p className="text-base text-[#363636]">Job listings posted by care seekers. New listings need approval before going live.</p></section>{notice && <p role="status" className="mb-4 text-sm text-[#61706c]">{notice}</p>}{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Changes will only last for this visit.</p>}{!ready ? <AdminCaregiversTableSkeleton label="Loading care jobs" /> : <section className="overflow-hidden rounded-[11px] border border-[#d9d9d9] bg-white"><div className="flex flex-wrap items-center justify-between gap-x-4 px-5 pt-3"><div className="flex flex-wrap gap-5" aria-label="Filter care jobs">{tabs.map(({ label, value }) => <button key={value} type="button" aria-pressed={tab === value} className={`flex min-h-[50px] items-center gap-2 border-b-2 text-sm ${tab === value ? "border-[#ff2f68] font-semibold text-[#182522]" : "border-transparent text-[#61706c]"}`} onClick={() => setTab(value)}>{label}<span className={`flex min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-5 ${tab === value ? "bg-[#e4f3ed] text-[#ff2f68]" : "bg-[#f4f6f5] text-[#61706c]"}`}>{value === "All" ? jobs.length : jobs.filter(job => job.status === value).length}</span></button>)}</div><input aria-label="Search job or location" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search job or location" className="mb-3 h-[38px] w-[290px] max-w-full rounded-lg border border-[#e3e5e7] px-4 text-sm outline-none placeholder:text-[#98a2b3] focus:border-[#ff2f68] max-[700px]:mt-3 max-[700px]:w-full" /></div><CareJobsTable jobs={results} /></section>}</main>;
}
