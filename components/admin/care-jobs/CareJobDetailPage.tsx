"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Pencil, Trash2 } from "lucide-react";
import { useCareJobs } from "./CareJobsContext";
import CareJobStatusBadge from "./CareJobStatusBadge";
import CareJobContent from "./CareJobContent";
import CareJobModal, { type CareJobAction } from "./CareJobModal";
import CareJobSkeleton from "./CareJobSkeleton";

export default function CareJobDetailPage({ jobId }: { jobId: string }) {
  const { jobs, ready, storageError, notice, saveJob, decide } = useCareJobs();
  const [action, setAction] = useState<CareJobAction | null>(null);
  const job = jobs.find(item => item.id === jobId);
  if (!ready) return <CareJobSkeleton detail />;
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 font-nunito text-[#182522] max-[1250px]:px-6 max-[640px]:px-4"><section className="min-h-[calc(100dvh-112px)] rounded-[11px] border border-[#d9d9d9] bg-white px-3.5 pt-4 pb-6"><Link href="/admin-dashboard/care-jobs" className="inline-flex items-center gap-2 text-sm text-[#ff2f68] hover:underline"><ArrowLeft size={16} />Care Jobs</Link>{!job ? <h1 className="mt-8 text-xl font-bold">Job not found</h1> : <><div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-5"><div><h1 className="font-commissioner text-[24px] font-bold">{job.title}</h1><p className="mt-1 text-sm text-[#61706c]">Posted by {job.postedBy} · {job.date}</p></div><div className="flex flex-wrap items-center gap-2"><span className="mr-1"><CareJobStatusBadge status={job.status} /></span>{job.status !== "Removed" && <button type="button" className="inline-flex min-h-10 items-center gap-2 px-3 py-2 text-sm text-[#c6251a] hover:underline" onClick={() => setAction("remove")}><Trash2 size={17} />Remove</button>}<button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#e3e5e7] px-4 py-2 text-sm hover:bg-gray-50" onClick={() => setAction("edit")}><Pencil size={17} />Edit</button>{job.status === "Pending" && <button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#ff2f68] px-4 py-2 text-sm font-semibold text-white" onClick={() => setAction("approve")}><Check size={17} />Approve Job</button>}</div></div>{notice && <p role="status" className="mb-4 text-sm text-[#61706c]">{notice}</p>}{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Changes will only last for this visit.</p>}<CareJobContent job={job} />{action && <CareJobModal key={`${job.id}-${action}`} job={job} action={action} onClose={() => setAction(null)} onSave={updated => { saveJob(updated); setAction(null); }} onConfirm={() => { decide(job.id, action === "approve" ? "Active" : "Removed"); setAction(null); }} />}</>}</section></main>;
}
