"use client";

import Link from "next/link";
import { CalendarDays, Clock3, MapPin, PoundSterling, UsersRound } from "lucide-react";
import { formatRequirementDate, type CareRequirement } from "./CareRequirementsContext";

export default function CareRequirementCard({ requirement, onClose, onResponses, responsesExpanded = false }: { requirement: CareRequirement; onClose: () => void; onResponses: () => void; responsesExpanded?: boolean }) {
  const active = requirement.status === "active";
  const details = [
    { icon: MapPin, value: requirement.location },
    { icon: CalendarDays, value: `Starting: ${formatRequirementDate(requirement.startDate)}` },
    { icon: Clock3, value: requirement.schedule },
    { icon: PoundSterling, value: `£${requirement.budget.replace(/[–-]/g, "–£")}/hour` },
  ];

  return (
    <article className={`rounded-[18px] border border-[#e5e2dc] px-6 pt-6 pb-6 max-[640px]:px-4 ${active ? "bg-white" : "bg-white/70"}`}>
      <div className="flex items-start justify-between gap-4">
        <div><h2 className={`font-commissioner text-xl font-bold ${active ? "text-[#202925]" : "text-[#525a56]"}`}>{requirement.title}</h2><p className="font-nunito text-sm text-[#555]">Posted {formatRequirementDate(requirement.postedAt)}</p></div>
        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-nunito text-sm ${active ? "bg-[#ffebf1] text-[#ff2f68]" : "bg-[#f0eeea] text-[#88918d]"}`}><span className={`size-1.5 rounded-full ${active ? "bg-[#ff2f68]" : "bg-[#a1aaa6]"}`} />{active ? "Active" : "Closed"}</span>
      </div>
      <dl className="mt-6 mb-7 grid grid-cols-[0.8fr_1.2fr_1.4fr_1fr] gap-4 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1">
        {details.map(({ icon: Icon, value }, index) => <div key={index} className={`flex min-w-0 items-start gap-2 font-nunito text-[14px] ${active ? "text-[#64716b]" : "text-[#8a938e]"}`}><dt><Icon size={17} className="mt-0.5 shrink-0" /><span className="sr-only">{["Location", "Start date", "Schedule", "Hourly budget"][index]}</span></dt><dd>{value}</dd></div>)}
      </dl>
      <div className="flex items-center justify-between gap-4 border-t border-[#e5e2dc] pt-5 max-[700px]:flex-wrap">
        <p className="flex items-center gap-2 font-nunito text-base text-[#202925]"><UsersRound size={18} className="text-[#ff2f68]" />{requirement.responses} Responses</p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-expanded={responsesExpanded} aria-controls={responsesExpanded ? `responses-${requirement.id}` : undefined} className={`rounded-lg px-5 py-2 font-nunito text-sm font-medium text-white transition-colors hover:bg-[#e92359] ${active ? "bg-[#ff2f68]" : "bg-[#ff5a89]"}`} onClick={onResponses}>{responsesExpanded ? "Hide Responses" : "View Responses"}</button>
          {active && <><Link className="rounded-lg border border-[#e5e2dc] bg-white px-3.5 py-2 font-nunito text-base text-[#202925] hover:bg-gray-50" href={`/care-seeker-dashboard/care-requirements/${requirement.id}/edit`}>Edit</Link><button type="button" className="px-2.5 py-2 font-nunito text-base text-[#cf361e] hover:underline" onClick={onClose}>Close Requirement</button></>}
        </div>
      </div>
    </article>
  );
}
