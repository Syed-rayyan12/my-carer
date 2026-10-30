"use client";

import { useState, type KeyboardEvent } from "react";
import { ClipboardList } from "lucide-react";
import { useCareRequirements } from "../requirements/CareRequirementsContext";
import RequestRow from "./RequestRow";
import { RequestListSkeleton } from "./RequestSkeleton";
import { filterRequests, type RequestTab } from "./requestData";

const tabs: { id: RequestTab; label: string }[] = [{ id: "all", label: "All" }, { id: "active", label: "Active" }, { id: "responses", label: "Responses" }, { id: "closed", label: "Closed" }];

export default function MyRequestsPage() {
  const { requirements, ready } = useCareRequirements();
  const [tab, setTab] = useState<RequestTab>("all");
  const requests = filterRequests(requirements, tab);

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setTab(tabs[next].id);
    document.getElementById(`request-tab-${tabs[next].id}`)?.focus();
  }

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">My Requests</h1><p className="font-nunito text-base text-[#363636]">Track the care requests you&apos;ve created and see which caregivers have responded.</p></section>
      {!ready ? <RequestListSkeleton /> : <section className="overflow-hidden rounded-[11px] border border-[#d9d9d9] bg-white">
        <div className="flex gap-5 overflow-x-auto border-b border-[#ececf0] px-5 max-[500px]:gap-3" role="tablist" aria-label="Filter requests">
          {tabs.map(({ id, label }, index) => <button key={id} id={`request-tab-${id}`} role="tab" type="button" aria-selected={tab === id} aria-controls="request-tab-panel" tabIndex={tab === id ? 0 : -1} onKeyDown={event => navigateTabs(event, index)} onClick={() => setTab(id)} className={`inline-flex min-h-[50px] shrink-0 items-center gap-2 border-b-2 px-1 font-nunito text-sm font-semibold ${tab === id ? "border-[#ff2f68] text-[#ff2f68]" : "border-transparent text-[#64716b] hover:text-[#ff2f68]"}`}>{label}<span className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-normal ${tab === id ? "bg-[#fff0f5] text-[#ff2f68]" : "bg-[#f8f9fb] text-[#667085]"}`}>{filterRequests(requirements, id).length}</span></button>)}
        </div>
        <div id="request-tab-panel" role="tabpanel" aria-labelledby={`request-tab-${tab}`} tabIndex={0} className="pb-5 outline-none">
          {requests.length ? requests.map(requirement => <RequestRow key={requirement.id} requirement={requirement} />) : <div className="px-6 py-14 text-center"><ClipboardList size={34} className="mx-auto mb-4 text-[#ff2f68]" /><h2 className="font-jakarta text-lg font-semibold text-[#202925]">No {tab === "all" ? "" : tab === "responses" ? "responded " : `${tab} `}requests yet</h2><p className="mt-2 font-nunito text-sm text-[#667085]">Your matching care requests will appear here.</p></div>}
        </div>
      </section>}
    </main>
  );
}
