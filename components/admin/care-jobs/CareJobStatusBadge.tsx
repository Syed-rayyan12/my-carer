import type { CareJobStatus } from "./careJobsData";

export default function CareJobStatusBadge({ status }: { status: CareJobStatus }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] leading-4 ${status === "Pending" ? "bg-[#fff1d9] text-[#a96500]" : status === "Active" ? "bg-[#e3f5eb] text-[#087749]" : "bg-[#fde9e8] text-[#c6251a]"}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}
