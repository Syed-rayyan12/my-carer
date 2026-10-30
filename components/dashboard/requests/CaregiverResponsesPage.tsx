"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { useDashboard } from "../DashboardContext";
import { useCareRequirements } from "../requirements/CareRequirementsContext";
import CaregiverProfileModal, { demoCaregiverProfile } from "@/components/website/CaregiverProfileModal";
import CaregiverMessageModal from "../caregivers/CaregiverMessageModal";
import { directoryCaregiverProfile } from "../caregivers/directoryCaregiverProfile";
import type { DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";
import CaregiverResponseRow from "./CaregiverResponseRow";
import { ResponseListSkeleton } from "./RequestSkeleton";
import { getRequestResponders } from "./requestData";

export default function CaregiverResponsesPage({ requirementId }: { requirementId: string }) {
  const { requirements, ready } = useCareRequirements();
  const { saved, setCaregiverSaved } = useDashboard();
  const requirement = requirements.find(item => item.id === requirementId);
  const responders = requirement ? getRequestResponders(requirement) : [];
  const [selected, setSelected] = useState<DirectoryCaregiver | null>(null);
  const [messageRecipient, setMessageRecipient] = useState<DirectoryCaregiver | null>(null);
  const [shortlisted, setShortlisted] = useState<string[]>([]);
  const [shortlistReady, setShortlistReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState("");
  const storageKey = `my-carer-request-shortlist-${requirementId}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(value => typeof value === "string")) setShortlisted([...new Set(parsed)]);
      }
    } catch { setStorageError(true); }
    finally { setShortlistReady(true); }
  }, [storageKey]);

  useEffect(() => {
    if (!shortlistReady) return;
    try { localStorage.setItem(storageKey, JSON.stringify(shortlisted)); }
    catch { setStorageError(true); }
  }, [shortlisted, shortlistReady, storageKey]);

  function toggleShortlist(caregiver: DirectoryCaregiver) {
    const removing = shortlisted.includes(caregiver.id);
    setShortlisted(current => current.includes(caregiver.id) ? current.filter(id => id !== caregiver.id) : [...current, caregiver.id]);
    setNotice(`${caregiver.name} ${removing ? "removed from" : "added to"} this request's shortlist.`);
  }

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]">
        <Link className="mb-2 inline-flex items-center gap-2 font-nunito text-sm text-[#ff2f68] hover:underline" href="/care-seeker-dashboard/my-requests"><ArrowLeft size={16} />Back to My Requests</Link>
        <h1 className="font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Caregiver Responses</h1>
        {requirement && <p className="sr-only">Responses to {requirement.title}</p>}
      </section>
      <p role="status" className="sr-only">{notice}</p>
      {storageError && <p className="mb-4 font-nunito text-sm text-amber-700" role="status">Browser storage is unavailable. Your shortlist will only last for this visit.</p>}
      {!ready || !shortlistReady ? <ResponseListSkeleton /> : !requirement ? (
        <section className="rounded-2xl border border-[#e5e2dc] bg-white px-6 py-10"><h2 className="font-jakarta text-xl font-semibold text-[#202925]">Request not found</h2><p className="mt-2 font-nunito text-sm text-[#667085]">Return to My Requests to choose a care request available in this browser.</p></section>
      ) : responders.length ? (
        <section className="overflow-hidden rounded-[18px] border border-[#e5e2dc] bg-white" aria-label={`Caregiver responses to ${requirement.title}`}>
          {responders.map(caregiver => <CaregiverResponseRow key={caregiver.id} caregiver={caregiver} shortlisted={shortlisted.includes(caregiver.id)} onViewProfile={() => setSelected(caregiver)} onMessage={() => setMessageRecipient(caregiver)} onShortlist={() => toggleShortlist(caregiver)} />)}
        </section>
      ) : (
        <section className="rounded-2xl border border-[#e5e2dc] bg-white px-6 py-14 text-center"><MessageSquare size={36} className="mx-auto mb-4 text-[#ff2f68]" /><h2 className="font-jakarta text-xl font-semibold text-[#202925]">No responses yet</h2><p className="mt-2 font-nunito text-sm text-[#667085]">Caregiver responses to {requirement.title} will appear here.</p></section>
      )}
      <CaregiverProfileModal open={selected !== null} onClose={() => setSelected(null)} profile={selected ? directoryCaregiverProfile(selected) : demoCaregiverProfile} saved={selected ? saved.includes(selected.name) : false} onFavouriteChange={(isSaved, caregiver) => setCaregiverSaved(caregiver.name, isSaved)} />
      <CaregiverMessageModal caregiver={messageRecipient} onClose={() => setMessageRecipient(null)} />
    </main>
  );
}
