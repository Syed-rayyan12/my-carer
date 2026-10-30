"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Heart, Sparkles, X } from "lucide-react";
import CaregiverProfileModal, { demoCaregiverProfile } from "@/components/website/CaregiverProfileModal";
import { people } from "./dashboardData";
import { useDashboard } from "./DashboardContext";
import { directoryCaregivers, formatCaregiverRate, type DirectoryCaregiver } from "./caregivers/caregiverDirectoryData";
import { directoryCaregiverProfile } from "./caregivers/directoryCaregiverProfile";

function CaregiverRow({ person, onSelect, response = false }: { person: typeof people[number]; onSelect: () => void; response?: boolean }) {
  return (
    <div className="flex items-center gap-3 border-b border-[#ececf0] py-5 max-[640px]:flex-wrap">
      {person.image ? <Image className="size-12 rounded-full object-cover" src={person.image} alt={person.name} width={48} height={48} /> : <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#e5f1eb] font-nunito text-sm font-bold text-[#ff2f68]">{person.name.split(" ").map(part => part[0]).slice(0, 2).join("")}</span>}
      <div><strong className="text-xs">{person.name}</strong><p className="text-[11px] text-[#858a96]">{response ? <>Available Monday to Friday &middot; &pound;{person.rate}/hour</> : person.specialty}</p></div>
      <button className="ml-auto inline-flex items-center gap-2 whitespace-nowrap text-[10px] font-bold text-[#ff2f68] hover:underline" onClick={onSelect}>View profile<ArrowRight size={15} /></button>
    </div>
  );
}

export default function DashboardDialogs() {
  const { selected, setSelected, panel, setPanel, saved, toggleSaved } = useDashboard();
  const [directorySelection, setDirectorySelection] = useState<DirectoryCaregiver | null>(null);
  const profile = directorySelection ? directoryCaregiverProfile(directorySelection) : selected === null ? demoCaregiverProfile : { ...demoCaregiverProfile, name: people[selected].name, image: people[selected].image, hourlyRate: `\u00a3${people[selected].rate}`, specializations: people[selected].tags, reviewCount: people[selected].reviews };
  const extraSaved = directoryCaregivers.filter(person => saved.includes(person.name) && !people.some(existing => existing.name === person.name));
  const panelRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (panel) panelRef.current?.showModal(); else panelRef.current?.close(); }, [panel]);

  function selectCaregiver(index: number) { setPanel(null); setSelected(index); }

  return (
    <>
      <CaregiverProfileModal open={selected !== null || directorySelection !== null} onClose={() => { setSelected(null); setDirectorySelection(null); }} profile={profile} saved={saved.includes(profile.name)} onFavouriteChange={(isSaved, caregiver) => { if (saved.includes(caregiver.name) !== isSaved) toggleSaved(caregiver.name); }} />
      <dialog ref={panelRef} className="m-auto w-[calc(100%-32px)] max-w-[620px] rounded-2xl border border-[#ececf0] bg-white p-6 text-[#202630] backdrop:bg-[#101929]/45 backdrop:backdrop-blur-sm" onCancel={() => setPanel(null)} onClick={event => { if (event.target === event.currentTarget) setPanel(null); }}>
        <div className="flex items-center justify-between gap-4 border-b border-[#ececf0] pb-4"><h2 className="text-xl font-extrabold">{panel}</h2><button className="cursor-pointer" aria-label="Close dialog" onClick={() => setPanel(null)}><X size={22} /></button></div>
        {panel === "Saved Caregivers" ? saved.length ? <>{people.filter(person => saved.includes(person.name)).map(person => <CaregiverRow key={person.name} person={person} onSelect={() => selectCaregiver(people.indexOf(person))} />)}{extraSaved.map(person => <CaregiverRow key={person.id} person={{ name: person.name, image: person.image, specialty: person.specialty, location: person.location, rate: formatCaregiverRate(person.hourlyRate), reviews: person.reviews, tags: person.careTypes }} onSelect={() => { setPanel(null); setDirectorySelection(person); }} />)}</> : (
          <div className="px-4 py-9 text-center"><Heart size={32} className="mx-auto mb-4 text-[#ff2f68]" /><h3 className="text-lg font-extrabold">Your favourites belong here</h3><p className="mt-2.5 mb-5 text-[13px] text-[#858a96]">Save a recommended caregiver to find them here whenever you need.</p></div>
        ) : panel === "Caregiver Responses" ? (
          <div><p className="pt-4 text-[11px] text-[#858a96]">Demo responses for your elderly care requirement.</p>{people.map((person, index) => <CaregiverRow key={person.name} person={person} response onSelect={() => selectCaregiver(index)} />)}</div>
        ) : (
          <div className="px-4 py-9 text-center">
            <Sparkles size={32} className="mx-auto mb-4 text-[#ff2f68]" />
            <h3 className="text-lg font-extrabold">{panel === "My Profile" ? "James Wilson" : "Your care journey, all in one place"}</h3>
            <p className="mt-2.5 mb-5 text-[13px] text-[#858a96]">{panel === "My Profile" ? "Care seeker - Manchester, UK" : "This dashboard is a preview with sample activity. Your account's requirements, messages and arrangements will appear here once connected."}</p>
            <Link className="inline-flex items-center justify-center gap-5 rounded-lg bg-[#ff2f68] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#e92359]" href="/care-seeker-dashboard/find-caregivers" onClick={() => setPanel(null)}>Explore caregivers<ArrowRight size={16} /></Link>
          </div>
        )}
      </dialog>
    </>
  );
}
