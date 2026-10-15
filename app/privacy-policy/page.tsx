import type { CSSProperties } from "react";
import type { Metadata } from "next";
import PlatformPageHero from "@/components/website/PlatformPageHero";
import PrivacyPolicyContent from "@/components/website/PrivacyPolicyContent";
import WebsitePageShell from "@/components/website/WebsitePageShell";

export const metadata: Metadata = {
  title: "Privacy Policy | My Carer",
  description: "Learn how My Carer collects, uses and protects personal information."
};

export default function PrivacyPolicyPage() {
  return (
    <WebsitePageShell activePage="privacy-policy">
      <PlatformPageHero heart={(<span className="absolute top-0 right-7 mt-1 max-[1024px]:absolute! max-[1024px]:top-12! max-[1024px]:right-7! max-[1024px]:left-auto! max-[1024px]:translate-x-0 max-[1024px]:h-10! max-[1024px]:w-10! max-[1024px]:[--hero-heart-rise-distance:36px] block h-[var(--hero-heart-size)] w-[var(--hero-heart-size)] justify-self-center self-start pointer-events-none" aria-hidden="true">
              <style>{`
    @keyframes privacy-policy-heart-main-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(var(--hero-heart-pulse-scale)); }
    }
    @keyframes privacy-policy-heart-rise {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      20%  { opacity: 0.9; }
      100% { opacity: 0;   transform: translate(var(--x), calc(-1 * var(--hero-heart-rise-distance))) scale(0.9) rotate(var(--r)); }
    }
    .privacy-policy-heart-main {
      display: block;
      animation: privacy-policy-heart-main-pulse var(--hero-heart-pulse-duration) ease-in-out infinite;
    }
    .privacy-policy-heart-mini {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0;
      animation: privacy-policy-heart-rise var(--hero-heart-rise-duration) ease-out infinite;
      animation-delay: var(--d);
    }
    @media (prefers-reduced-motion: reduce) {
      .privacy-policy-heart-main, .privacy-policy-heart-mini { animation: none; }
      .privacy-policy-heart-mini { display: none; }
    }
  `}</style>

              {/* peeche wale chhote hearts */}
              <img src="/images/heart.png" alt="" className="privacy-policy-heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "calc(var(--hero-heart-particle-delay) * 0)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="privacy-policy-heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "calc(var(--hero-heart-particle-delay) * 1)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="privacy-policy-heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "calc(var(--hero-heart-particle-delay) * 2)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="privacy-policy-heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "calc(var(--hero-heart-particle-delay) * 3)" } as CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="privacy-policy-heart-main relative" />
            </span>)} animationPage="privacy-policy"
        label="Privacy Policy"
        title="Privacy Policy"
        heartAfter="Policy"
        description="At My Carer, we respect your privacy and are committed to protecting your personal information."
      />
      <PrivacyPolicyContent />
    </WebsitePageShell>
  );
}
