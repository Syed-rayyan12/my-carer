"use client";

import { useState } from "react";
import { useAdminDashboard } from "../AdminDashboardContext";
import { usePersistentDashboardState } from "@/components/dashboard/usePersistentDashboardState";
import { initialVerificationRecords, isVerificationRecords, type DocumentStatus } from "./verificationData";
import VerificationTable from "./VerificationTable";
import VerificationModal from "./VerificationModal";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function VerificationPage() {
  const { search } = useAdminDashboard();
  const { value: records, setValue: setRecords, ready, storageError } = usePersistentDashboardState("my-carer-admin-verifications", initialVerificationRecords, isVerificationRecords);
  const [tab, setTab] = useState<DocumentStatus>("Pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const selected = records.find(record => record.id === selectedId);
  const query = search.trim().toLowerCase();
  const filtered = records.filter(record => record.status === tab && `${record.name} ${record.location} ${record.document}`.toLowerCase().includes(query));
  function decide(status: DocumentStatus, reason?: string) {
    if (!ready || !selected || selected.status !== "Pending" || (status === "Rejected" && !reason?.trim())) return;
    setRecords(current => current.map(record => record.id === selected.id ? { ...record, status, reason: status === "Rejected" ? reason?.trim() : undefined } : record));
    setNotice(`${selected.name}'s document ${status.toLowerCase()} in this local preview. No email has been sent.`);
    setSelectedId(null);
  }
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 font-nunito text-[#182522] max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-[#ff2f68] max-[640px]:text-[32px]">Verification</h1><p className="text-base text-[#363636]">Check caregiver documents before profiles go live.</p></section>{notice && <p role="status" className="mb-4 rounded-lg border border-pink-100 bg-white px-4 py-3 text-sm">{notice}</p>}{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Decisions will only last for this visit.</p>}{!ready ? <AdminCaregiversTableSkeleton label="Loading verification documents" /> : <section className="min-h-[550px] overflow-hidden rounded-[11px] border border-[#d9d9d9] bg-white"><div aria-hidden="true" className="grid min-w-[700px] grid-cols-[34%_16%_21%_22%_7%] px-4 pt-5 pb-6 text-sm text-black max-[900px]:hidden"><span>Caregiver</span><span>Location</span><span>Verification</span><span>Status</span><span>Action</span></div><div className="flex gap-5 px-5 pt-2 pb-3" aria-label="Document status">{(["Pending", "Approved", "Rejected"] as const).map(status => <button key={status} type="button" aria-pressed={tab === status} onClick={() => setTab(status)} className={`flex items-center gap-2 rounded py-1 text-sm ${tab === status ? "text-[#ff2f68]" : "text-[#61706c]"}`}>{status}<span className={`flex min-w-5 items-center justify-center rounded-full px-1 text-[11px] leading-5 ${tab === status ? "bg-[#ff2f68] text-white" : "bg-[#f4f6f5] text-[#61706c]"}`}>{records.filter(record => record.status === status).length}</span></button>)}</div><VerificationTable records={filtered} onReview={record => setSelectedId(record.id)} /></section>}{selected && <VerificationModal key={selected.id} record={selected} onClose={() => setSelectedId(null)} onDecision={decide} />}</main>;
}
