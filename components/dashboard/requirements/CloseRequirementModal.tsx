"use client";

import { useEffect, useRef } from "react";
import { Trash2, X } from "lucide-react";
import type { CareRequirement } from "./CareRequirementsContext";

export default function CloseRequirementModal({ requirement, onCancel, onConfirm }: { requirement: CareRequirement | null; onCancel: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!requirement) { dialogRef.current?.close(); return; }
    dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [requirement]);

  return (
    <dialog ref={dialogRef} className="m-auto w-[calc(100%-32px)] max-w-[460px] rounded-2xl border border-[#ececf0] bg-white p-7 text-[#202925] shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm" aria-labelledby="close-requirement-title" aria-describedby="close-requirement-description" onCancel={onCancel} onClick={event => { if (event.target === event.currentTarget) onCancel(); }}>
      <div className="mb-5 flex items-start justify-between"><span className="flex size-12 items-center justify-center rounded-full bg-[#fff0f4] text-[#ff2f68]"><Trash2 size={23} /></span><button className="rounded p-1 text-[#667085] hover:bg-gray-100" aria-label="Cancel closing requirement" onClick={onCancel}><X size={21} /></button></div>
      <h2 id="close-requirement-title" className="mb-2 font-jakarta text-xl font-semibold">Close care requirement?</h2>
      <p id="close-requirement-description" className="font-nunito text-sm leading-relaxed text-[#667085]">Are you sure you want to close <strong className="font-semibold text-[#344054]">{requirement?.title}</strong>? It will be marked as closed and will no longer accept new responses. You can still view existing responses.</p>
      <div className="mt-7 flex justify-end gap-3"><button className="rounded-lg border border-[#d9dde3] px-4 py-2.5 font-nunito text-sm font-semibold text-[#344054] hover:bg-gray-50" onClick={onCancel} autoFocus>Cancel</button><button className="rounded-lg bg-[#ff2f68] px-4 py-2.5 font-nunito text-sm font-semibold text-white hover:bg-[#e92359]" onClick={onConfirm}>Close Requirement</button></div>
    </dialog>
  );
}
