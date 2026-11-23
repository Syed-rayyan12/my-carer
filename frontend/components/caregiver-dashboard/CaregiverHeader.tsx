"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search } from "lucide-react";

import { useCaregiverDashboard } from "./CaregiverDashboardContext";
import CaregiverNotificationDropdown from "./notifications/CaregiverNotificationDropdown";
import ProfileLogoutDropdown from "@/components/dashboard/ProfileLogoutDropdown";

export default function CaregiverHeader() {
  const { search, setSearch, setMobileMenu, profile } = useCaregiverDashboard();
  const [dropdown, setDropdown] = useState<"notifications" | "profile" | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const profileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function close(event: PointerEvent) { if (!headerRef.current?.contains(event.target as Node)) setDropdown(null); }
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setDropdown(null); }
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  return (
    <header className="flex h-[88px] items-center justify-between gap-5 bg-[#f3f4f6] px-8 max-[1250px]:px-6 max-[640px]:h-[74px] max-[640px]:gap-3 max-[640px]:px-4" ref={headerRef}>
      <div className="flex min-w-0 flex-1 items-center gap-3.5 max-[640px]:gap-2.5">
        <button className="hidden max-[640px]:flex" aria-label="Open navigation" onClick={() => setMobileMenu(true)}><Menu size={23} /></button>
        <label className="flex min-h-[4px] w-full min-w-0 max-w-[860px] items-center gap-3 rounded-xl border border-[#e8e9ee] bg-white px-5 py-4 text-[#969ba5] focus-within:border-[#ff9bb5] focus-within:ring-2 focus-within:ring-[#ff2f68]/5 max-[850px]:gap-2 max-[850px]:px-3 max-[640px]:px-2.5">
          <Search size={18} className="shrink-0" />
          <input className="w-full  min-w-0 border-0 bg-transparent text-sm font-normal text-[#202630] outline-none placeholder:text-[#a0a4ae] max-[640px]:text-[11px]" type="search" aria-label="Search recommended care jobs" placeholder="Search jobs, messages, applications..." value={search} onChange={event => setSearch(event.target.value)} />
        </label>
      </div>
      <div className="flex items-center gap-6 max-w-[300px] max-[1050px]:gap-4 max-[440px]:gap-2">
        <CaregiverNotificationDropdown open={dropdown === "notifications"} onToggle={() => setDropdown(dropdown === "notifications" ? null : "notifications")} onClose={() => setDropdown(null)} />
        <div className="h-10 w-px bg-[#D8D8D8] max-[850px]:hidden" />
        <div className="relative">
          <button ref={profileTriggerRef} type="button" className="flex items-center gap-2.5" aria-expanded={dropdown === "profile"} aria-haspopup="dialog" aria-controls={dropdown === "profile" ? "profile-logout-dropdown" : undefined} onClick={() => setDropdown(dropdown === "profile" ? null : "profile")}>
            <span className="flex size-12 items-center font-bebas justify-center rounded-full bg-[#ff2f68] text-[28px] font-normal text-[#fff] max-[640px]:size-9 max-[640px]:text-[11px]">{profile.personal.firstName[0]}{profile.personal.lastName[0]}</span>
            <span className="text-left max-[850px]:hidden"><strong className="block text-[16px] font-nunito font-medium text-black">{profile.personal.firstName} {profile.personal.lastName}</strong><small className="block text-[13px] font-nunito text-[#000]">Caregiver</small></span>
            <ChevronDown size={16} className="text-[#ff2f68]" />
          </button>
          {dropdown === "profile" && (
            <ProfileLogoutDropdown onStaySignedIn={() => { setDropdown(null); profileTriggerRef.current?.focus(); }} onLogout={() => setDropdown(null)} />
          )}
        </div>
      </div>
    </header>
  );
}
