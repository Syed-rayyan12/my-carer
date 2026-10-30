export default function AdminBadge({ status }: { status: string }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] leading-4 ${status === "Pending" ? "bg-[#fff1d9] text-[#a96500]" : ["Active", "Published"].includes(status) ? "bg-[#e3f5eb] text-[#087749]" : ["Removed", "Hidden"].includes(status) ? "bg-[#fde9e8] text-[#c6251a]" : "bg-[#f4f6f5] text-[#61706c]"}`}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}
