import type { AdminUserStatus } from "../adminData";
import type { VerificationStatus } from "./adminCaregiverData";

export default function AdminCaregiverBadge({ value }: { value: AdminUserStatus | VerificationStatus }) {
  const tone = value === "Active" || value === "Verified" ? "green" : value === "Rejected" || value === "Suspended" ? "red" : "amber";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-nunito text-[11px] leading-4 ${tone === "green" ? "bg-[#e3f5eb] text-[#087749]" : tone === "red" ? "bg-[#fde9e8] text-[#c6251a]" : "bg-[#fff1d9] text-[#a96500]"}`}><span className={`size-1.5 rounded-full ${tone === "green" ? "bg-[#087749]" : tone === "red" ? "bg-[#c6251a]" : "bg-[#a96500]"}`} />{value}</span>;
}
