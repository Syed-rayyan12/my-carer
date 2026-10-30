"use client";

import Image from "next/image";
import { ArrowRight, MessageSquare, X } from "lucide-react";
import { people } from "../dashboardData";
import { useDashboard } from "../DashboardContext";
import type { CareRequirement } from "./CareRequirementsContext";

export default function RequirementResponses({ requirement, onHide }: { requirement: CareRequirement; onHide: () => void }) {
  const { setSelected } = useDashboard();

  return (
    <section id={`responses-${requirement.id}`} className="mt-3 rounded-2xl border border-[#ececf0] bg-white p-6 text-[#202925]" aria-labelledby={`responses-title-${requirement.id}`}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 id={`responses-title-${requirement.id}`} className="font-jakarta text-xl font-semibold">Caregiver Responses</h3>
        <button type="button" aria-label="Hide responses" className="rounded p-1 text-[#667085] hover:bg-gray-100" onClick={onHide}><X size={22} /></button>
      </div>
      <p className="mb-4 font-nunito text-sm text-[#667085]">{requirement.title}</p>
      {requirement.responses > 0 ? (
        <>
          <p className="font-nunito text-xs text-[#98a2b3]">Sample responses for this example requirement.</p>
          {people.map((person, index) => (
            <div key={person.name} className="flex flex-wrap items-center gap-3 border-b border-[#ececf0] py-4 last:border-0">
              <Image className="size-12 rounded-full object-cover" src={person.image} alt={person.name} width={48} height={48} />
              <div><h4 className="font-nunito text-sm font-bold">{person.name}</h4><p className="font-nunito text-xs text-[#667085]">{person.specialty}</p></div>
              <button type="button" className="ml-auto flex items-center gap-2 font-nunito text-sm text-[#ff2f68]" onClick={() => setSelected(index)}>View profile<ArrowRight size={15} /></button>
            </div>
          ))}
        </>
      ) : (
        <div className="py-10 text-center"><MessageSquare size={32} className="mx-auto mb-3 text-[#ff2f68]" /><h4 className="font-jakarta text-lg font-semibold">No responses yet</h4><p className="mt-2 font-nunito text-sm text-[#667085]">Caregiver responses will appear here.</p></div>
      )}
    </section>
  );
}
