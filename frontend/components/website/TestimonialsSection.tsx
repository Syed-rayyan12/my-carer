import { Heart } from "lucide-react";
import DecorativeSquiggle from "@/components/shared/DecorativeSquiggle";
import TestimonialsSlider from "../TestimonialsSlider";
export default function TestimonialsSection({ variant = "default" }: { variant?: "default" | "about" }) {
    return (<section  className={`relative bg-[#fff] ${variant === "about" ? "p-[85px_0_22px] max-[600px]:p-[58px_0_16px]" : "p-[85px_0]"}`}>

  

  <div  className="text-center relative">

    <h2 className="max-[768px]:pt-[112px] relative m-[0_0_10px] text-[#101929] font-commissioner text-[40px] font-bold tracking-[-1px] leading-[1.15] max-[520px]:px-[10px] max-[520px]:text-[28px]">
      Trusted By Care Seekers And
      <span className="text-[#ff2f68]"> Families</span>
    <div className="absolute -top-24 left-2 pointer-events-none max-[768px]:top-0 max-[768px]:left-4 max-[768px]:right-auto max-[768px]:translate-x-0 max-[768px]:w-[84px]">
  <style>{`
    .wave-line {
      fill: none;
      stroke: #ff2f68;
      stroke-width: 3.5;
      stroke-linecap: round;
      stroke-dasharray: 100 100;
      stroke-dashoffset: 100;
      animation: waveDraw 5s ease-in-out infinite;
    }
    @keyframes waveDraw {
      0%   { stroke-dashoffset: 100; }
      35%  { stroke-dashoffset: 0; }
      70%  { stroke-dashoffset: 0; }
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
    </h2>

    <p className="max-w-[900px] m-[0_auto] text-[#626b78] text-[18px] font-medium font-nunito leading-[1.7] max-[520px]:p-[0_15px] max-[520px]:text-[15px]">
      It is a long established fact that a reader will be
      distracted by the readable content of a page when looking
      at its layout.
    </p>

  </div>

  <TestimonialsSlider />

    </section>);
}
