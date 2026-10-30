import Link from "next/link";
import { ArrowRight, Clock3, MapPin, PoundSterling } from "lucide-react";
import { formatRequirementDate, type CareRequirement } from "../requirements/CareRequirementsContext";
import { formatRequestBudget } from "./requestData";

export default function RequestRow({ requirement }: { requirement: CareRequirement }) {
  return (
    <article className="grid min-h-[116px] grid-cols-[minmax(0,1.6fr)_minmax(160px,1fr)_auto] items-center gap-x-6 gap-y-4 border-b border-[#e5e2dc] px-5 py-6 last:border-b-0 max-[1100px]:grid-cols-[minmax(0,1fr)_auto] max-[650px]:grid-cols-1">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2"><h2 className="font-nunito text-[18px] leading-snug font-bold text-[#202925]">{requirement.title}</h2><span className="inline-flex items-center gap-1 rounded-full bg-[#ffebf1] px-2.5 py-1 font-nunito text-xs text-[#ff2f68]"><span className="size-1.5 rounded-full bg-[#ff2f68]" />{requirement.status === "active" ? "Active" : "Closed"}</span></div>
        <p className="mt-1 font-nunito text-xs text-[#8d9692]">Created: {formatRequirementDate(requirement.postedAt)}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 font-nunito text-sm text-[#64716b]">
          <span className="flex items-center gap-1.5"><MapPin size={15} className="shrink-0 text-[#ff2f68]" />{requirement.location}</span>
          <span className="flex items-center gap-1.5"><Clock3 size={15} className="shrink-0 text-[#ff2f68]" />{requirement.schedule.split(":")[0]}</span>
          <span className="flex items-center gap-1.5"><PoundSterling size={15} className="shrink-0 text-[#ff2f68]" />{formatRequestBudget(requirement.budget)}</span>
        </div>
      </div>
      <p className="font-nunito text-sm text-[#202925] max-[1100px]:col-start-1 max-[1100px]:row-start-2 max-[650px]:row-auto">{requirement.responses > 0 ? `${requirement.responses} ${requirement.responses === 1 ? "Caregiver" : "Caregivers"} Responded` : "No responses yet"}</p>
      <Link className="inline-flex min-h-[38px] items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#ff2f68] bg-white px-4 py-2 font-nunito text-base font-semibold text-[#202925] hover:bg-[#fff5f8] max-[1100px]:col-start-2 max-[1100px]:row-span-2 max-[1100px]:row-start-1 max-[650px]:col-start-1 max-[650px]:row-auto max-[650px]:justify-self-start" href={`/care-seeker-dashboard/my-requests/${requirement.id}/responses`}>View Responses<ArrowRight size={17} /></Link>
    </article>
  );
}
