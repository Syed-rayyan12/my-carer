"use client";

import Image from "next/image";
import { CalendarDays, Clock3, Heart, Mail, MapPin, Phone, PoundSterling, ShieldCheck, Star, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type CaregiverProfile = {
  name: string; image: string; desc: string, location: string; gender: string; hourlyRate: string;
  rating: number; reviewCount: number; email: string; phone: string; about: string;
  specializations: string[]; experience: string; availability: string[];
  verification: { certificateNumber: string; lastChecked: string; expires: string };
  qualifications: { title: string; provider: string; date: string }[];
  references: { name: string; role: string; description: string; email: string; phone: string; date: string }[];
};

export const demoCaregiverProfile: CaregiverProfile = {
  name: "Sarah Mitchell", desc: "Sarah Elderly Care Specialist", image: "/images/image-cute.png", location: "Manchester, UK", gender: "Female",
  hourlyRate: "£18.50", rating: 4.9, reviewCount: 45, email: "sarah.mitchell@example.com", phone: "+44 7700 900123",
  about: "I am a compassionate caregiver with over eight years of experience supporting older adults and people living with dementia. I provide personal care, companionship and practical support, helping every person feel comfortable, respected and independent in their own home.",
  specializations: ["Dementia Care", "Elderly Care", "Personal Care", "Companionship"],
  experience: "09 years ", availability: ["Weekdays", "Weekends"],
  verification: { certificateNumber: "DBS-2026-001245", lastChecked: "12 September 2026", expires: "12 September 2027" },
  qualifications: [
    { title: "NVQ Level 3 in Health and Social Care", provider: "City & Guilds", date: "June 2019" },
    { title: "Dementia Care Training", provider: "Skills for Care", date: "March 2024" },
    { title: "First Aid and CPR", provider: "British Red Cross", date: "August 2026" },
  ],
  references: [
    { name: "Margaret Thompson", role: "Medical Professional", description: "Sarah provided exceptional care for my mother over two years. Her patience, kindness and attention to detail made a real difference to our family. I would confidently recommend her to anyone looking for dependable care.", email: "margaret.thompson@example.com", phone: "+44 7700 900456", date: "15 September 2026" },
    { name: "James Wilson", role: "Family Reference", description: "Sarah supported my father with daily routines and companionship. She was always reliable, thoughtful and professional, and helped him feel safe and comfortable at home.", email: "james.wilson@example.com", phone: "+44 7700 900789", date: "28 August 2026" },
  ],
};

export default function CaregiverProfileModal({ open = false, onClose, profile = demoCaregiverProfile, onContact, onFavouriteChange, saved: savedOverride }: {
  open?: boolean;
  onClose: () => void;
  profile?: CaregiverProfile;
  onContact?: (profile: CaregiverProfile) => void;
  onFavouriteChange?: (saved: boolean, profile: CaregiverProfile) => void;
  saved?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [favourites, setFavourites] = useState<Set<string>>(() => new Set());
  const favourite = savedOverride ?? favourites.has(profile.email);
  const profileDetails = [
    { heading: "Hourly Rate", value: `${profile.hourlyRate} / hour`, icon: PoundSterling },
    { heading: "Experience", value: profile.experience, icon: Clock3 },
    { heading: "Location", value: profile.location, icon: MapPin },
    { heading: "Availability", value: profile.availability.join(", ") || "Contact for availability", icon: CalendarDays },
  ];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  function toggleFavourite() {
    const saved = !favourite;
    setFavourites((previous) => {
      const next = new Set(previous);
      if (saved) next.add(profile.email); else next.delete(profile.email);
      return next;
    });
    onFavouriteChange?.(saved, profile);
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={`${id}-title`} onClose={() => { if (open) onClose(); }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[550px] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-nunito text-[14px] font-medium text-[#101929] shadow-2xl backdrop:bg-[#101929]/60">
      <header className="flex items-center justify-between gap-4 border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h2 id={`${id}-title`} className="font-commissioner text-[30px] font-bold leading-tight max-[600px]:text-[24px]">Caregiver Profile</h2>
        <button type="button" aria-label="Close caregiver profile" onClick={() => dialogRef.current?.close()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><X size={23} /></button>
      </header>
      <section aria-label="Profile summary" className="flex items-start justify-between gap-5 border-[#e3e5e8] px-7 py-6 max-[600px]:flex-col max-[600px]:px-4">
        <div className="flex min-w-0 items-center gap-4">
          {profile.image ? <Image src={profile.image} alt={profile.name} width={90} height={90} className="h-[90px] w-[90px] max-[480px]:h-[68px] max-[280px]:w-[68px] shrink-0 rounded-full object-cover" /> : <span className="flex size-[90px] shrink-0 items-center justify-center rounded-full bg-[#e5f1eb] font-nunito text-2xl font-bold text-[#ff2f68] max-[480px]:size-[68px]" aria-label={profile.name}>{profile.name.split(" ").map(part => part[0]).slice(0, 2).join("")}</span>}
          <div className="flex min-w-0 flex-col gap-">
            <h3 className="font-commissioner text-[22px] font-bold">{profile.name}</h3>
            <p className="font-nunito text-[16px] font-normal">{profile.desc}</p>
            {/* <p className="flex items-center gap-1.5 text-[#626b78]"><MapPin size={15} className="shrink-0 text-[#ff2f68]" />{profile.location}</p> */}
            {/* <p className="text-[#626b78]">{profile.gender}</p> */}
            <div className="flex flex-wrap items-center gap-2">

              <Star size={16} className="fill-[#ffae00] text-[#ffae00]" />
              <span className="font-semibold">{profile.rating}</span><span className="text-[13px] text-[#626b78]">({profile.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
        {/* <div className="flex shrink-0 flex-col items-end gap-3 max-[600px]:w-full max-[600px]:items-start">
          <p><span className="font-commissioner text-[25px] font-semibold text-[#ff2f68]">{profile.hourlyRate}</span> <span className="text-[13px] text-[#626b78]">per hour</span></p>
        </div> */}
      </section>
      <section className=" bg-[#FF2F68]/10 px-7 py-5 m-5 rounded-lg max-[600px]:px-4">

        <dl className="grid grid-cols-2 gap-5 max-[400px]:grid-cols-1">
          {profileDetails.map(({ heading, value, icon: Icon }) => (
            <div key={heading} className="flex min-w-0 items-start gap-2.5">
              <div className="min-w-0">
                <dt className="mb-1 font-nunito text-[14.41px] font-semibold text-[#000]">{heading}</dt>
                <div className="flex items-center gap-2.5">
                  <Icon size={20} className="mt-0.5 shrink-0 text-[#ff2f68]" />
                  <dd className="break-words font-nunito text-[14.41px] font-semibold text-[#344054]">{value}</dd>
                </div>
              </div>
            </div>
          ))}
        </dl>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">About Me</h3>
        <p className="leading-[1.8] text-[16px] text-[#626b78]">{profile.about}</p>
      </section>
      {/* <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Specializations</h3>
        <div className="flex flex-wrap gap-2">{profile.specializations.map((item) => <span key={item} className="rounded-full bg-[#ff2f68]/10 px-4 py-2 text-[13px] text-[#ff2f68]">{item}</span>)}</div>
      </section>
      <section className="grid grid-cols-2 gap-5 border-b border-[#e3e5e8] px-7 py-5 max-[600px]:grid-cols-1 max-[600px]:px-4">
        <div><h3 className="mb-3 font-commissioner text-[20px] font-semibold">Experience</h3><p className="flex items-start gap-2 text-[#626b78]"><Clock3 size={19} className="mt-0.5 shrink-0 text-[#ff2f68]" />{profile.experience}</p></div>
        <div><h3 className="mb-3 font-commissioner text-[20px] font-semibold">Availability</h3><div className="flex flex-wrap gap-2">{profile.availability.map((item) => <span key={item} className="rounded-full bg-[#ff2f68]/10 px-4 py-2 text-[13px] text-[#ff2f68]">{item}</span>)}</div></div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">DBS/CRB Check</h3>
        <div className="rounded-[8px] border border-[#13c764]/40 bg-[#13c764]/10 p-4">
          <p className="mb-3 flex items-center gap-2 font-semibold text-[#169b52]"><ShieldCheck size={23} />Verified</p>
          <dl className="grid grid-cols-3 gap-4 text-[13px] max-[600px]:grid-cols-1">
            <div><dt className="mb-1 text-[#626b78]">Certificate Number</dt><dd>{profile.verification.certificateNumber}</dd></div>
            <div><dt className="mb-1 text-[#626b78]">Last Checked</dt><dd>{profile.verification.lastChecked}</dd></div>
            <div><dt className="mb-1 text-[#626b78]">Expires</dt><dd>{profile.verification.expires}</dd></div>
          </dl>
        </div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Qualifications &amp; Training</h3>
        <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">{profile.qualifications.map((item) => (
          <article key={item.title} className="flex flex-col gap-2 rounded-[8px] border border-[#ff2f68]/20 bg-[#ff2f68]/5 p-4">
            <h4 className="font-commissioner text-[16px] font-semibold">{item.title}</h4><p className="text-[13px] text-[#626b78]">{item.provider}</p><p className="mt-auto flex items-center gap-2 pt-1 text-[13px] text-[#626b78]"><CalendarDays size={16} className="text-[#ff2f68]" />{item.date}</p>
          </article>
        ))}</div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">References</h3>
        <div className="space-y-3">{profile.references.map((reference) => (
          <article key={reference.email} className="overflow-hidden rounded-[8px] border border-[#ff2f68]/20 bg-[#ff2f68]/5">
            <div className="p-4"><h4 className="font-commissioner text-[18px] font-semibold">{reference.name}</h4><p className="mt-1 text-[13px] text-[#626b78]">{reference.role}</p><p className="mt-3 leading-[1.8] text-[#626b78]">{reference.description}</p></div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-[#ff2f68]/20 p-4 text-[13px]">
              <a href={`mailto:${reference.email}`} className="flex min-w-0 items-center gap-2 text-[#ff2f68]"><Mail size={16} className="shrink-0" /><span className="break-all">{reference.email}</span></a>
              <a href={`tel:${reference.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-[#ff2f68]"><Phone size={16} />{reference.phone}</a>
              <p className="flex w-full items-center gap-2 text-[#98a0ab]"><CalendarDays size={16} />Provided: {reference.date}</p>
            </div>
          </article>
        ))}</div>
      </section> */}
      {/* <footer className="flex flex-wrap gap-3 px-7 py-5 max-[600px]:px-4">
        <button type="button" onClick={() => { if (onContact) onContact(profile); else window.location.href = `mailto:${profile.email}`; }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] bg-[#ff2f68] px-5 font-nunito text-[14px] font-medium text-white max-[480px]:w-full hover:bg-[#e92359]"><Mail size={18} />Contact Caregiver</button>
        <button type="button" aria-pressed={favourite} onClick={toggleFavourite} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] border border-[#ff2f68] bg-transparent px-5 font-nunito text-[14px] font-medium text-[#ff2f68] max-[480px]:w-full hover:bg-[#fff1f4]"><Heart size={18} fill={favourite ? "currentColor" : "none"} />{favourite ? "Saved to Favourites" : "Save to Favourite"}</button>
      </footer> */}
    </dialog>
  );
}
