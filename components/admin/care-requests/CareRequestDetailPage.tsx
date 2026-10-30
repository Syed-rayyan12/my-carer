"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Pencil, Trash2 } from "lucide-react";
import { useAdminContent } from "../AdminContentContext";
import AdminPage from "../shared/AdminPage";
import AdminBadge from "../shared/AdminBadge";
import CareRequestDetails from "./CareRequestDetails";
import CareRequestModal from "./CareRequestModal";
import AdminContentSkeleton from "../shared/AdminContentSkeleton";

export default function CareRequestDetailPage({ requestId }: { requestId: string }) {
  const { data, ready, notice, updateRequest } = useAdminContent();
  const [action, setAction] = useState<"edit" | "approve" | "remove" | null>(null);
  const request = data.requests.find(item => item.id === requestId);
  if (!ready) return <AdminContentSkeleton detail label="Loading care request" />;
  return <AdminPage><section className="min-h-[calc(100dvh-112px)] rounded-xl border border-[#d9d9d9] bg-white px-3.5 pt-4 pb-6"><Link href="/admin-dashboard/care-requests" className="inline-flex items-center gap-2 text-sm text-[#ff2f68]"><ArrowLeft size={16} />Care Requests</Link>{!request ? <h1 className="mt-8 text-xl font-bold">Care request not found</h1> : <><div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-5"><div><h1 className="font-commissioner text-[24px] font-bold">{request.careType} for {request.name}</h1><p className="mt-1 text-sm text-[#61706c]">{request.location} · Posted {request.date}</p></div><div className="flex flex-wrap items-center gap-2"><span className="mr-1"><AdminBadge status={request.status} /></span>{request.status !== "Removed" && <button type="button" className="inline-flex min-h-10 items-center gap-2 px-3 text-sm text-[#c6251a]" onClick={() => setAction("remove")}><Trash2 size={17} />Remove</button>}<button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#e3e5e7] px-4 text-sm" onClick={() => setAction("edit")}><Pencil size={17} />Edit</button>{request.status === "Pending" && <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#ff2f68] px-4 text-sm font-semibold text-white" onClick={() => setAction("approve")}><Check size={17} />Approve Request</button>}</div></div>{notice && <p role="status" className="mb-4 text-sm text-[#61706c]">{notice}</p>}<CareRequestDetails request={request} />{action && <CareRequestModal key={action} request={request} action={action} onClose={() => setAction(null)} onSave={updated => { updateRequest(updated); setAction(null); }} />}</>}</section></AdminPage>;
}
