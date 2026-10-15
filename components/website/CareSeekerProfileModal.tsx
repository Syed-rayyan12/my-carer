"use client";

import Image from "next/image";
import { CalendarDays, Clock3, Heart, Mail, MapPin, Phone, Star, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type CareSeekerListing = {
  title: string; author: string; date: string; location: string; rate: string;
  budget: string; visits: string; frequency: string; image: string; urgent: boolean; tasks: string[];
};

const reviews = [
  { name: "Sarah J.", date: "5 Jan 2026", text: "Margaret is kind, reliable and really cares. Mum always looks forward to her visits." },
  { name: "Peter D.", date: "22 Dec 2025", text: "Excellent support and very professional. Highly recommended!" },
  { name: "Lucy M.", date: "10 Dec 2025", text: "Such a warm and friendly person. Makes a big difference to our family." },
];

export default function CareSeekerProfileModal({ listing, onClose }: { listing: CareSeekerListing; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [favourite, setFavourite] = useState(false);
  const email = `${listing.author.toLowerCase().replace(/[^a-z]+/g, ".")}@example.com`;
  const phone = "+44 7700 900321";
  const description = listing.title.includes("Bristol")
    ? "My mother needs support with daily activities. She's a lovely, independent lady who needs some help with personal care and medication. Very sociable and enjoys spending time with others."
    : "Looking for an experienced caregiver to provide compassionate care and support at home. We need someone reliable who can help with daily routines and personal care.";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby={`${id}-title`} onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[860px] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-nunito text-[14px] font-medium text-[#101929] shadow-2xl backdrop:bg-[#101929]/60">
      <header className="flex items-center justify-between gap-4 border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h2 id={`${id}-title`} className="font-commissioner text-[30px] font-bold leading-tight max-[600px]:text-[24px]">Care Seeker Profile</h2>
        <button type="button" aria-label="Close care seeker profile" onClick={() => dialogRef.current?.close()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><X size={23} /></button>
      </header>
      <section className="flex items-start justify-between gap-5 border-b border-[#e3e5e8] px-7 py-6 max-[600px]:flex-col max-[600px]:px-4">
        <div className="flex min-w-0 items-start gap-4">
          <Image src={listing.image} alt={listing.author} width={90} height={90} className="h-[90px] w-[90px] max-[480px]:h-[68px] max-[480px]:w-[68px] shrink-0 rounded-full object-cover" />
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="font-commissioner text-[22px] font-bold">{listing.title}</h3>
            <p className="text-[#626b78]">Posted by <span className="text-[#ff2f68]">{listing.author}</span></p>
            <p className="flex items-start gap-1.5 text-[#626b78]"><MapPin size={15} className="mt-0.5 shrink-0 text-[#ff2f68]" />{listing.location}</p>
            <p className="flex items-center gap-1.5 text-[13px] text-[#626b78]"><CalendarDays size={15} className="text-[#ff2f68]" />Posted {listing.date}</p>
            {listing.urgent && <span className="w-fit rounded-full bg-[#ff2f68]/10 px-3 py-1 text-[13px] text-[#ff2f68]">Urgent Care Needed</span>}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 max-[600px]:items-start">
          <p className="font-commissioner text-[22px] font-semibold text-[#ff2f68]">{listing.rate}</p>
          <div className="flex items-center gap-2">
            <button type="button" aria-label={favourite ? "Remove care seeker from favourites" : "Save care seeker to favourites"} aria-pressed={favourite} onClick={() => setFavourite(!favourite)} className="rounded-full p-1 text-[#ff2f68] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><Heart size={23} fill={favourite ? "currentColor" : "none"} /></button>
            <Star size={16} className="fill-[#ffae00] text-[#ffae00]" /><span className="font-semibold">5.0</span><span className="text-[13px] text-[#626b78]">(12 reviews)</span>
          </div>
        </div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Contact Information</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[#ff2f68]">
          <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-2"><Mail size={18} className="shrink-0" /><span className="break-all">{email}</span></a>
          <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2"><Phone size={18} />{phone}</a>
        </div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">About the Care Request</h3><p className="leading-[1.8] text-[#626b78]">{description}</p>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Tasks &amp; Care Requirements</h3>
        <div className="flex flex-wrap gap-2">{listing.tasks.map((task) => <span key={task} className="rounded-full bg-[#ff2f68]/10 px-4 py-2 text-[13px] text-[#ff2f68]">{task}</span>)}</div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Visit Schedule &amp; Funding</h3>
        <div className="grid grid-cols-3 gap-3 max-[600px]:grid-cols-1">
          <div className="rounded-[8px] border border-[#ff2f68]/20 bg-[#ff2f68]/5 p-4"><p className="mb-2 flex items-center gap-2 font-commissioner text-[16px] font-semibold"><Clock3 size={18} className="text-[#ff2f68]" />Visit Duration</p><p className="text-[#626b78]">{listing.visits}</p></div>
          <div className="rounded-[8px] border border-[#ff2f68]/20 bg-[#ff2f68]/5 p-4"><p className="mb-2 flex items-center gap-2 font-commissioner text-[16px] font-semibold"><CalendarDays size={18} className="text-[#ff2f68]" />Frequency</p><p className="text-[#626b78]">{listing.frequency}</p></div>
          <div className="rounded-[8px] border border-[#ff2f68]/20 bg-[#ff2f68]/5 p-4"><h4 className="mb-2 font-commissioner text-[16px] font-semibold">Funding Type</h4><p className="text-[#626b78]">{listing.budget}</p></div>
        </div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Latest Reviews</h3>
        <div className="space-y-3">{reviews.map((review) => <article key={review.name} className="overflow-hidden rounded-[8px] border border-[#ff2f68]/20 bg-[#ff2f68]/5"><div className="p-4"><h4 className="font-commissioner text-[18px] font-semibold">{review.name}</h4><div aria-label="5 out of 5 stars" className="mt-2 flex gap-1 text-[#ffae00]">{[1,2,3,4,5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div><p className="mt-3 leading-[1.8] text-[#626b78]">{review.text}</p></div><p className="flex items-center gap-2 border-t border-[#ff2f68]/20 p-4 text-[13px] text-[#98a0ab]"><CalendarDays size={16} />{review.date}</p></article>)}</div>
      </section>
      <footer className="flex flex-wrap gap-3 px-7 py-5 max-[600px]:px-4">
        <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] bg-[#ff2f68] px-5 font-nunito text-[14px] font-medium text-white max-[480px]:w-full hover:bg-[#e92359]"><Mail size={18} />Contact Care Seeker</a>
        <button type="button" aria-pressed={favourite} onClick={() => setFavourite(!favourite)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[7px] border border-[#ff2f68] bg-transparent px-5 font-nunito text-[14px] font-medium text-[#ff2f68] max-[480px]:w-full hover:bg-[#fff1f4]"><Heart size={18} fill={favourite ? "currentColor" : "none"} />{favourite ? "Saved to Favourites" : "Save to Favourite"}</button>
      </footer>
    </dialog>
  );
}
