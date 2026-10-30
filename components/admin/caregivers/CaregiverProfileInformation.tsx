import type { AdminCaregiver, AdminCaregiverProfile } from "./adminCaregiverData";

export default function CaregiverProfileInformation({ caregiver, profile }: { caregiver: AdminCaregiver; profile: AdminCaregiverProfile }) {
  const details = [{ label: "Name", value: caregiver.name }, { label: "Email", value: caregiver.email }, { label: "Phone", value: profile.phone }, { label: "Location", value: caregiver.location }];
  return <section className="rounded-xl border border-[#e3e5e7] bg-white p-5"><h2 className="mb-4 font-nunito text-sm font-bold text-[#202925]">Profile information</h2><dl className="grid grid-cols-2 gap-x-8 gap-y-4 max-[550px]:grid-cols-1">{details.map(item => <div key={item.label}><dt className="mb-1 font-nunito text-xs text-[#64716b]">{item.label}</dt><dd className="break-words font-nunito text-sm text-[#202925]">{item.value || "Not provided"}</dd></div>)}</dl></section>;
}
