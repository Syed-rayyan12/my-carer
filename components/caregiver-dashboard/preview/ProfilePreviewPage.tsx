"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarClock, Eye, Pencil } from "lucide-react";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";
import CaregiverPublicProfile from "./CaregiverPublicProfile";
import ManageAvailabilityModal from "./ManageAvailabilityModal";
import ContactCaregiverModal from "./ContactCaregiverModal";
import CareSeekerPreviewModal from "./CareSeekerPreviewModal";
import SavedModal from "../shared/SavedModal";
import ProfilePreviewSkeleton from "./ProfilePreviewSkeleton";

type PreviewDialog = "preview" | "availability" | "contact" | "contact-from-preview" | "saved" | null;
export default function ProfilePreviewPage() {
  const { ready, storageError } = useCaregiverDashboard(); const [dialog, setDialog] = useState<PreviewDialog>(null);
  if (!ready) return <ProfilePreviewSkeleton />;
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-6 font-nunito text-[#101828] max-[1250px]:px-6 max-[640px]:px-4"><header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#d9d9d9] bg-white px-5 py-[18px]"><div><h1 className="mb-1 font-commissioner text-[42px] font-bold leading-[1.3] tracking-tight text-black max-[640px]:text-[30px]">Profile Preview</h1><p className="text-base text-[#363636]">Profile Preview</p></div><div className="flex flex-wrap gap-2"><Link href="/caregiver-dashboard/my-profile" className="inline-flex items-center gap-2 rounded-lg border border-[#d0d5dd] px-3 py-2.5 text-xs font-semibold"><Pencil size={15} />Edit Profile</Link><button type="button" onClick={() => setDialog("availability")} className="inline-flex items-center gap-2 rounded-lg border border-[#d0d5dd] px-3 py-2.5 text-xs font-semibold"><CalendarClock size={15} />Manage Availability</button><button type="button" onClick={() => setDialog("preview")} className="inline-flex items-center gap-2 rounded-lg bg-[#ff2f68] px-3 py-2.5 text-xs font-semibold text-white"><Eye size={15} />Preview as Care Seeker</button></div></header>{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable or full. Changes may only last for this visit.</p>}<section className="rounded-xl border border-[#d9d9d9] bg-white px-10 py-8 max-[850px]:p-5"><CaregiverPublicProfile onContact={() => setDialog("contact")} /></section>{dialog === "preview" && <CareSeekerPreviewModal onClose={() => setDialog(null)} onContact={() => setDialog("contact-from-preview")} />}{dialog === "availability" && <ManageAvailabilityModal onClose={() => setDialog(null)} onSaved={() => setDialog("saved")} />}{(dialog === "contact" || dialog === "contact-from-preview") && <ContactCaregiverModal onClose={() => setDialog(dialog === "contact-from-preview" ? "preview" : null)} />}{dialog === "saved" && <SavedModal message="Your availability has been updated on this device." onClose={() => setDialog(null)} />}</main>;
}
