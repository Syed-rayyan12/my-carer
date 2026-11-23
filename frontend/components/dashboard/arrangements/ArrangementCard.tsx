"use client";

import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import DashboardAvatar from "../loading/DashboardAvatar";
import type { DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";
import { formatRequirementDate } from "../requirements/CareRequirementsContext";
import type { CareArrangement } from "./arrangementsData";

export default function ArrangementCard({ arrangement, caregiver, selected, onSelect }: { arrangement: CareArrangement; caregiver: DirectoryCaregiver; selected: boolean; onSelect: () => void }) {
  return (
    <article className={`min-h-[196px] rounded-[18px] border bg-white p-6 ${selected ? "border-[#ff2f68]" : "border-[#a7aaa8]"}`}>
      <div className="flex items-start gap-4"><DashboardAvatar src={caregiver.image} name={caregiver.name} initials={caregiver.initials} className="size-11" /><div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-start justify-between gap-2"><h2 className="font-commissioner text-[18px] leading-snug font-bold text-[#202925]">{arrangement.title} – {caregiver.name}</h2><span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#ffebf1] px-2.5 py-1 font-nunito text-xs text-[#ff2f68]"><span className="size-1.5 rounded-full bg-[#ff2f68]" />{arrangement.status === "completed" ? "Completed" : arrangement.status === "active" ? "Active" : "Confirmed"}</span></div><div className="space-y-1 font-nunito text-[14.4px] text-[#64716b]"><p className="flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#ff2f68]" />{arrangement.location}</p><p className="flex items-start gap-2"><CalendarDays size={17} className="mt-0.5 shrink-0 text-[#ff2f68]" />Starts: {formatRequirementDate(arrangement.startDate)}</p><p className="flex items-start gap-2"><Clock3 size={17} className="mt-0.5 shrink-0 text-[#ff2f68]" />{arrangement.schedule}</p></div><button type="button" aria-pressed={selected} className="mt-5 inline-flex items-center gap-2 font-nunito text-[14.4px] text-[#ff2f68] hover:underline" onClick={onSelect}>View Details<ArrowRight size={16} /></button></div></div>
    </article>
  );
}
