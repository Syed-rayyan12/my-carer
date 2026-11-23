import HomeCaregiverCards from './website/HomeCaregiverCards';
import type { CSSProperties } from 'react';

export default function TrustedCaregivers() {
  return (
    <section id="caregivers" className="relative w-full overflow-x-clip bg-white pt-[35px] pb-20 max-[900px]:py-[70px] max-[650px]:py-[60px]">

      {/* =====================================================
          SECTION HEADING
      ====================================================== */}

      <div className="max-[768px]:relative mx-auto mb-[45px] w-[calc(100%-60px)] max-w-[1180px] text-center max-[900px]:mb-[35px] max-[900px]:w-[calc(100%-40px)] max-[650px]:mb-[30px] max-[650px]:w-[calc(100%-30px)]">
        <div className="absolute -top-24 left-2 pointer-events-none max-[768px]:top-0 max-[768px]:left-2 max-[768px]:w-16">
          <img src="/images/pattern-6.png" alt="" className="w-full object-cover max-[768px]:h-[88px] max-[768px]:object-contain" />
        </div>
        <h2 className="relative max-[768px]:pt-[104px] m-0 text-[#101929] font-commissioner text-[38px] font-extrabold leading-[1.2] tracking-[-1px] max-[900px]:text-[32px] max-[650px]:text-[28px] max-[650px]:tracking-[-0.5px]">
          Meet Some Of Our Trusted{" "}
          <span className="relative max-[768px]:static text-[#ff2f68]">
            Caregivers

            <span className="absolute -top-1 -right-16 z-999 pointer-events-none max-[768px]:top-[56px] max-[768px]:left-auto max-[768px]:right-8 max-[768px]:translate-x-0 max-[768px]:h-9 max-[768px]:w-9 max-[768px]:[--section-heart-rise:36px]">
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
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "0s" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "0.8s" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "1.6s" } as CSSProperties} />
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "2.4s" } as CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="heart-main relative" />
            </span>
          </span>
        </h2>

      </div>


      {/* =====================================================
          CAREGIVER CARDS
      ====================================================== */}

      <HomeCaregiverCards />

      {/* =====================================================
          EXPLORE BUTTON
      ====================================================== */}

      <div className="flex justify-center mt-[30px]">

        <a
          href="/caregivers"
          className="min-h-[45px] px-[22px] transition-all inline-flex items-center justify-center bg-[#101929] rounded-[5px] text-white font-nunito text-[16px] font-normal transition-[background-color,transform] duration-200 hover:bg-[#1b2638] hover:-translate-y-0.5"
        >
          Explore All Care Options
        </a>

      </div>

    </section>
  );
}