import { initialSubscriptions, formatSubscriptionAmount, type AdminSubscription } from "./subscriptionsData";

export default function SubscriptionStats({ records }: { records: AdminSubscription[] }) {
  const newRefunds = records.reduce((total, record) => total + (record.payment === "Refunded" && initialSubscriptions.find(item => item.id === record.id)?.payment === "Paid" ? record.amountPence : 0), 0);
  const revenue = 14892000 - newRefunds;
  const stats = [{ label: "Total Revenue", value: newRefunds ? formatSubscriptionAmount(revenue) : "£148,920", caption: `+${newRefunds ? formatSubscriptionAmount(1245000 - newRefunds) : "£12,450"} this month`, pink: true }, { label: "Active Subscriptions", value: "1,842", caption: "Across all plans" }, { label: "Cancelled Plans", value: "64", caption: "This month" }, { label: "Pending Payments", value: "23", caption: "£1,380 outstanding" }];
  return <section aria-label="Subscription statistics" className="mb-6 grid grid-cols-[1.4fr_1fr_1fr_1fr] overflow-hidden rounded-xl border border-[#d9d9d9] bg-white max-[1100px]:grid-cols-2 max-[480px]:grid-cols-1">{stats.map(stat => <div key={stat.label} className="min-h-[123px] border-r border-[#e3e5e7] px-5 py-5 last:border-r-0 max-[1100px]:border-b"><h2 className="mb-3 text-sm text-[#61706c]">{stat.label}</h2><p className={`font-commissioner font-bold leading-tight text-black ${stat.pink ? "text-[30px]" : "text-[24px]"}`}>{stat.value}</p><p className={`mt-1 text-xs ${stat.pink ? "text-[#ff2f68]" : "text-[#61706c]"}`}>{stat.caption}</p></div>)}</section>;
}
