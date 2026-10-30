"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { usePersistentDashboardState } from "../usePersistentDashboardState";
import { useDashboard } from "../DashboardContext";
import { allDashboardCaregivers, type DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";
import CaregiverMessageModal from "../caregivers/CaregiverMessageModal";
import CaregiverProfileModal, { demoCaregiverProfile } from "@/components/website/CaregiverProfileModal";
import { directoryCaregiverProfile } from "../caregivers/directoryCaregiverProfile";
import { ArrangementsContentSkeleton } from "../loading/AccountPagesSkeleton";
import { initialArrangements, isArrangementList, arrangementTabs, type ArrangementStatus, type CareArrangement } from "./arrangementsData";
import ArrangementCard from "./ArrangementCard";
import ArrangementDetails from "./ArrangementDetails";
import ManageArrangementModal from "./ManageArrangementModal";

export default function CareArrangementsPage() {
  const { value: arrangements, setValue: setArrangements, ready, storageError } = usePersistentDashboardState("my-carer-arrangements", initialArrangements, isArrangementList);
  const { saved, setCaregiverSaved } = useDashboard();
  const [tab, setTab] = useState<ArrangementStatus>("upcoming");
  const [selectedId, setSelectedId] = useState("arrangement-sarah");
  const [profile, setProfile] = useState<DirectoryCaregiver | null>(null);
  const [messageRecipient, setMessageRecipient] = useState<DirectoryCaregiver | null>(null);
  const [managing, setManaging] = useState<CareArrangement | null>(null);
  const visible = arrangements.filter(item => item.status === tab);
  const selected = visible.find(item => item.id === selectedId) ?? visible[0];
  const caregiver = allDashboardCaregivers.find(person => person.id === selected?.caregiverId);

  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Care Arrangements</h1><p className="font-nunito text-base text-[#363636]">Manage your upcoming, active and previous care arrangements.</p></section>{storageError && <p role="status" className="mb-4 font-nunito text-sm text-amber-700">Browser storage is unavailable. Changes will only last for this visit.</p>}{!ready ? <ArrangementsContentSkeleton /> : <><nav aria-label="Filter arrangements" className="mb-6 flex gap-1 overflow-x-auto rounded-[11px] border border-[#d9d9d9] bg-white p-1">{arrangementTabs.map(item => <button key={item.id} type="button" aria-pressed={tab === item.id} onClick={() => setTab(item.id)} className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1 font-nunito text-sm ${tab === item.id ? "bg-white font-semibold text-[#202925] shadow-[0_2px_12px_#10192920]" : "text-[#64716b]"}`}>{item.label}<span className={`text-xs ${tab === item.id ? "text-[#ff2f68]" : "text-[#64716b]"}`}>{arrangements.filter(arrangement => arrangement.status === item.id).length}</span></button>)}</nav>{visible.length ? <div className="grid grid-cols-[minmax(0,1.75fr)_minmax(320px,1fr)] items-start gap-6 max-[1100px]:grid-cols-1"><div className="space-y-5">{visible.map(arrangement => { const person = allDashboardCaregivers.find(item => item.id === arrangement.caregiverId); return person ? <ArrangementCard key={arrangement.id} arrangement={arrangement} caregiver={person} selected={selected?.id === arrangement.id} onSelect={() => setSelectedId(arrangement.id)} /> : null; })}</div>{selected && caregiver && <ArrangementDetails arrangement={selected} caregiver={caregiver} onMessage={() => setMessageRecipient(caregiver)} onProfile={() => setProfile(caregiver)} onManage={() => setManaging(selected)} />}</div> : <section className="rounded-xl border border-[#e5e2dc] bg-white py-14 text-center"><CalendarDays size={34} className="mx-auto mb-3 text-[#ff2f68]" /><h2 className="font-jakarta text-lg font-semibold">No {tab} arrangements</h2></section>}</>}<CaregiverProfileModal open={profile !== null} onClose={() => setProfile(null)} profile={profile ? directoryCaregiverProfile(profile) : demoCaregiverProfile} saved={profile ? saved.includes(profile.name) : false} onFavouriteChange={(isSaved, person) => setCaregiverSaved(person.name, isSaved)} /><CaregiverMessageModal caregiver={messageRecipient} onClose={() => setMessageRecipient(null)} /><ManageArrangementModal arrangement={managing} onClose={() => setManaging(null)} onSave={updated => { setArrangements(current => current.map(item => item.id === updated.id ? updated : item)); setTab(updated.status); setSelectedId(updated.id); setManaging(null); }} /></main>;
}
