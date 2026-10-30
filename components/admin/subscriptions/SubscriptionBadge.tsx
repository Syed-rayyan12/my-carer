export default function SubscriptionBadge({ value }: { value: string }) {
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] leading-4 ${["Active", "Paid"].includes(value) ? "bg-[#e3f5eb] text-[#087749]" : value === "Pending" ? "bg-[#fff1d9] text-[#a96500]" : ["Cancelled", "Failed"].includes(value) ? "bg-[#fde9e8] text-[#c6251a]" : "bg-[#f4f6f5] text-[#61706c]"}`}><span className="size-1.5 rounded-full bg-current" />{value}</span>;
}
