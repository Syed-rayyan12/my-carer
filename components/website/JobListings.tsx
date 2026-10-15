"use client";

import { useState } from "react";
import JobProfileModal, { type JobProfile } from "./JobProfileModal";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, MapPin } from "lucide-react";

const jobs = [
  { title: "Dementia Caregiver", place: "Manchester, Greater Manchester", salary: "£17–£20 / hour", tags: ["Dementia Care", "Part Time", "Live-out"], image: "/images/image-cute.png", badge: "New" },
  { title: "Live-in Caregiver", place: "London, UK", salary: "£850–£1,000 / week", tags: ["Elderly Care", "Part Time", "Live-out"], image: "/images/image-cute-2.png" },
  { title: "Personal Care Assistant", place: "Birmingham, UK", salary: "15 hours / week", tags: ["Dementia Care", "Part Time", "Live-out"], image: "/images/image-cute-3.png" },
  { title: "Companion Caregiver", place: "Bristol, UK", salary: "10–15 hours / week", tags: ["Companionship", "Part Time", "Live-out"], image: "/images/image 2 (6).png" },
];

export function JobListings() {
  const [selected, setSelected] = useState<JobProfile | null>(null);
  function openJob(job: (typeof jobs)[number]) {
    // Demo details until job records are connected to a backend.
    const dementia = job.title.includes("Dementia");
    const companion = job.title.includes("Companion");
    setSelected({
      ...job, hourlyRate: dementia ? "\u00a317\u2013\u00a320" : "\u00a318.50", visits: job.title.includes("Live-in") ? "Live-in care with agreed daily breaks" : "Morning and evening visits, 20\u201325 hours per week",
      duration: "3 months", start: "20 October 2026", end: "20 January 2027", age: 78, postedDaysAgo: 2,
      description: dementia ? "An elderly client living with dementia needs compassionate support at home. The client enjoys conversation, familiar routines and gentle walks, and needs help with personal care and daily activities." : "An older adult is looking for a reliable caregiver to provide companionship and practical support at home. The aim is to maintain independence in a comfortable, respectful environment.",
      needs: [dementia ? "Dementia Care" : companion ? "Companionship" : "Personal Care", "Respite Care", "Mobility Support"],
      tasks: ["Support with bathing, dressing and personal hygiene", "Prepare meals and assist with daily routines", "Provide medication reminders as agreed in the care plan", "Offer companionship and help with safe mobility"],
      additionalInfo: "The family will provide a detailed care plan and introduce the successful caregiver to the client. Visit times can be discussed, and clear communication with the family is essential.",
      requirements: ["At least two years of relevant care experience", dementia ? "Experience supporting people living with dementia" : "Experience providing person-centred care", "Current enhanced DBS check and professional references", "Reliable, compassionate and confident communicating in English"],
      email: "care.jobs@example.com", phone: "+44 7700 900654",
    });
  }
  return (
    <section className="mx-auto w-[min(1180px,calc(100%-60px))] pb-10 pt-7 max-[560px]:w-[calc(100%-30px)]">
      <div className="mb-5"><h2 className="font-commissioner text-[30px] font-extrabold leading-tight text-[#101929] max-[520px]:text-[25px]">24 Care Jobs <span className="text-[#ff2f68]">Available</span></h2><p className="mt-1 text-[13px] text-[#596273]">Find opportunities that match your skills and preferences.</p></div>
      <div className="space-y-4">
        {jobs.map((job) => (
          <article key={job.title} className="relative rounded-[12px] bg-white p-5 pr-[185px] shadow-[0_7px_24px_rgba(16,25,41,.14)] max-[650px]:p-4 max-[650px]:pr-4">
            <div className="flex items-center gap-3"><Image src={job.image} alt="" width={62} height={62} className="h-[62px] w-[62px] shrink-0 rounded-full object-cover" /><div><h3 className="font-commissioner text-[18px] font-bold text-[#101929]">{job.title} {job.badge && <span className="ml-1 rounded-full bg-[#ff2f68] px-2 py-0.5 font-nunito text-[10px] text-white">{job.badge}</span>}</h3><p className="flex items-center gap-1 text-[11px] text-[#667085]"><MapPin size={12} className="text-[#ff2f68]" />{job.place}</p></div></div>
            <div className="mt-2 flex flex-wrap gap-2">{job.tags.map((tag) => <span key={tag} className="rounded-full bg-[#fff1f4] px-2.5 py-1 text-[10px] text-[#ff2f68]">{tag}</span>)}<span className="flex items-center gap-1 text-[10px] text-[#667085]"><Clock3 size={12} />20–25 Hours/Week</span></div>
            <p className="mt-3 max-w-[710px] text-[12px] leading-[1.55] text-[#596273]">We are looking for an experienced caregiver to support an elderly client living with dementia. The role includes personal care, companionship and assistance with daily routines.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#596273]">{["2+ Years Experience", "Dementia Experience", "DBS Required"].map((tag) => <span key={tag} className="rounded-full bg-[#f0f1f3] px-2.5 py-1">{tag}</span>)}</div>
            <p className="mt-3 text-[11px] font-bold text-[#475467]">Posted 2 days ago</p>
            <div className="absolute bottom-5 right-5 top-5 flex flex-col items-end justify-between text-right max-[650px]:static max-[650px]:mt-3 max-[650px]:flex-wrap max-[650px]:gap-3 max-[650px]:flex-row max-[650px]:items-center max-[650px]:text-left"><p className="font-commissioner text-[20px] font-extrabold text-[#ff2f68]">{job.salary}</p><button type="button" onClick={() => openJob(job)} className="inline-flex min-h-[38px] items-center gap-2 rounded-[6px] bg-[#ff2f68] px-4 text-[11px] font-bold text-white hover:bg-[#e92359]">View Job Profile <ArrowRight size={13} /></button></div>
          </article>
        ))}
      </div>
      {selected && <JobProfileModal job={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

const profileTypes = [
  { icon: "♧", title: "I’m a Caregiver", subtitle: "Create A Professional Profile To Advertise Your Services", bullets: ["Showcase your qualifications and experience", "Set your hourly rates and availability", "Connect with people who need care", "Upload DBS check and references"], button: "Create Caregiver Profile" },
  { icon: "▦", title: "Local Authority / Agency", subtitle: "Post Care Positions On Behalf Of Your Organization", bullets: ["Advertise specific care roles", "Specify client needs and tasks required", "Set hourly rates and visit schedules", "Find qualified caregivers quickly"], button: "Post A Care Job" },
  { icon: "♡", title: "I Need Care", subtitle: "Post Your Care Needs With Your Own Funding", bullets: ["Showcase your care needs", "Set your hourly rates and availability", "Connect with people who need care", "Upload DBS check and references"], button: "Create Care Profile" },
];

export function JobProfileTypes() {
  return (
    <section id="profile-types" className="mx-auto w-[min(1180px,calc(100%-60px))] pb-[75px] pt-6 max-[560px]:w-[calc(100%-30px)]">
      <div className="mb-7 text-center"><h2 className="font-commissioner text-[32px] font-extrabold text-[#101929] max-[520px]:text-[27px]">Choose Your Profile Type</h2><p className="mt-1 text-[13px] text-[#596273]">Select the option that best describes how you’d like to use My Carer</p></div>
      <div className="grid grid-cols-3 gap-4 max-[850px]:grid-cols-2 max-[560px]:grid-cols-1">
        {profileTypes.map((type, index) => <article key={type.title} className={`flex flex-col items-center rounded-[12px] bg-white p-5 text-center shadow-[0_7px_24px_rgba(16,25,41,.14)] ${index === 1 ? "border border-[#ff2f68]" : ""}`}><span className="mb-3 flex h-[76px] w-[76px] items-center justify-center rounded-full bg-[#fff1f4] text-[35px] text-[#ff2f68]">{type.icon}</span><h3 className="font-commissioner text-[20px] font-bold text-[#101929]">{type.title}</h3><p className="mb-3 mt-1 min-h-[40px] text-[12px] text-[#ff2f68]">{type.subtitle}</p><ul className="mb-4 w-full flex-1 space-y-2 text-left text-[11px] text-[#475467]">{type.bullets.map((bullet) => <li key={bullet} className="before:mr-2 before:content-['•']">{bullet}</li>)}</ul><Link href="/#register" className="inline-flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#ff2f68] px-3 text-[11px] font-bold text-white hover:bg-[#e92359]">{type.button} <ArrowRight size={13} /></Link></article>)}
      </div>
    </section>
  );
}
