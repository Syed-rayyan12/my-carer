"use client";

import { ArrowRight } from "lucide-react";

export default function ProfileProgress({ completion = 85 }: { completion?: number }) {
  const percentage = Math.min(100, Math.max(0, completion));

  return (
    <section className="flex min-h-[120px] items-center justify-between gap-6 rounded-[11px] border border-[#ff2f68] bg-[#ff2f68]/8 px-[38px] py-6 max-[700px]:flex-col max-[700px]:items-start max-[700px]:px-5" aria-labelledby="profile-progress-title">
      <div className="min-w-0 flex-1">
        <h2 id="profile-progress-title" className="mb-2 font-jakarta text-base font-semibold text-black">Your Profile is {percentage}% Complete</h2>
        <svg className="mb-2 block h-2 w-full max-w-[448px] overflow-hidden rounded-full" viewBox="0 0 100 2" preserveAspectRatio="none" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-label="Profile completion">
          <rect width={100} height={2} rx={1} className="fill-white" />
          <rect width={percentage} height={2} rx={1} className="fill-[#ff2f68]" />
        </svg>
        <p className="font-nunito text-[14px] font-normal text-[#5e6b65]">Complete your profile to help us provide more relevant caregiver recommendations.</p>
      </div>
      <button className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-3.5 py-2 font-nunito text-sm font-semibold text-white transition-colors hover:bg-[#e92359] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2f68]" onClick={() => document.getElementById("profile-first-name")?.focus()}>Complete Profile<ArrowRight size={16} /></button>
    </section>
  );
}
