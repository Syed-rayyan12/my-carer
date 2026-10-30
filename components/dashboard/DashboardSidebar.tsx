"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CalendarDays, ClipboardList, Heart, HelpCircle, LayoutDashboard, LogOut, MessageSquare, Search, Settings, Star, UserRound } from "lucide-react";
import { useDashboard } from "./DashboardContext";

export default function DashboardSidebar() {
  const { mobileMenu, setMobileMenu, saved, showPanel } = useDashboard();
  const pathname = usePathname();
  function isActive(href: string) {
    return pathname === href || (href === "/care-seeker-dashboard" && pathname === "/dashboard") || ((href === "/care-seeker-dashboard/care-requirements" || href === "/care-seeker-dashboard/my-requests") && pathname.startsWith(`${href}/`));
  }
  const nav = [
    { label: "Dashboard Overview", icon: LayoutDashboard, href: "/care-seeker-dashboard" },
    { label: "My Profile", icon: UserRound, href: "/care-seeker-dashboard/my-profile" },
    { label: "My Care Requirements", icon: ClipboardList, href: "/care-seeker-dashboard/care-requirements" },
    { label: "Find Caregivers", icon: Search, href: "/care-seeker-dashboard/find-caregivers" },
    { label: "Saved Caregivers", icon: Heart, href: "/care-seeker-dashboard/saved-caregivers" },
    { label: "My Requests", icon: ClipboardList, href: "/care-seeker-dashboard/my-requests" },
    { label: "Messages", icon: MessageSquare, href: "/care-seeker-dashboard/messages" },
    { label: "Care Arrangements", icon: CalendarDays, href: "/care-seeker-dashboard/care-arrangements" },
    { label: "Reviews & Ratings", icon: Star, href: "/care-seeker-dashboard/reviews-ratings" },
    { label: "Settings", icon: HelpCircle, href: "/care-seeker-dashboard/settings" },
   
  ];

  return (
    <aside className={`fixed top-[18px] bottom-[18px] left-[18px] z-40 flex w-[242px] flex-col overflow-y-auto rounded-[20px] border border-[#ececf0] bg-white px-[18px] py-[22px] max-[1250px]:w-[215px] max-[1250px]:px-3 max-[850px]:w-[205px] max-[640px]:top-3 max-[640px]:bottom-3 max-[640px]:left-3 max-[640px]:w-[242px] max-[640px]:rounded-2xl max-[640px]:transition-transform max-[640px]:duration-200 ${mobileMenu ? "max-[640px]:translate-x-0" : "max-[640px]:-translate-x-[calc(100%+12px)]"}`}>
      <Link href="/" className="mb-8 flex justify-center"><Image className="h-[76px] w-[118px] object-contain" src="/logo.png" alt="My Carer" width={122} height={79} priority /></Link>
    
      <nav className="flex flex-col gap-2" aria-label="Dashboard navigation">
        {nav.map(({ label, icon: Icon, href }, index) => href ? (
          <Link className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 font-nunito text-[13px] font-medium ${isActive(href) ? "bg-[#ff2f68] text-white" : "text-black hover:bg-[#fff5f8] hover:text-[#ff2f68]"}`} key={label} href={href} aria-current={isActive(href) ? "page" : undefined} onClick={() => setMobileMenu(false)}><Icon size={19} />{label}</Link>
        ) : (
          <button className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-xs font-semibold font-nunito  ${index === 0 ? "bg-[#FF2F68] text-[#fff]  font-nunito font-medium text-[13px]" : "text-[#000] font-nunito font-medium text-[13px]"}`} key={label} aria-current={index === 0 ? "page" : undefined} onClick={() => index === 0 ? setMobileMenu(false) : showPanel(label)}>
            <Icon size={19} />{label}
            {label === "Saved Caregivers" && saved.length > 0 && <span className="ml-auto rounded bg-[#ff2f68] px-1.5 text-[10px] text-white">{saved.length}</span>}
          </button>
        ))}
      </nav>
      <div className="mt-auto ">
        {/* <div className="mb-6 rounded-xl border border-[#ffe7ee] bg-[#fff5f8] px-3 py-5 text-center">
          <HelpCircle size={23} className="mx-auto mb-2 text-[#ff2f68]" />
          <h3 className="mb-1 text-xs font-extrabold">A little help along the way?</h3>
          <p className="text-[11px] leading-relaxed text-[#8a7f85]">We&apos;re here to help you find the right care.</p>
          <Link className="mt-2.5 inline-flex items-center gap-2.5 text-xs font-extrabold text-[#ff2f68]" href="/contact">Get in touch<ArrowRight size={15} /></Link>
        </div> */}
        {/* <Link className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-left text-xs font-semibold ${pathname === "/care-seeker-dashboard/settings" ? "bg-[#ff2f68] text-white" : "text-[#6d717c] hover:bg-[#fff5f8] hover:text-[#ff2f68]"}`} aria-current={pathname === "/care-seeker-dashboard/settings" ? "page" : undefined} href="/care-seeker-dashboard/settings" onClick={() => setMobileMenu(false)}><Settings size={19} />Settings</Link> */}

      </div>
    </aside>
  );
}
