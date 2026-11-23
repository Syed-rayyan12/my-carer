import type { CSSProperties } from "react";
import HeroSection from "@/components/website/HeroSection";
import HomePageMotion from "@/components/website/HomePageMotion";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WebsiteHeader from "@/components/shared/WebsiteHeader";
import WebsiteFooter from "@/components/shared/WebsiteFooter";
import CareCTASection from "@/components/website/CareCTASection";
import TrustSection from "@/components/website/TrustSection";
import AboutImageTextSection from "@/components/website/AboutImageTextSection";
import TestimonialsSection from "@/components/website/TestimonialsSection";
import JournalSection from "@/components/website/JournalSection";
import NewsletterSection from "@/components/website/NewsletterSection";

export const metadata: Metadata = {
  title: "About My Carer | Care Built Around Trust",
  description:
    "Learn about My Carer's mission to connect families with trusted, qualified care professionals across the UK.",
};

function WhatWeOffer() {
  const offers = [
    {
      title: "For Caregivers",
      description: "Share your experience, build your professional profile and connect with families looking for the care you provide.",
      image: "/images/about-offer-caregivers.png",
      alt: "A caregiver supporting a woman at home",
      action: "Become a Caregiver",
      href: "/#register",
      tone: "bg-[#ffe1e9]",
      button: "bg-[#ff2f68] text-white",
    },
    {
      title: "For Care Seekers",
      description: "Explore verified professionals, compare experience and find the right support for you or someone you love.",
      image: "/images/about-offer-seekers.png",
      alt: "A caregiver discussing a care plan with an older couple",
      action: "Find Care Now",
      href: "/#find-care",
      tone: "bg-[#e7efff]",
      button: "bg-[#101929] text-white",
    },
  ];

  return (
    <section className="bg-white pb-[72px] pt-3 max-[760px]:pb-12">
      <div className="mx-auto w-[min(1100px,calc(100%-64px))]">
        <div className="mb-7 text-center">
          <h2 className="font-commissioner text-[40px] font-bold leading-tight text-[#101929] max-[760px]:text-[28px]">What We <span className="text-[#ff2f68]">Offer</span></h2>
          <p className="mx-auto mt-2 max-w-[720px] text-[18px] font-medium  leading-[1.7] text-[#626b78]">A trusted place for care seekers and care professionals to find each other.</p>
        </div>
        <div className="grid grid-cols-2 gap-5 max-[650px]:grid-cols-1">
          {offers.map((offer) => (
            <article key={offer.title} className={`overflow-hidden rounded-[8px] ${offer.tone}`}>
              <div className="relative h-[355px] overflow-hidden max-[760px]:h-[320px]">
                <Image src={offer.image} alt={offer.alt} fill className="object-cover" sizes="(max-width: 650px) 100vw, 50vw" />
              </div>
              <div className="p-6 max-[760px]:p-5">
                <h3 className={`mb-2 font-commissioner text-[30px] font-bold ${offer.title === "For Caregivers" ? "text-[#ff2f68]" : "text-[#101929]"}`}>{offer.title}</h3>
                <p className="mb-4 text-[20px] leading-[1.65] font-medium font-nunito text-[#626b78]">{offer.description}</p>
                <Link href={offer.href} className={`inline-flex min-h-10 items-center gap-2 rounded-[4px] px-4 text-[16px] font-normal transition-transform hover:-translate-y-0.5 ${offer.button}`}>
                  {offer.action}<ArrowRight size={13} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <HomePageMotion animateSections={false} animationPage="about">
      <WebsiteHeader activePage="about" />
      <HeroSection heart={(<span className="absolute top-0 right-7 mt-1 max-[1024px]:absolute! max-[1024px]:top-12! max-[1024px]:right-7! max-[1024px]:left-auto! max-[1024px]:translate-x-0 max-[1024px]:h-10! max-[1024px]:w-10! max-[1024px]:[--hero-heart-rise-distance:36px] block h-[var(--hero-heart-size)] w-[var(--hero-heart-size)] justify-self-center self-start pointer-events-none" aria-hidden="true">
              <style>{`
    @keyframes about-heart-main-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(var(--hero-heart-pulse-scale)); }
    }
    @keyframes about-heart-rise {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      20%  { opacity: 0.9; }
      100% { opacity: 0;   transform: translate(var(--x), calc(-1 * var(--hero-heart-rise-distance))) scale(0.9) rotate(var(--r)); }
    }
    .about-heart-main {
      display: block;
      animation: about-heart-main-pulse var(--hero-heart-pulse-duration) ease-in-out infinite;
    }
    .about-heart-mini {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0;
      animation: about-heart-rise var(--hero-heart-rise-duration) ease-out infinite;
      animation-delay: var(--d);
    }
    @media (prefers-reduced-motion: reduce) {
      .about-heart-main, .about-heart-mini { animation: none; }
      .about-heart-mini { display: none; }
    }
  `}</style>

              {/* peeche wale chhote hearts */}
              <img src="/images/heart.png" alt="" className="about-heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "calc(var(--hero-heart-particle-delay) * 0)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="about-heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "calc(var(--hero-heart-particle-delay) * 1)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="about-heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "calc(var(--hero-heart-particle-delay) * 2)" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="about-heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "calc(var(--hero-heart-particle-delay) * 3)" } as CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="about-heart-main relative" />
            </span>)} variant="about" animationPage="about" />
      <TrustSection />
      <AboutImageTextSection
        title="Mission"
        image="/images/about-mission.png"
        imageAlt="A caregiver helping an older woman walk with a frame"
        paragraphs={[
          "My Carer was founded with a simple yet powerful goal: to make it easier for people to find trusted, qualified caregivers in their local area. We understand that choosing care for yourself or a loved one can be an important and sometimes difficult decision. Families want to know that the person providing care is experienced, reliable and genuinely committed to the wellbeing of those they support.",
          "At the same time, professional caregivers deserve an opportunity to showcase their skills, qualifications and experience and connect with people who need their services.",
          "Our platform brings these two communities together, making it easier to discover the right care and build meaningful relationships.",
        ]}
      />
      <CareCTASection />
      <AboutImageTextSection
        title="Story"
        image="/images/about-story.png"
        imageAlt="A care professional talking with an older woman at home"
        imageOnRight
        paragraphs={[
          "My Carer was founded with a simple yet powerful goal: to make it easier for people to find trusted, qualified caregivers in their local area. We understand that choosing care for yourself or a loved one can be an important and sometimes difficult decision. Families want to know that the person providing care is experienced, reliable and genuinely committed to the wellbeing of those they support.",
        ]}
      />
      <WhatWeOffer />
      <TestimonialsSection />
      <JournalSection />
      <NewsletterSection />
      <WebsiteFooter />
    </HomePageMotion>
  );
}
