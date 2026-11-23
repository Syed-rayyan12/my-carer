import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import TrustCard from "./TrustCard";
import DecorativeSquiggle from "@/components/shared/DecorativeSquiggle";
export default function TrustSection({ variant = "default" }: { variant?: "default" | "about" }) {
    return (<section  className={`relative bg-[#fff] ${variant === "about" ? "p-[48px_0_40px] max-[600px]:p-[42px_0_34px]" : "p-[85px_0]"}`} id="about">

     

        <div  className="text-center relative max-[768px]:pt-[112px]">
<div className="absolute -top-20 right-6 pointer-events-none max-[768px]:top-0 max-[768px]:left-auto max-[768px]:right-4 max-[768px]:translate-x-0 max-[768px]:w-[84px]">
  <style>{`
    .wave-line {
      fill: none;
      stroke: #ff2f68;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 100 100;
      stroke-dashoffset: 100;
      animation: waveDraw 20s ease-in-out infinite;
    }
    @keyframes waveDraw {
      0%   { stroke-dashoffset: 100; }
      25%  { stroke-dashoffset: 0; }
      65%  { stroke-dashoffset: 0; }
      100% { stroke-dashoffset: -100; }
    }
    @media (prefers-reduced-motion: reduce) {
      .wave-line { animation: none; stroke-dashoffset: 0; }
    }
  `}</style>

  <svg viewBox="0 0 110 120" className="w-[110px] max-[768px]:w-full h-auto overflow-visible" aria-hidden="true">
    <path className="wave-line" pathLength={100} style={{ animationDelay: "0s" }}
      transform="translate(38 14) rotate(28)"
      d="M0,0 q3.2,-8 6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0" />
    <path className="wave-line" pathLength={100} style={{ animationDelay: "0.45s" }}
      transform="translate(30.5 28) rotate(28)"
      d="M0,0 q3.2,-8 6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0" />
    <path className="wave-line" pathLength={100} style={{ animationDelay: "0.9s" }}
      transform="translate(23 42) rotate(28)"
      d="M0,0 q3.2,-8 6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0" />
    <path className="wave-line" pathLength={100} style={{ animationDelay: "1.35s" }}
      transform="translate(15.5 56) rotate(28)"
      d="M0,0 q3.2,-8 6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0" />
    <path className="wave-line" pathLength={100} style={{ animationDelay: "1.8s" }}
      transform="translate(8 70) rotate(28)"
      d="M0,0 q3.2,-8 6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0 t6.4,0" />
  </svg>
</div>
          <h2 className="m-[0_0_10px] text-[#101929] font-commissioner font-bold tracking-[-1px] leading-[1.15] text-[40px] max-[520px]:px-[10px] max-[520px]:text-[28px] relative">
            Care You Can
            <span className="text-[#ff2f68]"> Trust</span>
          
             {/* <div className="absolute -top-1 right-121 z-999">
              <img src="images/heart.png" />
            </div> */}
          </h2>

          <p className="font-medium max-w-[800px] m-[0_auto] text-[#000]/80 text-[18px] leading-[1.7] max-[520px]:p-[0_15px] max-[520px]:text-[15px]">
            Connecting you with qualified professionals who understand
            that great care starts with trust.
          </p>

        </div>


        <div  className={`max-[1050px]:w-[calc(100%_-_40px)] max-[768px]:grid-cols-[1fr_1fr] max-[520px]:w-[calc(100%_-_30px)] max-[520px]:grid-cols-[1fr] w-[min(1100px,_calc(100%_-_60px))] m-[35px_auto_0] grid grid-cols-[repeat(4,_1fr)] gap-[14px] ${variant === "about" ? "m-[27px_auto_0] gap-[12px]" : ""}`}>

          <TrustCard variant={variant} icon={<ShieldCheck size={15}/>} title="Verified Professionals" text="Caregivers provide verified qualifications, experience and background checks."/>

          <TrustCard variant={variant} icon={<MapPin size={15}/>} title="Local Caregivers" text="Find caregivers in your area based on location, availability and care requirements."/>

          <TrustCard variant={variant} icon={<Heart size={15}/>} title="Specialist Care" text="Find professionals experienced in dementia, elderly care, disability and more."/>

          <TrustCard variant={variant} icon={<Star size={15}/>} title="Real Reviews" text="Read references and reviews to help you choose the right caregiver with confidence."/>

        </div>
      </section>);
}
