"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardPenLine, CreditCard, Heart, HeartHandshake, LayoutDashboard, LogOut, MessageCircle, Settings, ShieldCheck, UsersRound, Wallet } from "lucide-react";
import { useAdminDashboard } from "./AdminDashboardContext";
import type { AdminSection } from "./adminData";

const navigation: { label: string; section: AdminSection; icon: typeof UsersRound; href?: string }[] = [
  { label: "Caregivers", section: "caregivers", icon: UsersRound, href: "/admin-dashboard/caregivers" },
  { label: "Care Seekers", section: "care-seekers", icon: UsersRound, href: "/admin-dashboard/care-seekers" },
  { label: "Verification", section: "verification", icon: ShieldCheck, href: "/admin-dashboard/verification" },
  { label: "Care Jobs", section: "care-jobs", icon: Heart, href: "/admin-dashboard/care-jobs" },
  { label: "Care Requests", section: "care-requests", icon: HeartHandshake, href: "/admin-dashboard/care-requests" },
  { label: "Messages", section: "messages", icon: MessageCircle, href: "/admin-dashboard/messages" },
  { label: "Reviews", section: "reviews", icon: CreditCard, href: "/admin-dashboard/reviews" },
  { label: "Blog", section: "blog", icon: ClipboardPenLine, href: "/admin-dashboard/blog" },
  { label: "Subscriptions", section: "subscriptions", icon: Wallet, href: "/admin-dashboard/subscriptions" },
  { label: "Settings", section: "settings", icon: Settings, href: "/admin-dashboard/settings" },
];

export default function AdminSidebar() {
  const { mobileMenu, setMobileMenu, setDialog } = useAdminDashboard();
  const pathname = usePathname();
  const overview = pathname === "/admin-dashboard";

  return (
    <aside className={`fixed top-[18px] bottom-[18px] left-[18px] z-40 flex w-[242px] flex-col overflow-y-auto rounded-[20px] bg-white px-3 py-3 max-[1250px]:w-[215px] max-[850px]:w-[205px] max-[640px]:top-3 max-[640px]:bottom-3 max-[640px]:left-3 max-[640px]:w-[242px] max-[640px]:transition-transform ${mobileMenu ? "max-[640px]:translate-x-0" : "max-[640px]:-translate-x-[calc(100%+12px)]"}`}>
      <Link href="/" className="mb-5 flex justify-center py-1"><Image src="/logo.png" alt="My Carer" width={122} height={79} priority className="h-[74px] w-[122px] object-contain" /></Link>
      <nav className="flex flex-col gap-1.5" aria-label="Admin dashboard navigation">
        <Link href="/admin-dashboard" aria-current={overview ? "page" : undefined} onClick={() => { setMobileMenu(false); setDialog(null); }} className={`mb-1 inline-flex min-h-10 items-center gap-3 rounded px-3 font-nunito text-[14px] font-semibold ${overview ? "bg-[#ff2f68] text-white" : "text-black hover:bg-[#fff0f5] hover:text-[#ff2f68]"}`}><LayoutDashboard size={18} />Dashboard Overview</Link>
        {navigation.map(({ label, section, icon: Icon, href }) => href ? (
          <Link key={section} href={href} aria-current={(pathname === href || pathname.startsWith(`${href}/`)) ? "page" : undefined} onClick={() => { setMobileMenu(false); setDialog(null); }} className={`inline-flex min-h-10 items-center gap-3 rounded px-3 py-2 font-nunito text-[14px] ${(pathname === href || pathname.startsWith(`${href}/`)) ? "bg-[#ff2f68] text-white" : "text-black hover:bg-[#fff0f5] hover:text-[#ff2f68]"}`}><Icon size={18} strokeWidth={1.6} />{label}</Link>
        ) : (
          <button key={section} type="button" className="inline-flex min-h-9 items-center gap-3 rounded px-3 py-2 text-left font-nunito text-[14px] text-black hover:bg-[#fff0f5] hover:text-[#ff2f68]" onClick={() => { setMobileMenu(false); setDialog({ type: "section", section }); }}><Icon size={18} strokeWidth={1.6} />{label}</button>
        ))}
        <Link href="/" className="inline-flex min-h-9 items-center gap-3 rounded px-3 py-2 font-nunito text-[14px] text-black hover:bg-[#fff0f5] hover:text-[#ff2f68]"><LogOut size={18} strokeWidth={1.6} />Logout</Link>
      </nav>
    </aside>
  );
}
