"use client";

import {useLiveWorkspace} from '@/components/platform/LiveWorkspace';
import { useState } from "react";
import { BadgeCheck, Clock3 } from "lucide-react";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";
import { isCaregiverVerified } from "./verificationData";
import VerificationDocumentsTable from "./VerificationDocumentsTable";
import VerificationItems from "./VerificationItems";
import VerificationDocumentModal from "./VerificationDocumentModal";
import CaregiverVerificationSkeleton from "./CaregiverVerificationSkeleton";

type VerificationDialog = { type: "view"; id: string } | null;
export default function CaregiverVerificationPage() {
  const {snapshot}=useLiveWorkspace();
  const { documents, ready, storageError, mutate, busy } = useCaregiverDashboard(); const [dialog, setDialog] = useState<VerificationDialog>(null);
  const [kind,setKind]=useState("DBS");const [reference,setReference]=useState("");
  if (!ready) return <CaregiverVerificationSkeleton />;
  const verified = isCaregiverVerified(documents); const selected = dialog?.type === "view" ? documents.find(document => document.id === dialog.id) : undefined;
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 font-nunito text-[#101828] max-[1250px]:px-6 max-[640px]:px-4"><header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#d9d9d9] bg-white px-5 py-[18px]"><div><h1 className="mb-1 font-commissioner text-[42px] font-bold leading-[1.3] tracking-tight text-black max-[640px]:text-[30px]">Profile Verification</h1><p className="text-base text-[#363636]">Verification helps build trust with care seekers.</p></div></header><section className={`mb-6 flex items-center gap-5 rounded-xl border px-6 py-6 ${verified ? "border-[#d1fadf] bg-[#f4dfe5]" : "border-[#fedf89] bg-[#fffaeb]"}`}><span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-[#ff2f68]">{verified ? <BadgeCheck size={28} /> : <Clock3 size={28} />}</span><div><h2 className="mb-1 font-jakarta text-xl font-bold text-[#ff2f68]">{verified ? "Verified" : "Verification Pending"}</h2><p className="text-sm leading-6 text-[#475467]">{verified ? "Your profile has been successfully verified. A Verified badge now shows on your public profile." : "Your required documents are awaiting approval. Review your verification items for the latest status."}</p></div></section>{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable or full. Document details may not persist after this visit.</p>}<form className="mb-6 grid grid-cols-[1fr_2fr_auto] items-end gap-4 rounded-xl border border-[#d9d9d9] bg-white p-5 max-[750px]:grid-cols-1" onSubmit={async event=>{event.preventDefault();if(await mutate("platform/verifications",{kind,reference},"POST"))setReference("");}}><label className="text-sm">Document type<select value={kind} onChange={e=>setKind(e.target.value)} className="mt-2 h-11 w-full rounded-lg border px-3"><option value="DBS">DBS Certificate</option>{snapshot.access?.entitlements.qualifications===true&&<option value="QUALIFICATION">Qualification</option>}<option value="IDENTITY">Identity</option><option value="RIGHT_TO_WORK">Right to Work</option></select></label><label className="text-sm">Certificate / verification reference<input required maxLength={300} value={reference} onChange={e=>setReference(e.target.value)} className="mt-2 h-11 w-full rounded-lg border px-3"/></label><button disabled={busy} className="h-11 rounded-lg bg-[#ff2f68] px-4 text-sm text-white disabled:opacity-50">Submit for Review</button></form><div className="grid grid-cols-[minmax(0,2.1fr)_minmax(290px,1fr)] items-stretch gap-6 max-[1100px]:grid-cols-1"><VerificationDocumentsTable documents={documents} onView={document => setDialog({ type: "view", id: document.id })} /><VerificationItems documents={documents} /></div><p className="mt-3 text-[10px] text-[#98a2b3]">Verification decisions are made by an administrator. File upload is not enabled.</p>{selected && <VerificationDocumentModal key={selected.id} document={selected} onClose={() => setDialog(null)} />}</main>;
}
