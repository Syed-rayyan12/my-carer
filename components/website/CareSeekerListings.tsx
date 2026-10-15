"use client";

import { useState } from "react";
import CareSeekerProfileModal from "./CareSeekerProfileModal";
import Image from "next/image";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import DirectoryPagination from "@/components/website/DirectoryPagination";

const listings = [
  { title: "Care Needed in Bristol, Clifton", author: "Margaret Thompson", date: "12 Jan 2026", location: "Bristol, Clifton (BS8 2PS)", rate: "£18.50 / hour", budget: "Direct Payment", visits: "60 Min Visits", frequency: "2× Daily", image: "/images/image 2 (6).png", urgent: false, tasks: ["Bath & Personal Care", "Administer Medication", "Prepare Meals", "Elderly Care", "Mobility Issues", "+1 more"] },
  { title: "Care Needed in London", author: "David Chen", date: "13 Jan 2026", location: "London, Richmond (TW9 1EJ)", rate: "£22.00 / hour", budget: "Personal Budget", visits: "90 Min Visits", frequency: "2× Daily", image: "/images/image-cute-2.png", urgent: true, tasks: ["Bath & Personal Care", "Dressing Assistance", "Prepare Meals", "Dementia", "Personal Care", "+1 more"] },
  { title: "Care Needed in Manchester", author: "Helen Williams", date: "17 Jan 2026", location: "Manchester, Didsbury (M20 3AB)", rate: "£18.00 / hour", budget: "Personal Budget", visits: "2 Hour Visits", frequency: "1× Daily", image: "/images/image-cute.png", urgent: true, tasks: ["Companionship", "Meal Preparation", "Light Housework", "Elderly Care", "Mobility Support", "+1 more"] },
  { title: "Care Needed in Birmingham", author: "James Parker", date: "15 Jan 2026", location: "Birmingham, Edgbaston (B15 2TT)", rate: "£18.50 / hour", budget: "Direct Payment", visits: "90 Min Visits", frequency: "3× Daily", image: "/images/image 2 (7).png", urgent: false, tasks: ["Mobility Assistance", "Personal Care", "Medication", "Post-Surgery Care", "Mobility Support", "+1 more"] },
];

function ReviewMini({ initials, name, date, children }: { initials: string; name: string; date: string; children: string }) {
  return <div className="rounded-[8px] border border-[#f0f1f3] bg-white p-2 shadow-sm"><div className="flex items-center gap-1.5"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ffe1e9] text-[9px] font-bold text-[#ff2f68]">{initials}</span><span className="min-w-0 text-[10px] leading-tight"><b className="block truncate text-[#101929]">{name}</b><span className="text-[#667085]">{date}</span></span></div><div className="mt-1 text-[9px] leading-[1.35] text-[#667085]">★★★★★</div><p className="mt-1 line-clamp-2 text-[9px] leading-[1.35] text-[#667085]">“{children}”</p></div>;
}

export default function CareSeekerListings() {
  const [selected, setSelected] = useState<(typeof listings)[number] | null>(null);
  return (
    <section className="bg-white pb-5 pt-2">
      <div className="mx-auto grid w-[min(1180px,calc(100%-60px))] grid-cols-2 gap-5 max-[850px]:grid-cols-1 max-[560px]:w-[calc(100%-30px)]">
        {listings.map((listing) => (
          <article key={listing.title} className="rounded-[13px] bg-white p-4 shadow-[0_7px_24px_rgba(16,25,41,.14)] max-[520px]:p-3">
            <div className="flex items-start gap-3 max-[380px]:flex-col">
              <Image src={listing.image} alt="Care seeker" width={74} height={74} className="h-[74px] w-[74px] shrink-0 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><h2 className="font-commissioner text-[19px] font-bold leading-tight text-[#101929]">{listing.title}</h2><p className="text-[12px] text-[#667085]">Posted by <span className="text-[#ff2f68]">{listing.author}</span></p></div>
                  <span className="rounded-full bg-[#ff2f68] px-2.5 py-1 text-[10px] font-bold text-white">Posted {listing.date}</span>
                </div>
                {listing.urgent && <span className="mt-1 inline-flex rounded-full bg-[#ff714f] px-2 py-0.5 text-[9px] font-bold text-white">Urgent</span>}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[13px] text-[#475467]">
              <span className="flex items-center gap-1"><MapPin size={13} className="text-[#ff2f68]" />{listing.location}</span>
              <span className="flex items-center gap-1 text-[#ff2f68]">♥ ♥ ♥ ♥ ♥ <b className="text-[#101929]">5.0</b> <span className="text-[#667085]">(12 reviews)</span></span>
            </div>
            <p className="mt-3 text-[13px] font-semibold text-[#101929]"><span className="text-[#ff2f68]">{listing.rate}</span> <span className="font-normal">({listing.budget})</span></p>
            <div className="mt-2 flex flex-wrap gap-4 text-[10px] text-[#667085]"><span className="flex items-center gap-1"><Clock3 size={12} className="text-[#ff2f68]" />{listing.visits}</span><span className="flex items-center gap-1"><CalendarDays size={12} className="text-[#ff2f68]" />{listing.frequency}</span></div>
            <p className="mt-3 line-clamp-3 text-[14px] leading-[1.65] text-[#475467]">{listing.title.includes("Bristol") ? "My mother needs support with daily activities. She's a lovely, independent lady who needs some help with personal care and medication. Very sociable and enjoys spending time with others." : "Looking for an experienced caregiver to provide compassionate care and support at home. We need someone reliable who can help with daily routines and personal care."}</p>
            <h3 className="mb-1.5 mt-3 text-[12px] font-extrabold text-[#101929]">Tasks Required:</h3>
            <div className="flex flex-wrap gap-1.5">{listing.tasks.map((task) => <span key={task} className="rounded-full bg-[#fff1f4] px-2.5 py-1 text-[12px] text-[#ff2f68]">{task}</span>)}</div>
            <h3 className="mb-1.5 mt-3 text-[12px] font-extrabold text-[#101929]">Latest Reviews:</h3>
            <div className="grid grid-cols-3 gap-2 max-[460px]:grid-cols-1"><ReviewMini initials="SJ" name="Sarah J." date="5 Jan 2026">Margaret is kind, reliable and really cares. Mum always looks forward to her visits.</ReviewMini><ReviewMini initials="PD" name="Peter D." date="22 Dec 2025">Excellent support and very professional. Highly recommended!</ReviewMini><ReviewMini initials="LM" name="Lucy M." date="10 Dec 2025">Such a warm and friendly person. Makes a big difference to our family.</ReviewMini></div>
            <button type="button" onClick={() => setSelected(listing)} className="mt-3 inline-flex min-h-[38px] items-center gap-2 rounded-[6px] bg-[#ff2f68] px-4 text-[12px] font-bold text-white transition-colors hover:bg-[#e92359]">View Profile <ArrowRight size={14} /></button>
          </article>
        ))}
      </div>
      <DirectoryPagination />
      {selected && <CareSeekerProfileModal listing={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
