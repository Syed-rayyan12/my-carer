"use client";

import { FileText } from "lucide-react";
import type { AdminCaregiver, AdminCaregiverProfile } from "./adminCaregiverData";
import AdminCaregiverBadge from "./AdminCaregiverBadge";

export default function CaregiverVerificationPanel({ caregiver, profile, onDocument }: { caregiver: AdminCaregiver; profile: AdminCaregiverProfile; onDocument: (document: string) => void }) {
  return <aside className="rounded-xl border border-[#e3e5e7] bg-white p-5" aria-labelledby="caregiver-verification-heading"><h2 id="caregiver-verification-heading" className="mb-4 font-nunito text-sm font-bold text-[#202925]">Verification status</h2><dl className="space-y-4"><div><dt className="mb-1 font-nunito text-xs text-[#64716b]">DBS status</dt><dd><AdminCaregiverBadge value={caregiver.verification} /></dd></div><div><dt className="mb-1 font-nunito text-xs text-[#64716b]">Verification date</dt><dd className="font-nunito text-sm text-[#202925]">{profile.verificationDate || (caregiver.verification === "Verified" ? "Not recorded" : "Not yet verified")}</dd></div></dl><h3 className="mt-5 mb-2 font-nunito text-xs text-[#64716b]">Documents</h3><div className="space-y-2">{["DBS Certificate", "Qualification Certificate", "ID Proof"].map(document => <button key={document} type="button" className="flex min-h-10 w-full items-center gap-2 rounded-lg border border-[#e3e5e7] px-3 py-2 text-left font-nunito text-sm text-[#202925] hover:border-[#ff9bb5] hover:bg-[#fffafd]" onClick={() => onDocument(document)}><FileText size={16} className="shrink-0 text-[#64716b]" />{document}</button>)}</div></aside>;
}
