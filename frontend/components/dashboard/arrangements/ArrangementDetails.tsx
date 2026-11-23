"use client";

import type { DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";
import { formatCaregiverRate } from "../caregivers/caregiverDirectoryData";
import { formatRequirementDate } from "../requirements/CareRequirementsContext";
import type { CareArrangement } from "./arrangementsData";

export default function ArrangementDetails({ arrangement, caregiver, onMessage, onProfile, onManage }: { arrangement: CareArrangement; caregiver: DirectoryCaregiver; onMessage: () => void; onProfile: () => void; onManage: () => void }) {
  const details = [
    { label: "Caregiver", value: caregiver.name }, { label: "Care Type", value: arrangement.careType },
    { label: "Start Date", value: formatRequirementDate(arrangement.startDate) }, { label: "Schedule", value: arrangement.schedule },
    { label: "Location", value: `${arrangement.location}, UK` }, { label: "Rate", value: `£${formatCaregiverRate(caregiver.hourlyRate)}/hour` },
  ];

  return <aside className="rounded-[18px] border border-[#ff2f68] bg-white p-6" aria-labelledby="arrangement-details-heading"><h2 id="arrangement-details-heading" className="mb-1 font-commissioner text-[22px] font-bold text-black">Arrangement Details</h2><dl>{details.map(({ label, value }) => <div className="flex justify-between gap-4 border-b border-[#e5e2dc] py-4 font-nunito text-[14.4px] last:border-b-0" key={label}><dt className="shrink-0 text-[#64716b]">{label}</dt><dd className="text-right font-semibold text-[#202925]">{value}</dd></div>)}</dl><div className="mt-5 flex flex-col gap-2"><button type="button" className="min-h-11 rounded-lg bg-[#ff2f68] px-4 py-3 font-nunito text-sm font-semibold text-white hover:bg-[#e92359]" onClick={onMessage}>Message Caregiver</button><button type="button" className="min-h-11 rounded-lg border border-[#e5e2dc] px-4 py-3 font-nunito text-sm font-semibold text-[#202925] hover:bg-gray-50" onClick={onProfile}>View Caregiver Profile</button><button type="button" className="mt-1 min-h-10 px-4 py-2 font-nunito text-[14.4px] text-[#ff2f68] hover:underline" onClick={onManage}>Manage Arrangement</button></div></aside>;
}
