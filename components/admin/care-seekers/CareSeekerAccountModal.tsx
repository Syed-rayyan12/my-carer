"use client";

import { useEffect, useRef } from "react";
import { Ban, Trash2, X } from "lucide-react";
import type { AdminCareSeeker } from "./adminCareSeekerData";
import CareSeekerEditForm from "./CareSeekerEditForm";

export default function CareSeekerAccountModal({ action, seeker, onClose, onSave, onSuspend, onDelete }: { action: "edit" | "suspend" | "delete" | null; seeker: AdminCareSeeker; onClose: () => void; onSave: (seeker: AdminCareSeeker) => void; onSuspend: () => void; onDelete: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const suspended = seeker.status === "Suspended";
  const open = action !== null;
  const title = action === "edit" ? "Edit Care Seeker" : action === "delete" ? "Delete Account?" : suspended ? "Reactivate Account?" : "Suspend Account?";

  useEffect(() => { if (!open) { dialogRef.current?.close(); return; } dialogRef.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [open]);

  return <dialog ref={dialogRef} className={`m-auto max-h-[85dvh] w-[calc(100%-32px)] overflow-y-auto rounded-xl border border-[#e3e5e7] bg-white p-0 text-[#344054] shadow-xl backdrop:bg-black/40 ${action === "edit" ? "max-w-[680px]" : "max-w-[460px]"}`} aria-labelledby="care-seeker-modal-heading" onCancel={onClose}><header className="flex items-center justify-between gap-3 px-6 py-5"><h2 id="care-seeker-modal-heading" className="font-jakarta text-xl font-semibold">{title}</h2><button type="button" aria-label="Close care seeker dialog" className="rounded p-1 text-[#64716b] hover:bg-gray-100" onClick={onClose}><X size={21} /></button></header>{action === "edit" ? <CareSeekerEditForm key={seeker.id} seeker={seeker} onCancel={onClose} onSave={onSave} /> : <><div className="px-6 pb-6"><span className={`mb-4 flex size-12 items-center justify-center rounded-full ${action === "delete" ? "bg-red-50 text-red-600" : "bg-[#fff0f5] text-[#ff2f68]"}`}>{action === "delete" ? <Trash2 size={23} /> : <Ban size={23} />}</span><p className="font-nunito text-sm leading-relaxed text-[#667085]">{action === "delete" ? <>Delete <strong className="text-[#344054]">{seeker.name}</strong> from this local admin preview? Their care seeker and recent registration records will be removed from this browser.</> : <>{suspended ? "Reactivate" : "Suspend"} <strong className="text-[#344054]">{seeker.name}</strong>&apos;s account in this local preview? {suspended ? "Their previous account status will be restored." : "You can reactivate this account later."}</>}</p></div><footer className="flex justify-end gap-2 border-t border-[#e3e5e7] bg-[#f4f6f5] px-6 py-4"><button type="button" autoFocus className="rounded-lg border border-[#dfe4e1] bg-white px-4 py-2.5 font-nunito text-sm" onClick={onClose}>Cancel</button><button type="button" className={`rounded-lg px-4 py-2.5 font-nunito text-sm font-semibold text-white ${action === "delete" ? "bg-[#b91e13]" : "bg-[#ff2f68]"}`} onClick={action === "delete" ? onDelete : onSuspend}>{action === "delete" ? "Delete Account" : suspended ? "Reactivate Account" : "Suspend Account"}</button></footer></>}</dialog>;
}
