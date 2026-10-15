import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import DecorativeSquiggle from "@/components/shared/DecorativeSquiggle";
const technologyCards = [
  {
    title: "Smart Medication",
    image: "/images/image%202%20(4).png",
    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    title: "Safety & Monitoring",
    image: "/images/Group%201160459038.png",
    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
  {
    title: "Mobility & Comfort",
    image: "/images/image%202%20(11).png",
    text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  },
];
export default function TechnologySection() {
  return (<section className="relative p-[85px_0] bg-[#fff]" id="technology">



    <div className="text-center relative">

      <h2 className="max-[768px]:pt-[112px] relative m-[0_0_10px] text-[#101929] font-commissioner text-[40px] font-bold tracking-[-1px] leading-[1.15] max-[520px]:px-[10px] max-[520px]:text-[28px]">
        Smart Technology For Better
        <span className="text-[#ff2f68] relative max-[768px]:static"> Care

          {/* <div className="absolute -top-4 right-4 z-999">
            <img src="images/heart.png" />
          </div> */}
        </span>
        <div className="absolute -top-24 right-2 pointer-events-none max-[768px]:top-0 max-[768px]:left-4 max-[768px]:right-auto max-[768px]:translate-x-0 max-[768px]:w-[84px]">
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

      <p className="max-w-[960px] m-[0_auto] text-[#626b78] text-[18px] font-nunito font-normal leading-[1.7] max-[520px]:p-[0_15px] max-[520px]:text-[15px]">
        Discover trusted technology and equipment designed to make everyday care safer, easier and more comfortable.
      </p>

    </div>


    <div className="max-[1050px]:w-[calc(100%_-_40px)] max-[768px]:grid-cols-[1fr_1fr] max-[520px]:w-[calc(100%_-_30px)] max-[520px]:grid-cols-[1fr] w-[min(1100px,_calc(100%_-_60px))] m-[35px_auto_0] grid grid-cols-[repeat(3,_1fr)] gap-[16px]">

      {technologyCards.map((card) => (<article className="group/style6 overflow-hidden border border-[#dedfe3] rounded-[10px] bg-[#fff] shadow-[0_8px_24px_rgba(16,_25,_41,_0.07)]" key={card.title}>

        <div className="max-[520px]:h-[250px] h-[250px] overflow-hidden">
          <img className="group-hover/style6:transform-[scale(1.04)] w-full h-full object-cover [transition:transform_0.5s_ease]" src={card.image} alt={card.title} />
        </div>

        <div className="p-[18px]">

          <h3 className="m-[0_0_8px] text-[#101929] font-commissioner text-[20px] font-bold">{card.title}</h3>

          <p className="min-h-[65px] m-[0_0_14px] text-[#000]/60 text-[16px] font-medium leading-[1.65]">{card.text}</p>

          <Link href="#product" className="min-h-[32px] p-[8px_16px] inline-flex items-center gap-[5px] text-[#fff] bg-[#FF2F68] rounded-[10px] text-[14.64px] font-normal">
            View Product
            <ArrowRight size={15} />
          </Link>

        </div>

      </article>))}

    </div>


    <div className="flex justify-center mt-[25px]">
      <Link href="/technology" className="min-h-[38px] p-[0_18px] inline-flex items-center justify-center text-[10px] font-bold rounded-[4px] text-[#101929] bg-[#fff] border border-[#adb2ba]">
        Explore Care Technology
      </Link>
    </div>

  </section>);
}
