"use client";

import { Bookmark, Star } from "lucide-react";
import DashboardAvatar from "../loading/DashboardAvatar";
import { formatCaregiverRate, type DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";

export default function CaregiverResponseRow({ caregiver, shortlisted, onViewProfile, onMessage, onShortlist }: { caregiver: DirectoryCaregiver; shortlisted: boolean; onViewProfile: () => void; onMessage: () => void; onShortlist: () => void }) {
  return (
    <article className="flex min-h-28 items-center justify-between gap-5 border-b border-[#e5e2dc] px-5 py-6 last:border-b-0 max-[900px]:flex-wrap">
      <div className="flex min-w-0 items-center gap-4"><DashboardAvatar src={caregiver.image} name={caregiver.name} initials={caregiver.initials} className="size-14" /><div className="min-w-0"><h2 className="font-nunito text-[18px] leading-snug font-bold text-[#202925]">{caregiver.name}</h2><p className="mt-1 font-nunito text-sm text-[#64716b]">{caregiver.specialty}</p><div className="mt-1 flex flex-wrap items-center gap-2 font-nunito text-sm font-bold text-[#202925]"><span className="flex gap-0.5" aria-label={`${caregiver.rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star size={14} key={index} className="fill-[#cf8d17] text-[#cf8d17]" />)}</span><span>{caregiver.rating.toFixed(1)}</span><span>£{formatCaregiverRate(caregiver.hourlyRate)}/hour</span></div></div></div>
      <div className="flex shrink-0 flex-wrap items-center gap-2 max-[900px]:ml-[72px] max-[500px]:ml-0">
        <button type="button" className="min-h-[38px] rounded-lg border border-[#e5e2dc] bg-white px-3.5 py-2 font-nunito text-sm font-semibold text-[#202925] hover:bg-gray-50" onClick={onViewProfile}>View Profile</button>
        <button type="button" className="min-h-[38px] rounded-lg border border-[#e5e2dc] bg-white px-3.5 py-2 font-nunito text-sm font-semibold text-[#202925] hover:bg-gray-50" onClick={onMessage}>Message</button>
        <button type="button" aria-pressed={shortlisted} aria-label={`${shortlisted ? "Remove" : "Add"} ${caregiver.name} ${shortlisted ? "from" : "to"} shortlist`} className="inline-flex min-h-[38px] items-center gap-2 px-3 py-2 font-nunito text-sm text-[#ff2f68] hover:bg-[#fff5f8]" onClick={onShortlist}><Bookmark size={17} fill={shortlisted ? "currentColor" : "none"} />{shortlisted ? "Shortlisted" : "Shortlist"}</button>
      </div>
    </article>
  );
}
