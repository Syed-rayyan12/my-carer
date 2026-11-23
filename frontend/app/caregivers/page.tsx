import type { CSSProperties } from "react";
import type { Metadata } from "next";
import CareSearchSection from "@/components/website/CareSearchSection";
import CaregiverDirectory from "@/components/website/CaregiverDirectory";
import PlatformPageHero from "@/components/website/PlatformPageHero";
import WebsitePageShell from "@/components/website/WebsitePageShell";

export const metadata: Metadata = { title: "Browse Caregivers | My Carer", description: "Find verified caregivers and care professionals across the UK." };

export default function CaregiversPage() {
  return <WebsitePageShell activePage="caregivers"><PlatformPageHero withSearch heart={(<span className="absolute top-0 right-7 mt-1 max-[1024px]:absolute! max-[1024px]:top-12! max-[1024px]:right-7! max-[1024px]:left-auto! max-[1024px]:translate-x-0 max-[1024px]:h-10! max-[1024px]:w-10! max-[1024px]:[--hero-heart-rise-distance:36px] block h-[var(--hero-heart-size)] w-[var(--hero-heart-size)] justify-self-center self-start pointer-events-none" aria-hidden="true">
              <style>{`
    @keyframes caregivers-heart-main-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(var(--hero-heart-pulse-scale)); }
    }
    @keyframes caregivers-heart-rise {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      20%  { opacity: 0.9; }
      100% { opacity: 0;   transform: translate(var(--x), calc(-1 * var(--hero-heart-rise-distance))) scale(0.9) rotate(var(--r)); }
    }
    .caregivers-heart-main {
      display: block;
      animation: caregivers-heart-main-pulse var(--hero-heart-pulse-duration) ease-in-out infinite;
    }
    .caregivers-heart-mini {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0;
      animation: caregivers-heart-rise var(--hero-heart-rise-duration) ease-out infinite;
      animation-delay: var(--d);
    }
    @media (prefers-reduced-motion: reduce) {
      .caregivers-heart-main, .caregivers-heart-mini { animation: none; }
      .caregivers-heart-mini { display: none; }
    }
  `}</style>

              {/* peeche wale chhote hearts */}
              <img src="/images/heart.png" alt="" className="caregivers-heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "calc(var(--hero-heart-particle-delay) * 0)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="caregivers-heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "calc(var(--hero-heart-particle-delay) * 1)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="caregivers-heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "calc(var(--hero-heart-particle-delay) * 2)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="caregivers-heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "calc(var(--hero-heart-particle-delay) * 3)" } as CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="caregivers-heart-main relative" />
            </span>)} animationPage="caregivers" label="Caregivers" title="A Smarter Way To Find And Provide Care" heartAfter="Way" description="My Carer is a trusted online platform designed to connect people who need care with qualified caregivers and care professionals." /><CareSearchSection /><CaregiverDirectory /></WebsitePageShell>;
}
