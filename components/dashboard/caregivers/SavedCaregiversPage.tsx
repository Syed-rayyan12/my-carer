"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Heart } from "lucide-react";
import CaregiverProfileModal, { demoCaregiverProfile } from "@/components/website/CaregiverProfileModal";
import { useDashboard } from "../DashboardContext";
import { SavedCaregiverGridSkeleton } from "../loading/DashboardSkeleton";
import CaregiverResultCard from "./CaregiverResultCard";
import CaregiverMessageModal from "./CaregiverMessageModal";
import { allDashboardCaregivers, type DirectoryCaregiver } from "./caregiverDirectoryData";
import { directoryCaregiverProfile } from "./directoryCaregiverProfile";

export default function SavedCaregiversPage() {
  const { saved, savedReady, savedStorageError, setCaregiverSaved } = useDashboard();
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<DirectoryCaregiver | null>(null);
  const [messageRecipient, setMessageRecipient] = useState<DirectoryCaregiver | null>(null);
  const [lastRemoved, setLastRemoved] = useState<string | null>(null);
  const caregivers = saved.flatMap(name => {
    const caregiver = allDashboardCaregivers.find(person => person.name === name);
    return caregiver ? [caregiver] : [];
  });

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]">
        <h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Saved Caregivers</h1>
        <p className="font-nunito text-base text-[#363636]">Keep your favourite caregivers in one place so you can easily compare and contact them later.</p>
      </section>
      {savedStorageError && <p className="mb-4 font-nunito text-sm text-amber-700" role="status">Browser storage is unavailable. Changes will only last for this session.</p>}
      {lastRemoved && <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[#ffd1de] bg-[#fff5f8] px-4 py-3 font-nunito text-sm text-[#344054]"><p role="status">{lastRemoved} was removed from saved caregivers.</p><button type="button" className="font-semibold text-[#ff2f68] hover:underline" onClick={() => { setCaregiverSaved(lastRemoved, true); setLastRemoved(null); }}>Undo</button></div>}
      {!savedReady ? <SavedCaregiverGridSkeleton /> : (
        <motion.div layout={!reduceMotion} className="relative grid grid-cols-3 items-stretch gap-4 max-[1350px]:grid-cols-2 max-[750px]:grid-cols-1" transition={{ layout: { type: "spring", stiffness: 350, damping: 32 } }}>
          <AnimatePresence initial={false} mode="popLayout">
            {caregivers.map(caregiver => <motion.div key={caregiver.id} layout={reduceMotion ? false : "position"} initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }} transition={{ duration: reduceMotion ? 0 : 0.18, layout: { type: "spring", stiffness: 350, damping: 32 } }} className="h-full min-w-0"><CaregiverResultCard variant="saved" caregiver={caregiver} saved onViewProfile={() => setSelected(caregiver)} onToggleSave={() => setCaregiverSaved(caregiver.name, false)} onMessage={() => setMessageRecipient(caregiver)} onRemove={() => { setCaregiverSaved(caregiver.name, false); setLastRemoved(caregiver.name); }} /></motion.div>)}
            {caregivers.length === 0 && <motion.div key="no-saved-caregivers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : 0.18 }} className="col-span-full rounded-2xl border border-[#e5e2dc] bg-white px-6 py-14 text-center"><Heart size={38} className="mx-auto mb-4 text-[#ff2f68]" /><h2 className="font-jakarta text-xl font-semibold text-[#202925]">Your favourites belong here</h2><p className="mt-2 mb-6 font-nunito text-sm text-[#667085]">Save caregivers while browsing to compare their profiles and find the right support.</p><Link className="inline-flex items-center gap-2 rounded-lg bg-[#ff2f68] px-5 py-3 font-nunito text-sm font-semibold text-white hover:bg-[#e92359]" href="/care-seeker-dashboard/find-caregivers">Find Caregivers<ArrowRight size={16} /></Link></motion.div>}
          </AnimatePresence>
        </motion.div>
      )}
      <CaregiverProfileModal open={selected !== null} onClose={() => setSelected(null)} profile={selected ? directoryCaregiverProfile(selected) : demoCaregiverProfile} saved={selected ? saved.includes(selected.name) : false} onFavouriteChange={(isSaved, caregiver) => setCaregiverSaved(caregiver.name, isSaved)} />
      <CaregiverMessageModal caregiver={messageRecipient} onClose={() => setMessageRecipient(null)} />
    </main>
  );
}
