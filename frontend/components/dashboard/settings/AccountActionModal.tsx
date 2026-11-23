"use client";

import { useEffect, useRef } from "react";
import { ShieldCheck, Trash2, X } from "lucide-react";

export default function AccountActionModal({ action, onClose }: { action: "two-factor" | "delete" | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (!action) { dialogRef.current?.close(); return; } dialogRef.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, [action]);

  return <dialog ref={dialogRef} className="m-auto w-[calc(100%-32px)] max-w-[460px] rounded-2xl border border-[#ececf0] bg-white p-6 shadow-xl backdrop:bg-black/40" aria-labelledby="account-action-heading" onCancel={onClose}><div className="mb-5 flex justify-between"><span className={`flex size-12 items-center justify-center rounded-full ${action === "delete" ? "bg-red-50 text-red-600" : "bg-[#fff0f5] text-[#ff2f68]"}`}>{action === "delete" ? <Trash2 size={23} /> : <ShieldCheck size={23} />}</span><button type="button" aria-label="Close account action" onClick={onClose}><X size={21} /></button></div><h2 id="account-action-heading" className="mb-3 font-jakarta text-xl font-semibold text-[#344054]">{action === "delete" ? "Delete your account?" : "Set up two-factor authentication"}</h2><p className="font-nunito text-sm leading-relaxed text-[#667085]">{action === "delete" ? "Account deletion is unavailable in this local preview. Connect an account service before permanently deleting an account. No account or saved data has been deleted." : "Two-factor authentication adds an extra sign-in check. Connect an authentication service to enrol an authenticator app and generate recovery codes. Two-factor authentication is currently off."}</p><div className="mt-6 flex justify-end"><button type="button" className="rounded-lg bg-[#ff2f68] px-4 py-2.5 font-nunito text-sm font-semibold text-white" onClick={onClose}>Back to settings</button></div></dialog>;
}
