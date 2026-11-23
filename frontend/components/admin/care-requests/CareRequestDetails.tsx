import Link from "next/link";
import { MapPin } from "lucide-react";
import type { AdminCareRequest } from "./careRequestsData";
import { useAdminDashboard } from "../AdminDashboardContext";
import { getAdminCaregivers } from "../caregivers/adminCaregiverData";
import AdminStars from "../shared/AdminStars";

export default function CareRequestDetails({ request }: { request: AdminCareRequest }) {
  const { data } = useAdminDashboard();
  const caregivers = getAdminCaregivers(data);
  const matches = request.matches.filter(match => caregivers.some(caregiver => caregiver.id === match.id));
  return <div className="grid grid-cols-[minmax(0,2.05fr)_minmax(290px,1fr)] items-start gap-6 max-[1100px]:grid-cols-1"><section className="rounded-xl border border-[#e3e5e7] p-5"><h2 className="mb-4 text-sm font-bold">Requirement</h2><p className="mb-5 whitespace-pre-line text-sm leading-6">{request.description}</p><dl className="grid grid-cols-2 gap-5 border-t border-[#e3e5e7] pt-4 max-[450px]:grid-cols-1">{[{ label: "Preferred care type", value: request.careType }, { label: "Availability", value: request.availability }, { label: "Budget", value: request.budget }, { label: "Location", value: request.location }].map(item => <div key={item.label}><dt className="mb-1 text-xs text-[#61706c]">{item.label}</dt><dd className="text-sm">{item.value}</dd></div>)}</dl></section><section className="rounded-xl border border-[#e3e5e7] px-5 pt-4 pb-1"><h2 className="text-sm font-bold">Matched caregivers</h2><p className="mt-1 text-xs text-[#61706c]">Suggested by location and care type</p>{matches.map(match => <div key={match.id} className="flex items-center gap-3 border-b border-[#e3e5e7] py-4 last:border-b-0"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#ff2f68] text-[11px] text-white">{match.initials}</span><div className="min-w-0 flex-1"><Link href={`/admin-dashboard/caregivers/${match.id}`} className="text-sm hover:text-[#ff2f68]">{caregivers.find(caregiver => caregiver.id === match.id)?.name ?? match.name}</Link><p className="flex items-center gap-1 text-xs text-[#61706c]"><MapPin size={12} className="text-[#ff2f68]" />{match.distance}</p></div><AdminStars rating={match.rating} amber /></div>)}{!matches.length && <p className="py-5 text-sm text-[#61706c]">No caregiver matches available.</p>}</section></div>;
}
