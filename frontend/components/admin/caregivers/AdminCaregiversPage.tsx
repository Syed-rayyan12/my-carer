"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { useAdminDashboard } from "../AdminDashboardContext";
import { defaultAdminCaregiverFilters, filterAdminCaregivers, getAdminCaregivers } from "./adminCaregiverData";
import AdminCaregiverFilters from "./AdminCaregiverFilters";
import AdminCaregiversTable from "./AdminCaregiversTable";
import { AdminCaregiversTableSkeleton } from "./AdminCaregiversSkeleton";

export default function AdminCaregiversPage() {
  const { data, ready, search: headerSearch, storageError } = useAdminDashboard();
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(defaultAdminCaregiverFilters);
  const caregivers = getAdminCaregivers(data);
  const localResults = filterAdminCaregivers(caregivers, search, filters);
  const results = filterAdminCaregivers(localResults, headerSearch, defaultAdminCaregiverFilters);
  const locations = [...new Set(caregivers.map(person => person.location))].sort();
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-[#ff2f68] max-[640px]:text-[32px]">Caregivers</h1><p className="font-nunito text-base text-[#363636]">Manage every caregiver account on the platform.</p></section><div className="mb-6 flex items-center gap-2.5 rounded-[11px] border border-[#d9d9d9] bg-white px-[18px] py-3.5"><label htmlFor="admin-caregiver-search" className="flex min-h-10 min-w-0 flex-1 items-center gap-2.5 rounded-md border border-[#d9d9d9] px-4 focus-within:border-[#ff2f68]"><Search size={18} className="shrink-0 text-[#ff2f68]" /><input id="admin-caregiver-search" type="search" placeholder="Search by name...." className="h-10 w-full min-w-0 bg-transparent font-nunito text-base text-[#343434] outline-none placeholder:text-[#525252]" value={search} onChange={event => setSearch(event.target.value)} /></label><button type="button" aria-expanded={filtersOpen} aria-controls={filtersOpen ? "admin-caregiver-filters" : undefined} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#ff2f68] px-5 font-nunito text-base text-black max-[500px]:px-3" onClick={() => setFiltersOpen(current => !current)}><Filter size={18} className="text-[#ff2f68]" />Filters{activeFilterCount > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-[#ff2f68] text-[11px] text-white">{activeFilterCount}</span>}</button></div>{filtersOpen && <AdminCaregiverFilters filters={filters} locations={locations} onChange={setFilters} onReset={() => setFilters(defaultAdminCaregiverFilters)} onApply={() => setFiltersOpen(false)} />}{storageError && <p role="status" className="mb-4 font-nunito text-sm text-amber-700">Browser storage is unavailable. Admin changes will only last for this visit.</p>}{ready ? <AdminCaregiversTable caregivers={results} /> : <AdminCaregiversTableSkeleton />}</main>;
}
