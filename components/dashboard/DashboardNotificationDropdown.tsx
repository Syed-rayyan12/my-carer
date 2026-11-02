import { useState } from "react";
import Link from "next/link";
import { X, type LucideIcon } from "lucide-react";

export type DashboardNotificationItem = { id: string; text: string; time: string; icon: LucideIcon; href?: string; unread?: boolean; tone?: "green" | "pink" | "blue" | "amber" | "red" };
export type DashboardNotificationDropdownProps = { items: DashboardNotificationItem[]; onMarkAllRead: () => void; onRemove: (id: string) => void; onItemClick?: (id: string) => void; markAllDisabled?: boolean; loading?: boolean };
const colors = { green: "bg-[#ecfdf3] text-[#027a48]", pink: "bg-[#fff0f5] text-[#ff2f68]", blue: "bg-[#eff8ff] text-[#175cd3]", amber: "bg-[#fffaeb] text-[#b54708]", red: "bg-[#fef3f2] text-[#f04438]" };

export default function DashboardNotificationDropdown({ items, onMarkAllRead, onRemove, onItemClick, markAllDisabled = false, loading = false }: DashboardNotificationDropdownProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, 5);
  return <div className="absolute top-full right-0 z-50 mt-2 w-[360px] overflow-hidden rounded-xl bg-white font-nunito font-normal text-black shadow-[0_8px_30px_#10182830] max-[640px]:fixed max-[640px]:top-[70px] max-[640px]:right-3 max-[640px]:mt-0 max-[640px]:w-[calc(100vw-24px)] max-[640px]:max-w-[360px]">
    <header className="flex items-center justify-between gap-3 border-b border-[#eaecf0] px-4 py-4"><h2 className="text-base font-bold">Notifications</h2><button type="button" disabled={markAllDisabled} onClick={onMarkAllRead} className="rounded-md bg-[#ff2f68] px-3 py-1.5 text-[10px] font-normal text-white disabled:opacity-50">Mark all as read</button></header>
    <div className="max-h-[min(420px,65dvh)] overflow-y-auto">{loading ? <p role="status" className="px-4 py-6 text-xs text-[#667085]">Loading notifications…</p> : visible.length ? visible.map(({ id, text, time, icon: Icon, href, unread, tone = "pink" }) => {
      const content = <><span className={`flex size-9 shrink-0 items-center justify-center rounded-full ${colors[tone]}`}><Icon size={18} strokeWidth={2} /></span><div className="min-w-0 flex-1"><p className={`text-[14px] leading-5 capitalize ${unread ? "font-semibold" : "font-normal"}`}>{text}</p><p className="mt-0.5 text-[11px] text-[#667085]">{time}</p></div></>;
      return <div key={id} className={`flex min-h-[62px] items-center gap-2 border-b border-[#eaecf0] px-4 py-3 last:border-0 ${unread ? "bg-[#fdf7fc]" : "bg-white"}`}>{href ? <Link href={href} onClick={() => onItemClick?.(id)} className="flex min-w-0 flex-1 items-center gap-3">{content}</Link> : <div className="flex min-w-0 flex-1 items-center gap-3">{content}</div>}<button type="button" aria-label={`Remove notification: ${text}`} onClick={() => onRemove(id)} className="shrink-0 rounded p-1 text-[#98a2b3] hover:bg-white hover:text-[#f04438]"><X size={15} strokeWidth={2.5} /></button></div>;
    }) : <p className="px-4 py-6 text-xs text-[#667085]">No notifications yet.</p>}</div>
    <footer className="px-4 py-3"><button type="button" disabled={loading || !items.length} aria-expanded={expanded} onClick={() => setExpanded(value => !value)} className="rounded-md bg-[#ff2f68] px-3 py-1.5 text-[10px] text-white disabled:opacity-50">{expanded ? "Show Recent Notifications" : "View All Notifications"}</button></footer>
  </div>;
}
