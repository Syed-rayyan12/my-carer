"use client";

import { useEffect, useRef } from "react";
import { Ban, FileText, Trash2, X } from "lucide-react";
import type { AdminCaregiver } from "./adminCaregiverData";
import CaregiverEditForm from "./CaregiverEditForm";

export type CaregiverAccountAction = { type: "edit" | "suspend" | "delete" } | { type: "document"; document: string } | null;

export default function CaregiverAccountModal({ action, caregiver, onClose, onSave, onSuspension, onDelete }: { action: CaregiverAccountAction; caregiver: AdminCaregiver; onClose: () => void; onSave: (caregiver: AdminCaregiver) => void; onSuspension: () => void; onDelete: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = action !== null;
  const suspended = caregiver.status === "Suspended";
  const title = action?.type === "edit" ? "Edit Profile" : action?.type === "delete" ? "Delete Account?" : action?.type === "suspend" ? suspended ? "Reactivate Account?" : "Suspend Account?" : action?.type === "document" ? action.document : "Caregiver Account";

  useEffect(() => {
    if (!open) { dialogRef.current?.close(); return; }
    dialogRef.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return <dialog ref={dialogRef} className={`m-auto max-h-[85dvh] w-[calc(100%-32px)] overflow-y-auto rounded-xl border border-[#e3e5e7] bg-white p-0 text-[#344054] shadow-xl backdrop:bg-black/40 ${action?.type === "edit" ? "max-w-[680px]" : "max-w-[460px]"}`} aria-labelledby="caregiver-account-modal-heading" onCancel={onClose}><header className="flex items-center justify-between gap-3 px-6 py-5"><h2 id="caregiver-account-modal-heading" className="font-jakarta text-xl font-semibold">{title}</h2><button type="button" aria-label="Close caregiver account dialog" className="rounded p-1 text-[#64716b] hover:bg-gray-100" onClick={onClose}><X size={21} /></button></header>{action?.type === "edit" ? <CaregiverEditForm key={caregiver.id} caregiver={caregiver} onCancel={onClose} onSave={onSave} /> : <><div className="px-6 pb-6">{action?.type === "document" ? <><FileText size={36} className="mb-4 text-[#64716b]" /><p className="font-nunito text-sm font-semibold">{caregiver.name} · {action.document}</p><p className="mt-2 font-nunito text-sm leading-relaxed text-[#667085]">No document file is attached to this sample profile. An uploaded file will be needed to show or download the document.</p></> : <><span className={`mb-4 flex size-12 items-center justify-center rounded-full ${action?.type === "delete" ? "bg-red-50 text-red-600" : "bg-[#fff0f5] text-[#ff2f68]"}`}>{action?.type === "delete" ? <Trash2 size={23} /> : <Ban size={23} />}</span><p className="font-nunito text-sm leading-relaxed text-[#667085]">{action?.type === "delete" ? <>Delete <strong className="text-[#344054]">{caregiver.name}</strong> from this local admin preview? Their caregiver and recent registration records will be removed from this browser.</> : <>{suspended ? "Reactivate" : "Suspend"} <strong className="text-[#344054]">{caregiver.name}</strong>&apos;s account in this local preview? {suspended ? "Their previous account status will be restored." : "You can reactivate this account later."}</>}</p></>}</div><footer className="flex justify-end gap-2 border-t border-[#e3e5e7] bg-[#f4f6f5] px-6 py-4"><button type="button" autoFocus className="rounded-lg border border-[#dfe4e1] bg-white px-4 py-2.5 font-nunito text-sm" onClick={onClose}>{action?.type === "document" ? "Close" : "Cancel"}</button>{action?.type !== "document" && <button type="button" className={`rounded-lg px-4 py-2.5 font-nunito text-sm font-semibold text-white ${action?.type === "delete" ? "bg-[#b91e13]" : "bg-[#ff2f68]"}`} onClick={action?.type === "delete" ? onDelete : onSuspension}>{action?.type === "delete" ? "Delete Account" : suspended ? "Reactivate Account" : "Suspend Account"}</button>}</footer></>}</dialog>;
}
