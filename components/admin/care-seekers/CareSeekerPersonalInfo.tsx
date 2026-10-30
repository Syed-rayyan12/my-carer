import type { AdminCareSeeker } from "./adminCareSeekerData";

export default function CareSeekerPersonalInfo({ seeker }: { seeker: AdminCareSeeker }) {
  return <aside className="rounded-xl border border-[#e3e5e7] bg-white p-5" aria-labelledby="care-seeker-personal-info"><h2 id="care-seeker-personal-info" className="mb-4 font-nunito text-sm font-bold text-[#202925]">Personal info</h2><dl className="space-y-4">{[{ label: "Name", value: seeker.name }, { label: "Email", value: seeker.email }, { label: "Phone", value: seeker.phone }, { label: "Location", value: seeker.location }].map(item => <div key={item.label}><dt className="mb-1 font-nunito text-xs text-[#64716b]">{item.label}</dt><dd className="break-words font-nunito text-sm text-[#202925]">{item.value || "Not provided"}</dd></div>)}</dl></aside>;
}
