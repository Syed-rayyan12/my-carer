import type { CSSProperties } from "react";
import HomePageMotion from "@/components/website/HomePageMotion";
import WebsiteHeader from "@/components/shared/WebsiteHeader";
import HeroSection from "@/components/website/HeroSection";
import CareSearchSection from "@/components/website/CareSearchSection";
import TrustSection from "@/components/website/TrustSection";
import TrustedCaregivers from "@/components/TrustedCaregivers";
import CareCTASection from "@/components/website/CareCTASection";
import HowItWorksSection from "@/components/website/HowItWorksSection";
import TechnologySection from "@/components/website/TechnologySection";
import TestimonialsSection from "@/components/website/TestimonialsSection";
import JournalSection from "@/components/website/JournalSection";
import NewsletterSection from "@/components/website/NewsletterSection";
import WebsiteFooter from "@/components/shared/WebsiteFooter";

export default function HomePage() {
  return (
    <HomePageMotion animationPage="home">
      <WebsiteHeader activePage="home" />
      <HeroSection heart={(<span className="absolute top-0 right-7 mt-1 max-[1024px]:absolute! max-[1024px]:top-12! max-[1024px]:right-7! max-[1024px]:left-auto! max-[1024px]:translate-x-0 max-[1024px]:h-10! max-[1024px]:w-10! max-[1024px]:[--hero-heart-rise-distance:36px] block h-[var(--hero-heart-size)] w-[var(--hero-heart-size)] justify-self-center self-start pointer-events-none" aria-hidden="true">
              <style>{`
    @keyframes home-heart-main-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(var(--hero-heart-pulse-scale)); }
    }
    @keyframes home-heart-rise {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      20%  { opacity: 0.9; }
      100% { opacity: 0;   transform: translate(var(--x), calc(-1 * var(--hero-heart-rise-distance))) scale(0.9) rotate(var(--r)); }
    }
    .home-heart-main {
      display: block;
      animation: home-heart-main-pulse var(--hero-heart-pulse-duration) ease-in-out infinite;
    }
    .home-heart-mini {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0;
      animation: home-heart-rise var(--hero-heart-rise-duration) ease-out infinite;
      animation-delay: var(--d);
    }
    @media (prefers-reduced-motion: reduce) {
      .home-heart-main, .home-heart-mini { animation: none; }
      .home-heart-mini { display: none; }
    }
  `}</style>

              {/* peeche wale chhote hearts */}
              <img src="/images/heart.png" alt="" className="home-heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "calc(var(--hero-heart-particle-delay) * 0)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="home-heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "calc(var(--hero-heart-particle-delay) * 1)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="home-heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "calc(var(--hero-heart-particle-delay) * 2)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="home-heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "calc(var(--hero-heart-particle-delay) * 3)" } as CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="home-heart-main relative" />
            </span>)} animationPage="home" />
      <CareSearchSection />
      <TrustSection />
      <TrustedCaregivers />
      <CareCTASection />
      <HowItWorksSection />
      <TechnologySection />
      <TestimonialsSection />
      <JournalSection />
      <NewsletterSection />
      <WebsiteFooter />
    </HomePageMotion>
  );
}
