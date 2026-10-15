import type { CSSProperties } from "react";
import type { Metadata } from "next";
import CareSearchSection from "@/components/website/CareSearchSection";
import { JobListings, JobProfileTypes } from "@/components/website/JobListings";
import PlatformPageHero from "@/components/website/PlatformPageHero";
import WebsitePageShell from "@/components/website/WebsitePageShell";

export const metadata: Metadata = { title: "Care Jobs | My Carer", description: "Discover care jobs that match your experience, skills, location and availability." };

export default function JobsPage() {
  return <WebsitePageShell activePage="jobs"><PlatformPageHero withSearch heart={(<span className="absolute top-0 right-7 mt-1 max-[1024px]:absolute! max-[1024px]:top-12! max-[1024px]:right-7! max-[1024px]:left-auto! max-[1024px]:translate-x-0 max-[1024px]:h-10! max-[1024px]:w-10! max-[1024px]:[--hero-heart-rise-distance:36px] block h-[var(--hero-heart-size)] w-[var(--hero-heart-size)] justify-self-center self-start pointer-events-none" aria-hidden="true">
              <style>{`
    @keyframes jobs-heart-main-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(var(--hero-heart-pulse-scale)); }
    }
    @keyframes jobs-heart-rise {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      20%  { opacity: 0.9; }
      100% { opacity: 0;   transform: translate(var(--x), calc(-1 * var(--hero-heart-rise-distance))) scale(0.9) rotate(var(--r)); }
    }
    .jobs-heart-main {
      display: block;
      animation: jobs-heart-main-pulse var(--hero-heart-pulse-duration) ease-in-out infinite;
    }
    .jobs-heart-mini {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0;
      animation: jobs-heart-rise var(--hero-heart-rise-duration) ease-out infinite;
      animation-delay: var(--d);
    }
    @media (prefers-reduced-motion: reduce) {
      .jobs-heart-main, .jobs-heart-mini { animation: none; }
      .jobs-heart-mini { display: none; }
    }
  `}</style>

              {/* peeche wale chhote hearts */}
              <img src="/images/heart.png" alt="" className="jobs-heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "calc(var(--hero-heart-particle-delay) * 0)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="jobs-heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "calc(var(--hero-heart-particle-delay) * 1)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="jobs-heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "calc(var(--hero-heart-particle-delay) * 2)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="jobs-heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "calc(var(--hero-heart-particle-delay) * 3)" } as CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="jobs-heart-main relative" />
            </span>)} animationPage="jobs" label="Job Listing" title="Find Your Next Care Opportunity" heartAfter="Care" description="Discover care jobs that match your experience, skills, location and availability." action={{ label: "List Job", href: "/jobs#profile-types" }} /><CareSearchSection /><JobListings /><JobProfileTypes /></WebsitePageShell>;
}
