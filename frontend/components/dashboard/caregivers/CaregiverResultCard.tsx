"use client";

import { BadgeCheck, Heart, MapPin, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { formatCaregiverRate, type DirectoryCaregiver } from "./caregiverDirectoryData";
import DashboardAvatar from "../loading/DashboardAvatar";

export default function CaregiverResultCard({ caregiver, saved, onViewProfile, onToggleSave, variant = "directory", onMessage, onRemove }: { caregiver: DirectoryCaregiver; saved: boolean; onViewProfile: () => void; onToggleSave: () => void; variant?: "directory" | "saved"; onMessage?: () => void; onRemove?: () => void }) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-[18px] border border-[#e5e2dc] bg-white p-5 max-[450px]:p-4">
      <div className="flex items-start gap-4">
        <DashboardAvatar src={caregiver.image} name={caregiver.name} initials={caregiver.initials} variant={variant === "saved" ? "pink" : "soft"} className={variant === "saved" ? "size-14" : "size-[62px]"} />
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 font-nunito text-[18px] leading-snug font-bold text-[#202925]"><span>{caregiver.name}</span>{caregiver.verified && <BadgeCheck size={17} className="shrink-0 text-[#ff2f68]" aria-label="Verified caregiver" />}</h3>
          <p className="mt-1 font-nunito text-sm leading-relaxed text-[#64716b]">{caregiver.specialty}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2" aria-label={`Rated ${caregiver.rating.toFixed(1)} out of 5`}><span className="flex gap-0.5" aria-hidden="true">{Array.from({ length: 5 }, (_, index) => <Star size={14} key={index} className="fill-[#cf8d17] text-[#cf8d17]" />)}</span><strong className="font-nunito text-sm font-bold text-[#202925]">{caregiver.rating.toFixed(1)}</strong></div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2"><span className="flex items-center gap-1.5 font-nunito text-[14.4px] text-[#64716b]"><MapPin size={17} className="shrink-0" />{caregiver.location}</span><span className="font-nunito text-base font-semibold text-black">£{formatCaregiverRate(caregiver.hourlyRate)}<small className="text-sm font-normal">/hour</small></span></div>
      <div className="mt-4 flex min-h-[58px] flex-wrap content-start gap-1.5">{caregiver.careTypes.map(type => <span className="rounded-full bg-[#ffebf1] px-3 py-1 font-nunito text-[11px] text-[#343434]" key={type}>{type}</span>)}</div>
      {caregiver.verified && <p className="mt-3 mb-5 flex items-center gap-1.5 font-nunito text-xs text-[#ff2f68]"><ShieldCheck size={16} />Verified Profile</p>}
      {variant === "saved" ? <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <button type="button" className="min-h-[38px] shrink-0 rounded-lg bg-[#ff2f68] px-3.5 py-2 font-nunito text-sm font-medium text-white hover:bg-[#e92359]" onClick={onViewProfile}>View Profile</button>
        <button type="button" className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg border border-[#e5e2dc] bg-white px-3 py-2 font-nunito text-sm font-semibold text-[#202925] hover:bg-gray-50" onClick={onMessage}><MessageSquare size={17} />Message</button>
        <button type="button" className="ml-auto px-1 py-2 font-nunito text-sm text-[#cf361e] hover:underline" aria-label={`Remove ${caregiver.name} from saved caregivers`} onClick={onRemove}>Remove</button>
      </div> : <div className="mt-auto grid grid-cols-[minmax(0,1fr)_minmax(100px,0.8fr)] gap-2 pt-1">
        <button type="button" className="min-h-10 rounded-lg bg-[#ff2f68] px-3 py-2 font-nunito text-sm font-medium text-white hover:bg-[#e92359]" onClick={onViewProfile}>View Profile</button>
        <button type="button" className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 font-nunito text-sm ${saved ? "border-[#ffc4d4] bg-[#fff7fa] text-[#ff2f68]" : "border-[#e5e2dc] bg-white text-[#202925]"}`} aria-pressed={saved} aria-label={`${saved ? "Unsave" : "Save"} ${caregiver.name}`} onClick={onToggleSave}><Heart size={17} className="shrink-0 text-[#ff2f68]" fill={saved ? "currentColor" : "none"} />{saved ? "Saved" : "Save"}</button>
      </div>}
    </article>
  );
}
