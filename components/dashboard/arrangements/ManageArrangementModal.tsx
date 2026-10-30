"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { arrangementTabs, type CareArrangement, type ArrangementStatus } from "./arrangementsData";

export default function ManageArrangementModal({ arrangement, onClose, onSave }: { arrangement: CareArrangement | null; onClose: () => void; onSave: (arrangement: CareArrangement) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<CareArrangement | null>(arrangement);

  useEffect(() => {
    if (!arrangement) { dialogRef.current?.close(); return; }
    setDraft(arrangement);
    dialogRef.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [arrangement]);

  return <dialog ref={dialogRef} className="m-auto w-[calc(100%-32px)] max-w-[540px] rounded-2xl border border-[#ececf0] bg-white p-6 text-[#344054] shadow-xl backdrop:bg-black/40" aria-labelledby="manage-arrangement-heading" onCancel={onClose}><div className="mb-5 flex items-center justify-between gap-3"><h2 id="manage-arrangement-heading" className="font-jakarta text-xl font-semibold">Manage Arrangement</h2><button type="button" aria-label="Close arrangement form" onClick={onClose}><X size={22} /></button></div>{draft && <form className="space-y-4" onSubmit={event => { event.preventDefault(); if (draft.schedule.trim() && draft.location.trim()) onSave({ ...draft, schedule: draft.schedule.trim(), location: draft.location.trim() }); }}><label className="block font-nunito text-sm font-semibold">Status<select className="mt-1.5 h-11 w-full rounded-lg border border-[#e5e2dc] bg-white px-3 font-normal outline-none focus:border-[#ff2f68]" value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value as ArrangementStatus })}>{arrangementTabs.map(tab => <option value={tab.id} key={tab.id}>{tab.label}</option>)}</select></label><label className="block font-nunito text-sm font-semibold">Start date<input required type="date" className="mt-1.5 h-11 w-full rounded-lg border border-[#e5e2dc] px-3 font-normal outline-none focus:border-[#ff2f68]" value={draft.startDate} onChange={event => setDraft({ ...draft, startDate: event.target.value })} /></label><label className="block font-nunito text-sm font-semibold">Schedule<input required className="mt-1.5 h-11 w-full rounded-lg border border-[#e5e2dc] px-3 font-normal outline-none focus:border-[#ff2f68]" value={draft.schedule} onChange={event => setDraft({ ...draft, schedule: event.target.value })} /></label><label className="block font-nunito text-sm font-semibold">Location<input required className="mt-1.5 h-11 w-full rounded-lg border border-[#e5e2dc] px-3 font-normal outline-none focus:border-[#ff2f68]" value={draft.location} onChange={event => setDraft({ ...draft, location: event.target.value })} /></label><label className="block font-nunito text-sm font-semibold">Notes<textarea rows={3} className="mt-1.5 w-full rounded-lg border border-[#e5e2dc] px-3 py-2 font-normal outline-none focus:border-[#ff2f68]" value={draft.notes} onChange={event => setDraft({ ...draft, notes: event.target.value })} /></label><p className="font-nunito text-xs text-[#98a2b3]">Changes are saved on this device.</p><div className="flex justify-end gap-3"><button type="button" className="rounded-lg border border-[#d9dde3] px-4 py-2.5 font-nunito text-sm" onClick={onClose}>Cancel</button><button type="submit" className="rounded-lg bg-[#ff2f68] px-4 py-2.5 font-nunito text-sm font-semibold text-white">Save Changes</button></div></form>}</dialog>;
}
