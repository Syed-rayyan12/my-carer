"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import ProfileLogoutDropdown from "@/components/dashboard/ProfileLogoutDropdown";
import { useAdminDashboard } from "./AdminDashboardContext";

export default function AdminHeader() {
  const { search, setSearch, setMobileMenu, data, notificationsRead, setNotificationsRead } = useAdminDashboard();
  const [dropdown, setDropdown] = useState<"notifications" | "profile" | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function outside(event: PointerEvent) { if (!headerRef.current?.contains(event.target as Node)) setDropdown(null); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setDropdown(null); }
    document.addEventListener("pointerdown", outside); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, []);

  return <header ref={headerRef} className="flex h-[88px] items-center justify-between gap-4 bg-[#f3f4f6] px-8 max-[1250px]:px-6 max-[640px]:h-[74px] max-[640px]:px-4"><div className="flex min-w-0 flex-1 items-center gap-3"><button type="button" aria-label="Open admin navigation" className="hidden max-[640px]:flex" onClick={() => setMobileMenu(true)}><Menu size={22} /></button><label className="flex h-12 w-full min-w-0 items-center gap-3 rounded-[15px] border border-[#e5e5e5] bg-white px-7 text-[#a3a3a3] max-[640px]:px-3"><Search size={18} className="shrink-0" /><input type="search" placeholder="Search ........" aria-label="Search admin registrations" value={search} onChange={event => setSearch(event.target.value)} className="h-full w-full min-w-0 bg-transparent font-nunito text-base text-black outline-none placeholder:text-[#a3a3a3]" /></label></div><div className="flex items-center gap-4"><div className="relative"><button type="button" aria-label={notificationsRead ? "Admin notifications, all read" : "Admin notifications, 15 unread"} aria-expanded={dropdown === "notifications"} className="relative flex size-12 items-center justify-center rounded-full border border-[#e5e5e5] bg-white text-[#6c6c6c]" onClick={() => setDropdown(dropdown === "notifications" ? null : "notifications")}><Bell size={23} strokeWidth={1.7} />{!notificationsRead && <span className="absolute -top-2 right-0 flex size-5 items-center justify-center rounded-full bg-[#ff2f68] font-nunito text-[10px] text-white">15</span>}</button>{dropdown === "notifications" && <div className="absolute top-full right-0 z-50 mt-3 w-[350px] max-w-[calc(100vw-32px)] rounded-xl border border-[#ececf0] bg-white p-4 shadow-xl"><div className="mb-3 flex justify-between gap-3"><h2 className="font-nunito text-base font-bold">Notifications</h2><button type="button" className="font-nunito text-xs text-[#ff2f68]" onClick={() => setNotificationsRead(true)}>Mark all as read</button></div>{data.activity.slice(0, 5).map(item => <div key={item.id} className="border-t border-[#ececf0] py-3"><p className="font-nunito text-sm text-[#344054]">{item.text}</p><p className="mt-1 font-nunito text-xs text-[#98a2b3]">{item.time}</p></div>)}</div>}</div><div className="h-10 w-px bg-[#dedede] max-[500px]:hidden" /><div className="relative"><button ref={profileRef} type="button" aria-expanded={dropdown === "profile"} aria-haspopup="dialog" className="flex items-center gap-1.5" onClick={() => setDropdown(dropdown === "profile" ? null : "profile")}><span className="flex size-12 items-center justify-center rounded-full bg-[#ff2f68] font-bebas text-[27px] text-white">AD</span><span className="font-nunito text-sm text-[#777] max-[500px]:hidden">Admin</span></button>{dropdown === "profile" && <ProfileLogoutDropdown onStaySignedIn={() => { setDropdown(null); profileRef.current?.focus(); }} onLogout={() => setDropdown(null)} />}</div></div></header>;
}
