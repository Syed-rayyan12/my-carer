"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Ban, Pencil, Trash2 } from "lucide-react";
import { useAdminDashboard } from "../AdminDashboardContext";
import { getAdminCaregivers } from "../caregivers/adminCaregiverData";
import AdminCaregiverBadge from "../caregivers/AdminCaregiverBadge";
import { getAdminCareSeekers, formatCareSeekerDate } from "./adminCareSeekerData";
import CareSeekerRequirementCard from "./CareSeekerRequirementCard";
import ConnectedCaregiversCard from "./ConnectedCaregiversCard";
import CareSeekerPersonalInfo from "./CareSeekerPersonalInfo";
import CareSeekerAccountModal from "./CareSeekerAccountModal";
import AdminCareSeekerDetailSkeleton from "./AdminCareSeekerDetailSkeleton";

export default function AdminCareSeekerDetailPage({ seekerId }: { seekerId: string }) {
  const { data, ready, storageError, notice, updateCareSeeker, setCareSeekerSuspended, deleteCareSeeker } = useAdminDashboard();
  const router = useRouter();
  const [action, setAction] = useState<"edit" | "suspend" | "delete" | null>(null);
  const seeker = getAdminCareSeekers(data).find(person => person.id === seekerId);

  if (!ready) return <AdminCareSeekerDetailSkeleton />;
  if (!seeker) return <main className="mx-auto max-w-[1530px] px-8 pt-2 max-[640px]:px-4"><section className="rounded-xl border border-[#d9d9d9] bg-white p-6"><Link href="/admin-dashboard/care-seekers" className="mb-5 inline-flex items-center gap-2 font-nunito text-sm text-[#ff2f68]"><ArrowLeft size={16} />Care Seekers</Link><h1 className="font-jakarta text-xl font-semibold">Care seeker not found</h1><p className="mt-2 font-nunito text-sm text-[#667085]">This account is not available in this browser. Return to Care Seekers to choose another account.</p></section></main>;

  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4"><section className="min-h-[calc(100dvh-112px)] rounded-[11px] border border-[#d9d9d9] bg-white px-3.5 pt-4 pb-4"><Link href="/admin-dashboard/care-seekers" className="inline-flex items-center gap-2 font-nunito text-sm text-[#ff2f68] hover:underline"><ArrowLeft size={16} />Care Seekers</Link><div className="mt-8 mb-6 flex flex-wrap items-center justify-between gap-5"><div className="flex items-center gap-4"><span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[#ff2f68] font-nunito text-lg font-bold text-white">{seeker.initials}</span><div><h1 className="mb-2 font-commissioner text-[24px] font-bold text-[#202925]">{seeker.name}</h1><div className="flex flex-wrap items-center gap-2"><AdminCaregiverBadge value={seeker.status} /><p className="font-nunito text-sm text-[#64716b]">{seeker.location} · Joined {formatCareSeekerDate(seeker.joinedAt)}</p></div></div></div><div className="flex flex-wrap items-center gap-2"><button type="button" className="inline-flex min-h-10 items-center gap-2 px-3 py-2 font-nunito text-sm text-[#c6251a] hover:underline" onClick={() => setAction("delete")}><Trash2 size={17} />Delete</button><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#e3e5e7] px-4 py-2 font-nunito text-sm text-[#202925] hover:bg-gray-50" onClick={() => setAction("edit")}><Pencil size={17} />Edit</button><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#e3e5e7] px-4 py-2 font-nunito text-sm text-[#202925] hover:bg-gray-50" onClick={() => setAction("suspend")}><Ban size={17} />{seeker.status === "Suspended" ? "Reactivate" : "Suspend"}</button></div></div><p className="sr-only" role="status">{notice}</p>{storageError && <p role="status" className="mb-4 font-nunito text-sm text-amber-700">Browser storage is unavailable. Changes will only last for this visit.</p>}<div className="grid grid-cols-[minmax(0,2.05fr)_minmax(290px,1fr)] items-start gap-6 max-[1100px]:grid-cols-1"><div className="space-y-6"><CareSeekerRequirementCard seeker={seeker} /><ConnectedCaregiversCard seeker={seeker} caregivers={getAdminCaregivers(data)} /></div><CareSeekerPersonalInfo seeker={seeker} /></div></section><CareSeekerAccountModal seeker={seeker} action={action} onClose={() => setAction(null)} onSave={updated => { updateCareSeeker(updated); setAction(null); }} onSuspend={() => { setCareSeekerSuspended(seeker.id, seeker.status !== "Suspended"); setAction(null); }} onDelete={() => { deleteCareSeeker(seeker.id); setAction(null); router.push("/admin-dashboard/care-seekers"); }} /></main>;
}
