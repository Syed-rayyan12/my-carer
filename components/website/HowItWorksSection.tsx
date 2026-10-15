"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { number: "01", title: "Tell Us What You Need", text: "Share your location and care requirements." },
  { number: "02", title: "Browse Caregivers", text: "Explore qualified professionals who match your needs." },
  { number: "03", title: "Compare & Connect", text: "Review experience, qualifications, rates and references." },
  { number: "04", title: "Start Care", text: "Choose the right caregiver and begin your care journey." },
];

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // animation sirf ek baar chalegi
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="max-[520px]:text-center relative p-[85px_0] bg-[#fff]"
    >
      <style>{`
        .hiw-circle {
          opacity: 0;
          transform: rotate(-360deg) scale(0.2);
        }
        .hiw-line {
          transform: scaleX(0);
          transform-origin: right center; /* right se left ki taraf reveal */
        }
        .hiw-text {
          opacity: 0;
          transform: translateY(14px);
        }

        .hiw-in .hiw-circle {
          animation: hiwSpin 0.9s cubic-bezier(0.34, 1.4, 0.64, 1) forwards;
          animation-delay: var(--d);
        }
        .hiw-in .hiw-line {
          animation: hiwLine 0.9s ease-out forwards;
          animation-delay: calc(var(--d) + 0.45s);
        }
        .hiw-in .hiw-text {
          animation: hiwText 0.7s ease-out forwards;
          animation-delay: calc(var(--d) + 0.3s);
        }

        @keyframes hiwSpin {
          to { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        @keyframes hiwLine {
          to { transform: scaleX(1); }
        }
        @keyframes hiwText {
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .hiw-circle, .hiw-line, .hiw-text {
            opacity: 1 !important;
            transform: none !important;
            animation: none !important;
          }
        }
      `}</style>

      <div className="text-center relative">
        <h2 className="relative max-[768px]:pt-[104px] relative m-[0_0_10px] text-[#101929] font-commissioner text-[40px] font-bold tracking-[-1px] leading-[1.15] max-[520px]:px-[10px] max-[520px]:text-[28px]">
          Finding Care Made
          <span className="text-[#ff2f68] relative max-[768px]:static">
            {" "}Simple
          <span className="absolute -top-1 -right-16 z-999 pointer-events-none max-[768px]:top-[56px] max-[768px]:left-8 max-[768px]:right-auto max-[768px]:translate-x-0 max-[768px]:h-9 max-[768px]:w-9 max-[768px]:[--section-heart-rise:36px]">
  <style>{`
    @keyframes heartMain {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.08); }
    }
    @keyframes heartRise {
      0%   { opacity: 0;   transform: translate(0, 0) scale(0.4) rotate(0deg); }
      20%  { opacity: 0.9; }
      100% { opacity: 0;   transform: translate(var(--x), calc(-1 * var(--section-heart-rise, 70px))) scale(0.9) rotate(var(--r)); }
    }
    .heart-main {
      display: block;
      animation: heartMain 1.6s ease-in-out infinite;
    }
    .heart-mini {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0;
      animation: heartRise 3.2s ease-out infinite;
      animation-delay: var(--d);
    }
    @media (prefers-reduced-motion: reduce) {
      .heart-main, .heart-mini { animation: none; }
      .heart-mini { display: none; }
    }
  `}</style>

  {/* peeche wale chhote hearts */}
  <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "0s" } as React.CSSProperties} />
  <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "20px",  "--r": "16deg",  "--d": "0.8s" } as React.CSSProperties} />
  <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "-6px",  "--r": "-8deg",  "--d": "1.6s" } as React.CSSProperties} />
  <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "28px",  "--r": "22deg",  "--d": "2.4s" } as React.CSSProperties} />

  {/* asli heart */}
  <img src="/images/heart.png" alt="" className="heart-main relative" />
</span>
          </span>
        </h2>

        <p className="max-w-[900px] m-[0_auto] text-[#626b78] text-[18px] font-nunito font-medium leading-[1.7] max-[520px]:p-[0_15px] max-[520px]:text-[15px] max-[520px]:max-w-[100%] max-[520px]:m-[0_auto]">
          From your first search to starting care, My Carer makes the
          process simple and transparent.
        </p>
      </div>

      <div
        className={`${inView ? "hiw-in" : ""} max-[1050px]:w-[calc(100%_-_40px)] max-[768px]:grid-cols-[1fr_1fr] max-[520px]:w-[calc(100%_-_30px)] max-[520px]:grid-cols-[1fr] max-[520px]:text-center w-[min(1100px,_calc(100%_-_60px))] m-[45px_auto_0] grid grid-cols-[repeat(4,_1fr)] gap-[25px]`}
      >
        {steps.map((step, i) => (
          <div
            key={step.number}
            style={{ "--d": `${i * 0.35}s` } as React.CSSProperties}
          >
            {/* circle + line */}
            <div className="flex items-center gap-[14px] mb-[22px] max-[520px]:justify-center">
              <div className="hiw-circle w-[42px] h-[42px] shrink-0 flex items-center justify-center rounded-full border border-[#ff2f68] text-[#ff2f68] text-[13px] font-nunito font-medium bg-white">
                {step.number}
              </div>
              <div className="hiw-line flex-1 h-[1.5px] bg-[#ffa3c3] max-[520px]:hidden" />
            </div>

            {/* text */}
            <div className="hiw-text">
              <h3 className="m-[0_0_8px] text-[#101929] font-nunito text-[16px] font-bold">
                {step.title}
              </h3>
              <p className="m-0 text-[#626b78] font-nunito text-[13px] leading-[1.6] max-w-[220px] max-[520px]:m-[0_auto]">
                {step.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}