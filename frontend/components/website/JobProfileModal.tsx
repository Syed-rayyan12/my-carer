"use client";

import Image from "next/image";
import { CalendarDays, Check, Clock3, Heart, Mail, MapPin, Phone, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type JobProfile = {
  title: string; place: string; salary: string; tags: string[]; image: string; badge?: string;
  hourlyRate: string; visits: string; duration: string; start: string; end: string;
  description: string; age: number; needs: string[]; tasks: string[];
  additionalInfo: string; requirements: string[]; email: string; phone: string; postedDaysAgo: number;
};

export default function JobProfileModal({ job, onClose }: { job: JobProfile; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [saved, setSaved] = useState(false);

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
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[780px] overflow-y-auto rounded-[14px] border-0 bg-white p-0 font-nunito text-[14px] font-medium text-[#101929] shadow-2xl backdrop:bg-[#101929]/60">
      <header className="flex items-center justify-between gap-4 border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h2 id={`${id}-title`} className="font-commissioner text-[28px] font-bold leading-tight max-[600px]:text-[23px]">{job.title}</h2>
        <button type="button" aria-label="Close job profile" onClick={() => dialogRef.current?.close()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]"><X size={23} /></button>
      </header>
      <section aria-label="Job summary" className="border-b border-[#e3e5e8] px-7 py-6 max-[600px]:px-4">
        <div className="rounded-[10px] border border-[#ff2f68]/20 bg-[#fff1f4] p-5 max-[480px]:p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <Image src={job.image} alt={job.title} width={76} height={76} className="h-[76px] w-[76px] max-[380px]:h-[56px] max-[380px]:w-[56px] shrink-0 rounded-full object-cover" />
              <div><p className="mb-1 text-[13px] text-[#626b78]">Hourly Rate</p><p><strong className="font-commissioner text-[25px] max-[480px]:text-[22px] font-bold text-[#ff2f68]">{job.hourlyRate}</strong><span className="text-[13px] text-[#626b78]"> /hour</span></p></div>
            </div>
            {job.badge && <span className="rounded-full bg-[#d91c54] px-3 py-1 font-nunito text-[12px] font-semibold text-white">{job.badge}</span>}
          </div>
          <div className="mt-5 flex flex-col gap-3 text-[#626b78]"><p className="flex items-start gap-2"><MapPin size={18} className="mt-0.5 shrink-0 text-[#ff2f68]" />{job.place}</p><p className="flex items-start gap-2"><Clock3 size={18} className="mt-0.5 shrink-0 text-[#ff2f68]" />{job.visits}</p></div>
          <p className="mt-4 flex items-center gap-2 text-[13px] text-[#98a0ab]"><CalendarDays size={16} />Posted {job.postedDaysAgo} {job.postedDaysAgo === 1 ? "day" : "days"} ago</p>
        </div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Duration &amp; Dates</h3>
        <dl className="grid grid-cols-3 gap-4 max-[480px]:grid-cols-1">
          <div><dt className="mb-1 text-[13px] text-[#98a0ab]">Duration</dt><dd>{job.duration}</dd></div>
          <div><dt className="mb-1 text-[13px] text-[#98a0ab]">Start Date</dt><dd>{job.start}</dd></div>
          <div><dt className="mb-1 text-[13px] text-[#98a0ab]">End Date</dt><dd>{job.end}</dd></div>
        </dl>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">About the Client</h3><p className="leading-[1.8] text-[#626b78]">{job.description}</p>
        <p className="mt-4"><span className="text-[#626b78]">Age: </span>{job.age} years</p>
        <h4 className="mb-2 mt-4 font-commissioner text-[16px] font-semibold">Client Needs</h4>
        <div className="flex flex-wrap gap-2">{job.needs.map((need) => <span key={need} className="rounded-full bg-[#ff2f68]/10 px-4 py-2 text-[13px] text-[#ff2f68]">{need}</span>)}</div>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Tasks Required</h3>
        <ul className="space-y-3">{job.tasks.map((task) => <li key={task} className="flex items-start gap-2.5 text-[#626b78]"><Check size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#13c764]" />{task}</li>)}</ul>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Additional Information</h3><p className="leading-[1.8] text-[#626b78]">{job.additionalInfo}</p><p className="mt-3 text-[#626b78]">Advertised arrangement: <span className="text-[#101929]">{job.salary}</span></p>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Requirements</h3>
        <ul className="space-y-3">{job.requirements.map((requirement) => <li key={requirement} className="flex items-start gap-2.5 text-[#626b78]"><Check size={18} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#13c764]" />{requirement}</li>)}</ul>
      </section>
      <section className="border-b border-[#e3e5e8] px-7 py-5 max-[600px]:px-4">
        <h3 className="mb-3 font-commissioner text-[20px] font-semibold">Contact Information</h3>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[#ff2f68]"><a href={`mailto:${job.email}`} className="flex min-w-0 items-center gap-2"><Mail size={18} className="shrink-0" /><span className="break-all">{job.email}</span></a><a href={`tel:${job.phone.replace(/\s/g, "")}`} className="flex items-center gap-2"><Phone size={18} />{job.phone}</a></div>
      </section>
      <footer className="flex flex-col items-center gap-3 px-7 py-6 max-[600px]:px-4">
        <a href={`mailto:${job.email}?subject=${encodeURIComponent(`Application for ${job.title}`)}`} className="inline-flex min-h-11 w-full max-w-[340px] items-center justify-center gap-2 rounded-[7px] bg-[#ff2f68] px-5 font-nunito text-[14px] font-medium text-white max-[480px]:w-full hover:bg-[#e92359]"><Mail size={18} />Apply for This Job</a>
        <button type="button" aria-pressed={saved} onClick={() => setSaved(!saved)} className="inline-flex min-h-11 w-full max-w-[340px] items-center justify-center gap-2 rounded-[7px] border border-[#ff2f68] bg-transparent px-5 font-nunito text-[14px] font-medium text-[#ff2f68] max-[480px]:w-full hover:bg-[#fff1f4]"><Heart size={18} fill={saved ? "currentColor" : "none"} />{saved ? "Job Saved" : "Save Job"}</button>
      </footer>
    </dialog>
  );
}
