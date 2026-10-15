"use client";

import { useState } from "react";
import CaregiverProfileModal, { demoCaregiverProfile } from "./CaregiverProfileModal";
import { MapPin, ArrowRight, Check } from "lucide-react";
import DirectoryPagination from "@/components/website/DirectoryPagination";

const caregivers = [
  { name: "Sarah Mitchell", rate: "£18.50 / hour", location: "Manchester, UK", image: "/images/image-cute.png", score: "4.9" },
  { name: "Michael O’Connor", rate: "£16 / hour", location: "London, UK", image: "/images/image-cute-2.png", score: "4.9" },
  { name: "Catherine Walsh", rate: "£19 / hour", location: "Edinburgh, UK", image: "/images/image-cute-3.png", score: "4.9" },
  { name: "Sarah Mitchell", rate: "£18.50 / hour", location: "Manchester, UK", image: "/images/image 2 (6).png", score: "4.9" },
  { name: "Michael O’Connor", rate: "£16 / hour", location: "London, UK", image: "/images/image 2 (7).png", score: "4.9" },
  { name: "Alex Smith", rate: "£18.50 / hour", location: "Edinburgh, UK", image: "/images/image 2 (8).png", score: "4.9" },
];

export default function CaregiverDirectory() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : caregivers[selectedIndex];
  return (
    <section className="bg-white pb-6 pt-4">
      <div className="mx-auto grid w-[calc(100%-60px)] max-w-[1180px] grid-cols-3 gap-5 max-[1200px]:w-[calc(100%-50px)] max-[1200px]:gap-4 max-[900px]:w-[calc(100%-40px)] max-[900px]:grid-cols-2 max-[900px]:gap-[18px] max-[650px]:w-[calc(100%-30px)] max-[650px]:grid-cols-1 max-[650px]:gap-5">
        {caregivers.map((person, index) => (
          <article
            className="group/card w-full overflow-hidden p-2 rounded-[14.1px] border border-[#e3e5e8] bg-white shadow-[0_12px_30px_rgba(16,25,41,0.10)] transition-[transform,box-shadow] duration-500 transition-all  hover:-translate-y-[8px] hover:shadow-[0_18px_40px_rgba(16,25,41,0.15)]"
            key={`${person.name}-${index}`}
          >

            {/* IMAGE */}

            <div className="relative h-[318px] p-0 w-full overflow-hidden  max-[1200px]:h-[290px] max-[900px]:h-[270px] max-[650px]:h-[310px] max-[420px]:h-[275px]">

              <img
                src={person.image}
                alt={person.name}
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
                {person.rate}
              </div>


              {/* NAME */}

              <h3 className="mt-0 mb-[7px] text-[#00171F] font-commissioner text-[22px] font-bold leading-[1.25] max-[900px]:text-[19px]">
                {person.name}
              </h3>


              {/* LOCATION */}

              <div className="flex items-center gap-1.5 mb-[13px] text-[#4e5763] font-nunito text-xs leading-[1.4]">

                <MapPin size={14} className="shrink-0 text-[#FF2F68]" />

                <span className="text-[#00171F]">
                  {person.location}
                </span>

              </div>


              {/* TAGS */}

              <div className="flex flex-wrap gap-1.5 mb-[13px]">

                {["Dementia Care", "Elderly Care", "Personal Care"].map((tag) => (
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
                  {person.score}
                </span>

              </div>


              {/* BUTTON */}

              <button type="button" onClick={() => setSelectedIndex(index)}
                className="group/profile w-[152px]  min-h-[43px] px-[15px] inline-flex items-center justify-center gap-[9px] bg-[#ff2f68] rounded-[7px] text-white font-nunito text-[14px] font-normal transition-[background-color,transform] duration-500 transition-all hover:bg-[#e92359] hover:-translate-y-0.5"
              >
                <span>
                  View Profile
                </span>

                <ArrowRight size={17} className="transition-transform duration-200 group-hover/profile:translate-x-[3px]" />

              </button>

            </div>

          </article>
        ))}
      </div>
      <DirectoryPagination />
      <CaregiverProfileModal open={selected !== null} onClose={() => setSelectedIndex(null)} profile={selected ? {
        ...demoCaregiverProfile, name: selected.name, image: selected.image, location: selected.location,
        hourlyRate: selected.rate.split(" / ")[0], rating: Number(selected.score),
        gender: selected.name.startsWith("Michael") || selected.name.startsWith("Alex") ? "Male" : "Female",
        email: selected.name.toLowerCase().replace(/[^a-z]+/g, ".") + "@example.com",
        about: selected.name + " is a compassionate caregiver providing personal care, companionship and everyday support. They help people feel comfortable, respected and independent at home.",
      } : demoCaregiverProfile} />
    </section>
  );
}
