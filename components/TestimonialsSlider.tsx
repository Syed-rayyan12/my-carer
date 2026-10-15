"use client";

const testimonialsTop = [
  {
    name: "Sofia Marchetti",
    location: "Studio Collector, Milan, IT",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Daniel Osei",
    location: "Interior Designer, London, UK",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Amelia Hart",
    location: "Homeowner, Bristol, UK",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "James Wilson",
    location: "Family Member, Birmingham, UK",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Sarah Mitchell",
    location: "Care Seeker, Manchester, UK",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Olivia Brown",
    location: "Family Member, Leeds, UK",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80",
  },
];

const testimonialsBottom = [
  {
    name: "Michael Thompson",
    location: "Care Seeker, London, UK",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Emma Johnson",
    location: "Family Member, Bristol, UK",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "David Williams",
    location: "Care Seeker, Manchester, UK",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Charlotte Davis",
    location: "Family Member, Oxford, UK",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Robert Taylor",
    location: "Care Seeker, Birmingham, UK",
    image:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=100&q=80",
  },
  {
    name: "Grace Anderson",
    location: "Family Member, Liverpool, UK",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=100&q=80",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: {
    name: string;
    location: string;
    image: string;
  };
}) {
  return (
    <article  className="max-[900px]:basis-[320px] max-[900px]:w-[320px] max-[600px]:basis-[290px] max-[600px]:w-[290px] max-[600px]:min-h-[205px] max-[600px]:p-[21px] [flex:0_0_350px] w-[350px] min-h-[225px] p-[25px] flex flex-col border border-[#dedfe3] rounded-[10px] bg-[#fff] shadow-[0_7px_25px_rgba(16,_25,_41,_0.08)]">

      <div  className="flex items-start justify-between mb-[20px]">

        <div  className="flex gap-[3px] text-[#d6a03c] text-[17px]">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>☆</span>
        </div>

        <div  className="text-[#ff2f68] font-georgia text-[55px] leading-[0.65]">
          “
        </div>

      </div>

      <p  className="max-[600px]:text-[13px] [flex:1] m-[0_0_24px] text-[#3f4650] font-nunito text-[14px] leading-[1.65]">
        It is a long established fact that a reader will be
        distracted by the readable content of a page when looking
        at its layout.
      </p>

      <div  className="flex items-center gap-[11px]">

        <img className="w-[43px] h-[43px] shrink-0 rounded-[50%] object-cover"
          src={testimonial.image}
          alt={testimonial.name}
        />

        <div>
          <strong className="block mb-[2px] text-[#101929] font-commissioner text-[14px] font-semibold max-[600px]:text-[13px]">{testimonial.name}</strong>

          <span className="block text-[#ff2f68] text-[11px] leading-[1.3] max-[600px]:text-[12px]">{testimonial.location}</span>
        </div>

      </div>

    </article>
  );
}

export default function TestimonialsSlider() {
  return (
    <div  className="max-[600px]:mt-[30px] relative w-full mt-[45px] overflow-hidden">

      {/* =====================================================
          ROW 1 — MOVES LEFT
      ====================================================== */}

      <div  className="before:content-[''] before:absolute before:top-[0] before:bottom-[0] before:w-[140px] before:z-[5] before:pointer-events-none after:content-[''] after:absolute after:top-[0] after:bottom-[0] after:w-[140px] after:z-[5] after:pointer-events-none before:left-[0] before:bg-[linear-gradient(_90deg,_#fff_0%,_rgba(255,_255,_255,_0)_100%_)] after:right-[0] after:bg-[linear-gradient(_270deg,_#fff_0%,_rgba(255,_255,_255,_0)_100%_)] max-[600px]:mb-[12px] max-[600px]:before:w-[20px] max-[600px]:after:w-[20px] group/style1 relative w-full overflow-hidden p-[6px_0] mb-[16px]">

        <div  className="group-hover/style1:[animation-play-state:paused] animate-[testimonialMoveLeft_38s_linear_infinite] max-[900px]:[animation-duration:32s] max-[600px]:[animation-duration:28s] flex w-[max-content] [will-change:transform]">

          <div  className="max-[600px]:gap-[12px] max-[600px]:pr-[12px] flex items-stretch gap-[16px] pr-[16px]">

            {testimonialsTop.map((testimonial, index) => (
              <TestimonialCard
                key={`top-one-${index}`}
                testimonial={testimonial}
              />
            ))}

          </div>

          {/* DUPLICATE FOR INFINITE LOOP */}

          <div
             className="max-[600px]:gap-[12px] max-[600px]:pr-[12px] flex items-stretch gap-[16px] pr-[16px]"
            aria-hidden="true"
          >

            {testimonialsTop.map((testimonial, index) => (
              <TestimonialCard
                key={`top-two-${index}`}
                testimonial={testimonial}
              />
            ))}

          </div>

        </div>

      </div>


      {/* =====================================================
          ROW 2 — MOVES RIGHT
      ====================================================== */}

      <div  className="before:content-[''] before:absolute before:top-[0] before:bottom-[0] before:w-[140px] before:z-[5] before:pointer-events-none after:content-[''] after:absolute after:top-[0] after:bottom-[0] after:w-[140px] after:z-[5] after:pointer-events-none before:left-[0] before:bg-[linear-gradient(_90deg,_#fff_0%,_rgba(255,_255,_255,_0)_100%_)] after:right-[0] after:bg-[linear-gradient(_270deg,_#fff_0%,_rgba(255,_255,_255,_0)_100%_)] max-[600px]:mb-[12px] max-[600px]:before:w-[55px] max-[600px]:after:w-[55px] group/style2 relative w-full overflow-hidden p-[6px_0] mb-[16px]">

        <div  className="group-hover/style2:[animation-play-state:paused] animate-[testimonialMoveRight_42s_linear_infinite] max-[900px]:[animation-duration:36s] max-[600px]:[animation-duration:32s] flex w-[max-content] [will-change:transform]">

          {/* START WITH DUPLICATE */}

          <div  className="max-[600px]:gap-[12px] max-[600px]:pr-[12px] flex items-stretch gap-[16px] pr-[16px]">

            {testimonialsBottom.map((testimonial, index) => (
              <TestimonialCard
                key={`bottom-one-${index}`}
                testimonial={testimonial}
              />
            ))}

          </div>

          {/* DUPLICATE */}

          <div
             className="max-[600px]:gap-[12px] max-[600px]:pr-[12px] flex items-stretch gap-[16px] pr-[16px]"
            aria-hidden="true"
          >

            {testimonialsBottom.map((testimonial, index) => (
              <TestimonialCard
                key={`bottom-two-${index}`}
                testimonial={testimonial}
              />
            ))}

          </div>

        </div>

      </div>

    </div>
  );
}