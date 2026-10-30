"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { VerificationRecord, DocumentStatus } from "./verificationData";
import VerificationDetails from "./VerificationDetails";
import RejectDocumentForm from "./RejectDocumentForm";

export default function VerificationModal({ record, onClose, onDecision }: { record: VerificationRecord; onClose: () => void; onDecision: (status: DocumentStatus, reason?: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [rejecting, setRejecting] = useState(false);
  useEffect(() => { ref.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = previous; }; }, []);
  return <dialog ref={ref} aria-labelledby="verification-modal-title" onCancel={event => { event.preventDefault(); onClose(); }} className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[448px] overflow-y-auto rounded-[10px] border-0 bg-white p-0 font-nunito text-[#182522] shadow-2xl backdrop:bg-black/40"><header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4"><div><h2 id="verification-modal-title" className="text-lg font-bold">{rejecting ? "Reject document" : "Verification details"}</h2>{!rejecting && <p className="mt-0.5 text-sm text-[#61706c]">Submitted {record.submitted}</p>}</div><button type="button" aria-label="Close verification dialog" onClick={onClose} className="rounded p-1 text-[#61706c] hover:bg-gray-100"><X size={18} /></button></header>{rejecting ? <RejectDocumentForm record={record} onCancel={() => setRejecting(false)} onSubmit={reason => onDecision("Rejected", reason)} /> : <VerificationDetails record={record} onReject={() => setRejecting(true)} onApprove={() => onDecision("Approved")} onClose={onClose} />}</dialog>;
}
