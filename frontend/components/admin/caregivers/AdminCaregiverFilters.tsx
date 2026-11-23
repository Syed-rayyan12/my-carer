"use client";

import type { AdminCaregiverFilters as Filters } from "./adminCaregiverData";

export default function AdminCaregiverFilters({ filters, locations, onChange, onReset, onApply }: { filters: Filters; locations: string[]; onChange: (filters: Filters) => void; onReset: () => void; onApply: () => void }) {
  const fields: { name: keyof Filters; label: string; options: string[] }[] = [
    { name: "location", label: "Location", options: locations },
    { name: "verification", label: "Verification", options: ["Pending", "Verified", "Rejected"] },
    { name: "status", label: "Account status", options: ["Pending", "Active", "Suspended", "Rejected"] },
  ];
  return <form id="admin-caregiver-filters" className="mb-6 rounded-xl border border-[#d9d9d9] bg-white p-5" onSubmit={event => { event.preventDefault(); onApply(); }}><div className="grid grid-cols-3 gap-4 max-[700px]:grid-cols-1">{fields.map(field => <label key={field.name} className="font-nunito text-sm font-semibold text-[#344054]" htmlFor={`admin-filter-${field.name}`}>{field.label}<select id={`admin-filter-${field.name}`} className="mt-2 h-10 w-full rounded-lg border border-[#e5e2dc] bg-white px-3 font-normal outline-none focus:border-[#ff2f68]" value={filters[field.name]} onChange={event => onChange({ ...filters, [field.name]: event.target.value })}><option value="">All {field.name === "status" ? "statuses" : field.name === "verification" ? "verification states" : "locations"}</option>{field.options.map(option => <option value={option} key={option}>{option}</option>)}</select></label>)}</div><div className="mt-4 flex justify-end gap-4"><button type="button" className="font-nunito text-sm text-[#ff2f68] hover:underline" onClick={onReset}>Reset filters</button><button type="submit" className="rounded-lg bg-[#ff2f68] px-4 py-2 font-nunito text-sm text-white hover:bg-[#e92359]">Apply Filters</button></div></form>;
}
