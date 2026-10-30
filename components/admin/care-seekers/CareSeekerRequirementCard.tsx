import type { AdminCareSeeker } from "./adminCareSeekerData";

export default function CareSeekerRequirementCard({ seeker }: { seeker: AdminCareSeeker }) {
  return <section className="rounded-xl border border-[#e3e5e7] bg-white p-5"><h2 className="mb-4 font-nunito text-sm font-bold text-[#202925]">Care requirement</h2><p className="font-nunito text-sm leading-[1.6] text-[#202925]">{seeker.requirement.description || "No care requirement description added."}</p><dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-[#e3e5e7] pt-4 max-[550px]:grid-cols-1">{[{ label: "Care type", value: seeker.requirement.careType }, { label: "Preferred schedule", value: seeker.requirement.schedule }, { label: "Budget", value: seeker.requirement.budget }].map(item => <div key={item.label}><dt className="mb-1 font-nunito text-xs text-[#64716b]">{item.label}</dt><dd className="font-nunito text-sm text-[#202925]">{item.value || "Not provided"}</dd></div>)}</dl></section>;
}
