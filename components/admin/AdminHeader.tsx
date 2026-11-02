"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import DashboardNotificationMenu from "@/components/dashboard/DashboardNotificationMenu";
import ProfileLogoutDropdown from "@/components/dashboard/ProfileLogoutDropdown";
import { useAdminDashboard } from "./AdminDashboardContext";

export default function AdminHeader() {
  const { search, setSearch, setMobileMenu, data, notificationsRead, setNotificationsRead } = useAdminDashboard();
  const [removedNotifications, setRemovedNotifications] = useState<string[]>([]);
  const notificationItems = data.activity.map((item, index) => ({ id: item.id, text: item.text, time: item.time, icon: Bell, unread: !notificationsRead && index < 3, tone: (["green", "pink", "blue", "amber", "red"] as const)[index % 5] })).filter(item => !removedNotifications.includes(item.id));
  const unreadCount = notificationItems.filter(item => item.unread).length;
  const [dropdown, setDropdown] = useState<"notifications" | "profile" | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function outside(event: PointerEvent) { if (!headerRef.current?.contains(event.target as Node)) setDropdown(null); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setDropdown(null); }
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  return <header ref={headerRef} className="flex h-[88px] items-center justify-between gap-4 bg-[#f3f4f6] px-8 max-[1250px]:px-6 max-[640px]:h-[74px] max-[640px]:px-4"><div className="flex min-w-0 flex-1 items-center gap-3"><button type="button" aria-label="Open admin navigation" className="hidden max-[640px]:flex" onClick={() => setMobileMenu(true)}><Menu size={22} /></button><label className="flex h-12 w-full min-w-0 items-center gap-3 rounded-[15px] border border-[#e5e5e5] bg-white px-7 text-[#a3a3a3] max-[640px]:px-3"><Search size={18} className="shrink-0" /><input type="search" placeholder="Search ........" aria-label="Search admin registrations" value={search} onChange={event => setSearch(event.target.value)} className="h-full w-full min-w-0 bg-transparent font-nunito text-base text-black outline-none placeholder:text-[#a3a3a3]" /></label></div><div className="flex items-center gap-4"><DashboardNotificationMenu open={dropdown === "notifications"} onToggle={() => setDropdown(dropdown === "notifications" ? null : "notifications")} unreadCount={unreadCount} items={notificationItems} onRemove={id => setRemovedNotifications(current => [...current, id])} markAllDisabled={!unreadCount} onMarkAllRead={() => setNotificationsRead(true)} /><div className="h-10 w-px bg-[#dedede] max-[500px]:hidden" /><div className="relative"><button ref={profileRef} type="button" aria-expanded={dropdown === "profile"} aria-haspopup="dialog" className="flex items-center gap-1.5" onClick={() => setDropdown(dropdown === "profile" ? null : "profile")}><span className="flex size-12 items-center justify-center rounded-full bg-[#ff2f68] font-bebas text-[27px] text-white">AD</span><span className="font-nunito text-sm font-medium text-black max-[500px]:hidden">Admin</span></button>{dropdown === "profile" && <ProfileLogoutDropdown onStaySignedIn={() => { setDropdown(null); profileRef.current?.focus(); }} onLogout={() => setDropdown(null)} />}</div></div></header>;
}
