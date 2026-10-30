"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import type { DirectoryCaregiver } from "./caregiverDirectoryData";

export default function CaregiverMessageModal({ caregiver, onClose }: { caregiver: DirectoryCaregiver | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!caregiver) { dialogRef.current?.close(); return; }
    setMessage("");
    setStatus("");
    setError(false);
    try { setMessage(localStorage.getItem(`my-carer-message-draft-${caregiver.id}`) ?? ""); }
    catch { /* Draft editing remains available if browser storage is blocked. */ }
    dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [caregiver]);

  return (
    <dialog ref={dialogRef} className="m-auto w-[calc(100%-32px)] max-w-[540px] rounded-2xl border border-[#ececf0] bg-white p-6 text-[#202925] shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm" aria-labelledby="caregiver-message-title" onCancel={onClose} onClick={event => { if (event.target !== event.currentTarget) return; const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); }}>
      <div className="mb-2 flex items-center justify-between gap-3"><h2 id="caregiver-message-title" className="font-jakarta text-xl font-semibold">Message {caregiver?.name}</h2><button type="button" className="rounded p-1 text-[#667085] hover:bg-gray-100" aria-label="Close message draft" onClick={onClose}><X size={22} /></button></div>
      <p className="mb-5 font-nunito text-sm leading-relaxed text-[#667085]">Introduce yourself and tell this caregiver about the support you need.</p>
      <form onSubmit={event => {
        event.preventDefault();
        if (!caregiver) return;
        if (!message.trim()) { setError(true); setStatus("Please write a message first."); return; }
        try { localStorage.setItem(`my-carer-message-draft-${caregiver.id}`, message.trim()); setError(false); setStatus("Your draft has been saved on this device. It has not been sent."); }
        catch { setError(true); setStatus("Your browser could not save this draft. Please allow browser storage and try again."); }
      }}>
        <label htmlFor="caregiver-message-draft" className="mb-2 block font-nunito text-sm font-semibold">Your message</label>
        <textarea id="caregiver-message-draft" required maxLength={2000} rows={6} autoFocus value={message} onChange={event => { setMessage(event.target.value); setStatus(""); }} placeholder="Hi, I’m looking for care support for..." className="w-full resize-y rounded-lg border border-[#e5e2dc] px-3 py-3 font-nunito text-sm outline-none placeholder:text-[#98a2b3] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" />
        <p className="mt-2 font-nunito text-xs text-[#98a2b3]">Drafts are stored locally. Sending messages requires a connected messaging service.</p>
        {status && <p role="status" className={`mt-3 font-nunito text-sm ${error ? "text-red-600" : "text-[#3c9c68]"}`}>{status}</p>}
        <div className="mt-5 flex justify-end gap-3"><button type="button" className="rounded-lg border border-[#d9dde3] px-4 py-2.5 font-nunito text-sm text-[#344054]" onClick={onClose}>Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#ff2f68] px-4 py-2.5 font-nunito text-sm font-semibold text-white hover:bg-[#e92359]"><MessageSquare size={16} />Save Draft</button></div>
      </form>
    </dialog>
  );
}
