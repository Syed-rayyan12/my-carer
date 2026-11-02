"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCaregiverDashboard } from "./CaregiverDashboardContext";
import { recommendedJobs, type RecommendedJob } from "./caregiverDashboardData";
import CaregiverStats from "./CaregiverStats";
import RecommendedJobCard from "./RecommendedJobCard";
import ProfileCompletionBanner from "./overview/ProfileCompletionBanner";
import RecentApplications from "./overview/RecentApplications";
import OverviewSideCards from "./overview/OverviewSideCards";
import JobDetailsModal from "./overview/JobDetailsModal";
import ApplyJobModal from "./overview/ApplyJobModal";
import SavedModal from "./shared/SavedModal";
import CaregiverOverviewSkeleton from "./overview/CaregiverOverviewSkeleton";

export default function CaregiverOverview() {
  const { search, ready, storageError, profile } = useCaregiverDashboard();
  const [dialog, setDialog] = useState<{ type: "view" | "apply"; job: RecommendedJob } | { type: "saved" } | null>(null);
  if (!ready) return <CaregiverOverviewSkeleton />;
  const jobs = recommendedJobs.filter(job => `${job.title} ${job.name} ${job.location} ${job.tags.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 font-nunito text-[#101828] max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 rounded-xl border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] font-bold leading-[1.3] tracking-tight text-black max-[640px]:text-[30px]">Welcome back, <span className="text-[#ff2f68]">{profile.personal.firstName || "Sarah"}!</span></h1><p className="text-base text-[#363636]">Manage your care profile, find new opportunities and stay connected with care seekers.</p></section><ProfileCompletionBanner /><CaregiverStats />{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable or full. Changes may not persist after this visit.</p>}<div className="grid grid-cols-[minmax(0,2.05fr)_minmax(310px,1fr)] items-start gap-6 max-[1200px]:grid-cols-1"><div className="space-y-6"><section className="overflow-hidden rounded-xl border border-[#eaecf0] bg-white"><header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eaecf0] px-6 py-4"><div><h2 className="font-jakarta text-base font-bold">Recommended Care Jobs</h2><p className="mt-1 text-sm text-[#667085]">Matched to your services and availability</p></div><Link href="/caregiver-dashboard/find-care-jobs" className="inline-flex items-center gap-1 text-sm text-[#ff2f68]">Browse All<ArrowRight size={15} /></Link></header><div className="grid grid-cols-2 gap-4 p-6 max-[800px]:grid-cols-1">{jobs.map(job => <RecommendedJobCard key={job.id} job={job} onView={() => setDialog({ type: "view", job })} onApply={() => setDialog({ type: "apply", job })} />)}{!jobs.length && <p className="col-span-full py-8 text-center text-sm text-[#667085]">No recommended jobs match your search.</p>}</div></section><RecentApplications /></div><OverviewSideCards /></div><p className="mt-4 text-[10px] text-[#98a2b3]">Sample dashboard data. New applications are saved locally.</p>{dialog?.type === "view" && <JobDetailsModal job={dialog.job} onClose={() => setDialog(null)} onApply={() => setDialog({ type: "apply", job: dialog.job })} />}{dialog?.type === "apply" && <ApplyJobModal job={dialog.job} onClose={() => setDialog(null)} onSaved={() => setDialog({ type: "saved" })} />}{dialog?.type === "saved" && <SavedModal title="Application Saved" message="Your application has been saved on this device. It has not been sent to the care seeker." onClose={() => setDialog(null)} />}</main>;
}
