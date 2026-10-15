import { MapPin, ArrowRight, Check } from "lucide-react";

const caregivers = [
  {
    name: "Sarah Mitchell",
    price: "£18.50 / hour",
    location: "Manchester, UK",
    image:
      "images/image-cute.png",
    rating: "4.9",
    tags: ["Dementia Care", "Elderly Care", "Personal Care"],
  },
  {
    name: "Michael O'Connor",
    price: "£16 / hour",
    location: "London, UK",
    image:
      "/images/image-cute-2.png",
    rating: "4.9",
    tags: ["Dementia Care", "Elderly Care", "Personal Care"],
  },
  {
    name: "Catherine Walsh",
    price: "£19 / hour",
    location: "Edinburgh, UK",
    image:
      "/images/image-cute-3.png",
    rating: "4.9",
    tags: ["Dementia Care", "Elderly Care", "Personal Care"],
  },
];

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
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "-18px", "--r": "-18deg", "--d": "0s" } as React.CSSProperties} />
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "20px", "--r": "16deg", "--d": "0.8s" } as React.CSSProperties} />
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "-6px", "--r": "-8deg", "--d": "1.6s" } as React.CSSProperties} />
              <img src="/images/heart.png" alt="" className="heart-mini" style={{ "--x": "28px", "--r": "22deg", "--d": "2.4s" } as React.CSSProperties} />

              {/* asli heart */}
              <img src="/images/heart.png" alt="" className="heart-main relative" />
            </span>
          </span>
        </h2>

      </div>


      {/* =====================================================
          CAREGIVER CARDS
      ====================================================== */}

      <div className="mx-auto grid w-[calc(100%-60px)] max-w-[1180px] grid-cols-3 gap-5 max-[1200px]:w-[calc(100%-50px)] max-[1200px]:gap-4 max-[900px]:w-[calc(100%-40px)] max-[900px]:grid-cols-2 max-[900px]:gap-[18px] max-[650px]:w-[calc(100%-30px)] max-[650px]:grid-cols-1 max-[650px]:gap-5">

        {caregivers.map((caregiver) => (
          <article
            className="group/card w-full overflow-hidden p-2 rounded-[14.1px] border border-[#e3e5e8] bg-white shadow-[0_12px_30px_rgba(16,25,41,0.10)] transition-[transform,box-shadow] duration-500 transition-all  hover:-translate-y-[8px] hover:shadow-[0_18px_40px_rgba(16,25,41,0.15)]"
            key={caregiver.name}
          >

            {/* IMAGE */}

            <div className="relative h-[318px] p-0 w-full overflow-hidden  max-[1200px]:h-[290px] max-[900px]:h-[270px] max-[650px]:h-[310px] max-[420px]:h-[275px]">

              <img
                src={caregiver.image}
                alt={caregiver.name}
                className="block w-full h-full rounded-tl-[12px] rounded-tr-[12px] object-cover object-center transition-transform duration-500 "
              />

              {/* VERIFIED BADGE */}

              <div className="absolute top-3 left-3 flex items-center text-[#000] gap-[5px] rounded-[20px] bg-white px-2.5 py-1.5 font-nunito text-[20px] leading-none font-semibold ">

                <Check size={13} strokeWidth={2.5} className="text-[#13C764]" />

                <span className="font-nunito text-[#13C764] font-normal text-[14px]">
                  DBS/CRB Verified
                </span>


              </div>

            </div>


            {/* CONTENT */}

            <div className="px-1 pt-5 pb-[21px]">

              {/* PRICE */}

              <div className="mb-[5px] text-[#FF2F68] font-nunito text-[16px] font-bold leading-[1.3]">
                {caregiver.price}
              </div>


              {/* NAME */}

              <h3 className="mt-0 mb-[7px] text-[#00171F] font-commissioner text-[22px] font-bold leading-[1.25] max-[900px]:text-[19px]">
                {caregiver.name}
              </h3>


              {/* LOCATION */}

              <div className="flex items-center gap-1.5 mb-[13px] text-[#4e5763] font-nunito text-xs leading-[1.4]">

                <MapPin size={14} className="shrink-0 text-[#FF2F68]" />

                <span className="text-[#00171F]">
                  {caregiver.location}
                </span>

              </div>


              {/* TAGS */}

              <div className="flex flex-wrap gap-1.5 mb-[13px]">

                {caregiver.tags.map((tag) => (
                  <span key={tag} className="px-[9px] py-1.5 bg-[#eef0f2] rounded-[15px] text-[#101929] font-nunito text-[12px] font-normal leading-none max-[420px]:text-[12px]">
                    {tag}
                  </span>
                ))}

              </div>


              {/* RATING */}

              <div className="flex items-center gap-[7px] mb-[15px]">

                <div className="text-[#FFAE00] font-arial text-[16px] tracking-[1px] leading-none">
                  ★★★★★
                </div>

                <span className="text-[#FFAE00]">
                  {caregiver.rating}
                </span>

              </div>


              {/* BUTTON */}

              <a
                href="#"
                className="group/profile w-[152px]  min-h-[43px] px-[15px] inline-flex items-center justify-center gap-[9px] bg-[#ff2f68] rounded-[7px] text-white font-nunito text-[14px] font-normal transition-[background-color,transform] duration-500 transition-all hover:bg-[#e92359] hover:-translate-y-0.5"
              >
                <span>
                  View Profile
                </span>

                <ArrowRight size={17} className="transition-transform duration-200 group-hover/profile:translate-x-[3px]" />

              </a>

            </div>

          </article>
        ))}

      </div>


      {/* =====================================================
          EXPLORE BUTTON
      ====================================================== */}

      <div className="flex justify-center mt-[30px]">

        <a
          href="#"
          className="min-h-[45px] px-[22px] transition-all inline-flex items-center justify-center bg-[#101929] rounded-[5px] text-white font-nunito text-[16px] font-normal transition-[background-color,transform] duration-200 hover:bg-[#1b2638] hover:-translate-y-0.5"
        >
          Explore All Care Options
        </a>

      </div>

    </section>
  );
}