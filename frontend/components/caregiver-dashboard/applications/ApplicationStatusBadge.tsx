import type { CaregiverApplication } from "../caregiverDashboardData";

export default function ApplicationStatusBadge({ status }: { status: CaregiverApplication["status"] }) { return <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs ${status === "Pending" ? "bg-[#fffaeb] text-[#b54708]" : status === "Shortlisted" ? "bg-[#eff8ff] text-[#175cd3]" : status === "Accepted" ? "bg-[#ecfdf3] text-[#027a48]" : status === "Rejected" ? "bg-[#fef3f2] text-[#f04438]" : "bg-[#f2f4f7] text-[#667085]"}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>; }
