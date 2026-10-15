"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PageKey = "home" | "about" | "caregivers" | "care-seekers" | "care-homes" | "jobs" | "technology" | "pricing" | "faqs" | "blogs" | "terms" | "privacy-policy" | "contact";

const navigation = [
  { label: "Home", href: "/", key: "home" as PageKey },
  { label: "About", href: "/about", key: "about" as PageKey },
  { label: "Job Listing", href: "/jobs", key: "jobs" as PageKey },
  { label: "Care Technology", href: "/technology", key: "technology" as PageKey },
  { label: "Contact", href: "/contact", key: "contact" as PageKey },
];

function HeaderActions({ onNavigate, mobile = false }: { onNavigate: () => void; mobile?: boolean }) {
  return (
    <div className={mobile ? "grid grid-cols-1 gap-3" : "flex flex-wrap items-center gap-3"}>
      <Link href="/#signin" onClick={onNavigate} className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-[7px] border border-[#ff2f68] px-4 font-nunito text-[14px] font-medium text-[#101929] transition-colors hover:bg-[#fff1f4]">
        Sign In
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff2f68] text-white">
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
      <Link href="/#register" onClick={onNavigate} className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-[7px] bg-[#ff2f68] px-4 font-nunito text-[14px] font-medium text-white transition-colors hover:bg-[#e92359]">
        Register Today
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#ff2f68]">
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}

function NavigationLinks({ activePage, onNavigate }: { activePage?: PageKey; onNavigate: () => void }) {
  const linkClass = "whitespace-nowrap rounded-md py-2 font-commissioner text-[16px] font-medium transition-colors hover:text-[#ff2f68]";
  return (
    <>
      {navigation.slice(0, 2).map((item) => (
        <Link key={item.key} href={item.href} onClick={onNavigate} aria-current={activePage === item.key ? "page" : undefined} className={`${linkClass} ${activePage === item.key ? "text-[#ff2f68]" : "text-[#101929]"}`}>
          {item.label}
        </Link>
      ))}
      <details className="group relative">
        <summary className={`${linkClass} flex cursor-pointer list-none items-center gap-1.5 [&::-webkit-details-marker]:hidden ${activePage === "caregivers" || activePage === "care-seekers" || activePage === "care-homes" ? "text-[#ff2f68]" : "text-[#101929]"}`}>
          Platform <ChevronDown size={16} className="transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-2 hidden min-w-[205px] rounded-lg border border-[#f1e5e8] bg-white p-2 shadow-lg group-open:block xl:absolute xl:left-0 xl:top-full">
          <Link href="/caregivers" onClick={onNavigate} className="block rounded-md px-3 py-2 font-commissioner text-[16px] text-[#101929] hover:bg-[#fff1f4] hover:text-[#ff2f68]">Caregivers</Link>
          <Link href="/care-seekers" onClick={onNavigate} className="block rounded-md px-3 py-2 font-commissioner text-[16px] text-[#101929] hover:bg-[#fff1f4] hover:text-[#ff2f68]">Care Seekers</Link>
          <Link href="/pricing#local-authority" onClick={onNavigate} className="block rounded-md px-3 py-2 font-commissioner text-[16px] text-[#101929] hover:bg-[#fff1f4] hover:text-[#ff2f68]">Care Homes</Link>
        </div>
      </details>
      {navigation.slice(2).map((item) => (
        <Link key={item.key} href={item.href} onClick={onNavigate} aria-current={activePage === item.key ? "page" : undefined} className={`${linkClass} ${activePage === item.key ? "text-[#ff2f68]" : "text-[#101929]"}`}>
          {item.label}
        </Link>
      ))}
    </>
  );
}

export default function WebsiteHeader({ activePage }: { activePage?: PageKey }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    const dialog = menuRef.current;
    if (!dialog) return;
    if (!menuOpen) { if (dialog.open) dialog.close(); return; }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    const animations: Animation[] = [];
    const easing = "cubic-bezier(0.22, 1, 0.36, 1)";
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reveal = dialog.animate([
        { clipPath: "circle(0% at 100% 0%)" },
        { clipPath: "circle(150% at 100% 0%)" },
      ], { duration: 1000, easing, fill: "both" });
      reveal.onfinish = () => reveal.cancel();
      animations.push(reveal);
      const items = dialog.querySelectorAll<HTMLElement>("nav a, nav p, :scope > div > div:first-child, :scope > div > div:last-child a");
      items.forEach((item, index) => {
        const fade = item.animate([
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 850, delay: 180 + index * 70, easing, fill: "both" });
        fade.onfinish = () => fade.cancel();
        animations.push(fade);
      });
    }
    const onFocus = () => { animations.forEach((animation) => animation.cancel()); };
    dialog.addEventListener("focusin", onFocus);
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => { if (desktop.matches) setMenuOpen(false); };
    desktop.addEventListener("change", onResize);
    return () => {
      animations.forEach((animation) => animation.cancel());
      dialog.removeEventListener("focusin", onFocus);
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener("change", onResize);
    };
  }, [menuOpen]);

  return (
    <header className="relative z-30 border-t-[6px] border-[#ff2f68] bg-white">
      <div className="mx-auto hidden min-h-[88px] w-full max-w-[90%] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-5 xl:grid">
        <Link href="/" aria-label="My Carer home" className="w-fit justify-self-start">
          <img src="/logo.png" alt="My Carer" className="block h-[62px] w-[112px] object-contain" />
        </Link>
        <nav aria-label="Desktop navigation" className="flex items-center justify-center justify-self-center gap-5">
          <NavigationLinks activePage={activePage} onNavigate={closeMenu} />
        </nav>
        <div className="justify-self-end"><HeaderActions onNavigate={closeMenu} /></div>
      </div>

      <div className="mx-auto flex min-h-[76px] w-full max-w-[90%] items-center justify-between xl:hidden">
        <Link href="/" aria-label="My Carer home" onClick={closeMenu} className="shrink-0">
          <img src="/logo.png" alt="My Carer" className="block h-[54px] w-[112px] object-contain" />
        </Link>
        <button type="button" aria-controls="mobile-navigation" aria-haspopup="dialog" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#ffd0dc] text-[#ff2f68]">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <dialog ref={menuRef} id="mobile-navigation" aria-labelledby="mobile-menu-title" onClose={closeMenu}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right) closeMenu();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none border-0 bg-white p-0 text-[#101929] shadow-2xl backdrop:bg-[#101929]/60">
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-[#f1e5e8] px-5 py-4">
            <Link href="/" onClick={closeMenu} aria-label="My Carer home"><img src="/logo.png" alt="My Carer" className="h-[50px] w-[104px] object-contain" /></Link>
            <h2 id="mobile-menu-title" className="sr-only">Navigation menu</h2>
            <button type="button" onClick={closeMenu} aria-label="Close navigation" className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff1f4] text-[#ff2f68] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><X size={22} /></button>
          </div>
          <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
            {navigation.slice(0, 2).map((item) => <Link key={item.key} href={item.href} onClick={closeMenu} aria-current={activePage === item.key ? "page" : undefined} className={["mb-1 flex min-h-12 items-center justify-between rounded-xl px-4 font-commissioner text-[16px] font-medium", activePage === item.key ? "bg-[#fff1f4] text-[#ff2f68]" : "text-[#101929] hover:bg-[#f7f8fa]"].join(" ")}>{item.label}<ArrowRight size={17} className="text-[#ff2f68]" /></Link>)}
            <div className="my-3 rounded-xl border border-[#ffd0dc] bg-[#fff1f4]/50 p-2">
              <p className="px-3 py-2 font-nunito text-[12px] font-bold uppercase tracking-wider text-[#626b78]">Platform</p>
              {[{ label: "Caregivers", href: "/caregivers", key: "caregivers" }, { label: "Care Seekers", href: "/care-seekers", key: "care-seekers" }, { label: "Care Homes", href: "/pricing#local-authority", key: "care-homes" }].map((item) => <Link key={item.key} href={item.href} onClick={closeMenu} aria-current={activePage === item.key ? "page" : undefined} className={["flex min-h-11 items-center justify-between rounded-lg px-3 font-commissioner text-[16px] font-medium", activePage === item.key ? "bg-white text-[#ff2f68]" : "hover:bg-white"].join(" ")}>{item.label}<ArrowRight size={16} className="text-[#ff2f68]" /></Link>)}
            </div>
            {[...navigation.slice(2), { label: "Pricing", href: "/pricing", key: "pricing" }, { label: "FAQs", href: "/faqs", key: "faqs" }, { label: "Blog & Resources", href: "/blogs", key: "blogs" }].map((item) => <Link key={item.key} href={item.href} onClick={closeMenu} aria-current={activePage === item.key ? "page" : undefined} className={["mb-1 flex min-h-12 items-center justify-between rounded-xl px-4 font-commissioner text-[16px] font-medium", activePage === item.key ? "bg-[#fff1f4] text-[#ff2f68]" : "hover:bg-[#f7f8fa]"].join(" ")}>{item.label}<ArrowRight size={17} className="text-[#ff2f68]" /></Link>)}
          </nav>
          <div className="shrink-0 border-t border-[#f1e5e8] p-5 pb-[max(20px,env(safe-area-inset-bottom))]"><HeaderActions mobile onNavigate={closeMenu} /></div>
        </div>
      </dialog>

    </header>
  );
}
