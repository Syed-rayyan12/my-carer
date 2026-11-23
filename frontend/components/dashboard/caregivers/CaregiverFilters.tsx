"use client";

import { Star } from "lucide-react";
import { filterCareTypes, filterAvailability, type CaregiverFilters as Filters } from "./caregiverDirectoryData";

type Props = { filters: Filters; onChange: (filters: Filters) => void; onApply: () => void; onReset: () => void };

export default function CaregiverFilters({ filters, onChange, onApply, onReset }: Props) {
  function toggle(field: "careTypes" | "availability", value: string) {
    onChange({ ...filters, [field]: filters[field].includes(value) ? filters[field].filter(item => item !== value) : [...filters[field], value] });
  }

  return (
    <form id="caregiver-filters" className="rounded-[11px] border border-[#d9d9d9] bg-white px-4 pt-4 pb-6" onSubmit={event => { event.preventDefault(); onApply(); }}>
      <h2 className="font-commissioner text-xl font-bold text-[#202925]">Filters</h2>
      <fieldset className="border-b border-[#e5e2dc] pb-6">
        <legend className="mb-3 font-nunito text-base font-bold text-[#202925]">Care Type</legend>
        <div className="flex flex-col gap-2.5">{filterCareTypes.map(type => <label key={type} className="flex cursor-pointer items-center gap-2.5 font-nunito text-sm text-[#202925]"><input type="checkbox" className="size-4 shrink-0 rounded border-[#64716b] accent-[#ff2f68]" checked={filters.careTypes.includes(type)} onChange={() => toggle("careTypes", type)} />{type}</label>)}</div>
      </fieldset>
      <div className="border-b border-[#e5e2dc] py-6">
        <label htmlFor="caregiver-experience" className="mb-3 block font-commissioner text-xl font-bold text-[#202925]">Experience</label>
        <select id="caregiver-experience" className="h-11 w-full rounded-lg border border-[#e5e2dc] bg-white px-2 font-nunito text-base text-[#202925] outline-none focus:border-[#ff2f68]" value={filters.experience} onChange={event => onChange({ ...filters, experience: event.target.value })}><option value="">Any experience</option><option value="1">1+ years</option><option value="3">3+ years</option><option value="5">5+ years</option><option value="10">10+ years</option></select>
      </div>
      <div className="border-b border-[#e5e2dc] py-6">
        <label htmlFor="caregiver-rate" className="mb-3 block font-commissioner text-xl font-bold text-[#202925]">Hourly Rate</label>
        <div className="mb-3 flex justify-between gap-2 font-nunito text-sm text-[#64716b]"><span>£15</span><output htmlFor="caregiver-rate">up to £{filters.maxRate}{filters.maxRate === 30 ? "+" : ""}</output></div>
        <input id="caregiver-rate" type="range" min={15} max={30} step={0.5} value={filters.maxRate} onChange={event => onChange({ ...filters, maxRate: Number(event.target.value) })} className="w-full cursor-pointer accent-[#ff2f68]" aria-label="Maximum hourly rate" />
      </div>
      <fieldset className="border-b border-[#e5e2dc] py-6"><legend className="float-left mb-3 w-full font-commissioner text-xl font-bold text-[#202925]">Verification</legend><label className="clear-both flex cursor-pointer items-center gap-2.5 font-nunito text-sm text-[#202925]"><input type="checkbox" checked={filters.verifiedOnly} onChange={event => onChange({ ...filters, verifiedOnly: event.target.checked })} className="size-4 rounded accent-[#ff2f68]" />Verified profiles</label></fieldset>
      <fieldset className="border-b border-[#e5e2dc] py-6"><legend className="float-left mb-3 w-full font-commissioner text-xl font-bold text-[#202925]">Rating</legend><div className="clear-both flex gap-2">{[0, 4.5, 4.8].map(rating => <button type="button" key={rating} aria-pressed={filters.minRating === rating} onClick={() => onChange({ ...filters, minRating: rating })} className={`flex min-h-[38px] min-w-0 flex-1 items-center justify-center gap-1 rounded-lg border px-1 py-2 font-nunito text-sm ${filters.minRating === rating ? "border-[#ff2f68] text-[#ff2f68]" : "border-[#e5e2dc] text-[#64716b]"}`}>{rating > 0 && <Star size={14} className="shrink-0 fill-[#cf8d17] text-[#cf8d17]" />}{rating === 0 ? "Any" : `${rating}+`}</button>)}</div></fieldset>
      <fieldset className="border-b border-[#e5e2dc] py-6"><legend className="float-left mb-3 w-full font-commissioner text-xl font-bold text-[#202925]">Availability</legend><div className="clear-both grid grid-cols-2 gap-x-2 gap-y-2.5">{filterAvailability.map(time => <label key={time} className="flex cursor-pointer items-center gap-2 font-nunito text-sm text-[#202925]"><input type="checkbox" checked={filters.availability.includes(time)} onChange={() => toggle("availability", time)} className="size-4 shrink-0 rounded accent-[#ff2f68]" />{time}</label>)}</div></fieldset>
      <div className="mt-7 flex items-center justify-between gap-4"><button type="submit" className="flex-1 rounded-lg bg-[#ff2f68] px-3 py-3 font-nunito text-base font-medium text-white hover:bg-[#e92359]">Apply Filters</button><button type="button" className="px-2 font-nunito text-sm text-[#ff2f68] hover:underline" onClick={onReset}>Reset</button></div>
    </form>
  );
}
