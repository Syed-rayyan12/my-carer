"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { AdminCareJob } from "./careJobsData";
import EditCareJobForm from "./EditCareJobForm";

export type CareJobAction = "approve" | "edit" | "remove";
export default function CareJobModal({ job, action, onClose, onSave, onConfirm }: { job: AdminCareJob; action: CareJobAction; onClose: () => void; onSave: (job: AdminCareJob) => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, []);
  const title = action === "edit" ? "Edit Job" : action === "approve" ? "Approve Job" : "Remove Job Listing";
  return <dialog ref={ref} aria-labelledby="care-job-modal-title" onCancel={event => { event.preventDefault(); onClose(); }} className={`m-auto max-h-[90dvh] w-[calc(100%-32px)] overflow-y-auto rounded-[10px] border-0 bg-white p-0 font-nunito text-[#182522] shadow-2xl backdrop:bg-black/40 ${action === "edit" ? "max-w-[672px]" : "max-w-[448px]"}`}><header className="flex items-center justify-between gap-4 px-6 py-5"><h2 id="care-job-modal-title" className="text-lg font-bold">{title}</h2><button type="button" aria-label="Close job dialog" className="rounded p-1 text-[#61706c] hover:bg-gray-100" onClick={onClose}><X size={18} /></button></header>{action === "edit" ? <EditCareJobForm job={job} onClose={onClose} onSave={onSave} /> : <><div className="px-6 pb-6">{action === "approve" ? <><p className="mb-4 text-sm text-[#61706c]">Approve this job listing?</p><div className="space-y-1.5 rounded-lg bg-[#f4f6f5] px-4 py-3.5 text-sm"><p><span className="text-[#61706c]">Title:</span> {job.title}</p><p><span className="text-[#61706c]">Location:</span> {job.location}</p></div></> : <p className="text-sm leading-6 text-[#61706c]">The listing will be taken down and applicants notified. The poster can resubmit it later.</p>}</div><footer className="flex justify-end gap-2 border-t border-[#dfe4e1] bg-[#f4f6f5] px-6 py-4"><button type="button" autoFocus className="rounded-lg border border-[#dfe4e1] bg-white px-4 py-2.5 text-sm" onClick={onClose}>Cancel</button><button type="button" className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${action === "approve" ? "bg-[#ff2f68]" : "bg-[#b91e13]"}`} onClick={onConfirm}>{action === "approve" ? "Approve" : "Remove"}</button></footer></>}</dialog>;
}
