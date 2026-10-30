"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, CalendarDays, Check, ClipboardList, Clock3, Heart, MapPin, MessageSquare, Star } from "lucide-react";
import { people, activity } from "./dashboardData";
import { useDashboard } from "./DashboardContext";

function SectionHeading({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-4 max-[640px]:flex-wrap">
       <div className="flex min-w-0 flex-col gap-1.5">
      <h2 className="font-commissioner text-[24px] capitalize font-semibold tracking-tight min-[1600px]:text-[7px] max-[640px]:text-sm">{title}</h2>
      {description && <p className="text-[14px] text-[#5E6B65] font-nunito">{description}</p>}
       </div>
       {children && <div className="ml-auto shrink-0">{children}</div>}
    </div>
    
  );
}

function TextButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button className="inline-flex items-center gap-2 whitespace-nowrap text-[14px] capitalize font-normal text-[#FF2F68] hover:underline" onClick={onClick}>{children}<ArrowRight size={15} /></button>;
}

function RecommendedCaregiver({ person, index }: { person: typeof people[number]; index: number }) {
  const { saved, toggleSaved, setSelected } = useDashboard();
  const isSaved = saved.includes(person.name);
  return (
    <article className="rounded-xl border border-[#e6e7eb] p-4 min-[1600px]:p-5">
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <Image className="size-14 rounded-full object-cover" src={person.image} alt={person.name} width={56} height={56} />
          <span className="absolute right-0 bottom-0 rounded-full border-2 border-white bg-[#28b77d] p-0.5 text-white"><Check size={10} strokeWidth={3} /></span>
        </div>
        <div>
          <h3 className="text-[15.9px] font-semibold tracking-tight font-jakarta">{person.name}</h3>
          <p className="my-1 text-[12px] font-nunito text-[#999ca5]">{person.specialty}</p>
          <div className="flex items-center gap-1 text-[10px]"><Star size={14} className="fill-[#ffb443] text-[#ffb443]" /><strong className="font-bold text-[13.91px]">4.9</strong><span className="text-[9px] text-[#979ba5]">({person.reviews} reviews)</span></div>
        </div>
      </div>
      <div className="mt-5 mb-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1 text-[13.91px] font-nunito text-[#878b95]"><MapPin size={14} className="text-[#5E6B65] font-medium" />{person.location}</span>
        <span className="text-[15px] text-[#1B2420] font-normal">&pound;{person.rate}<small className="text-[13.91px] font-normal text-[#1B2420]">/hour</small></span>
      </div>
      <div className="mb-5 flex flex-wrap gap-1.5">{person.tags.map(tag => <span key={tag} className="rounded-xl bg-[#FDF0F7] font-nunito font-medium px-2 py-1 text-[12px] text-black/60 ">{tag}</span>)}</div>
      <div className="flex gap-2">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#ff2f68] px-2 py-2.5 text-[13.91px] font-nunito font-medium text-white hover:bg-[#e92359]" onClick={() => setSelected(index)}>View Profile</button>
        <button className={`flex items-center justify-center gap-1.5 rounded-md border px-2.5 py-2 text-[11px] ${isSaved ? "border-[#ffc4d4] text-[16px] bg-[#fff7fa] text-[#ff2f68]" : "border-[#e1e3e8] text-[#717681]"}`} aria-pressed={isSaved} onClick={() => toggleSaved(person.name)}><Heart size={16} fill={isSaved ? "currentColor" : "none"} />{isSaved ? "Saved" : "Save"}</button>
      </div>
    </article>
  );
}

export default function CareSeekerDashboard() {
  const { saved, search, showPanel } = useDashboard();
  const [greeting, setGreeting] = useState("Good afternoon");
  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");
  }, []);
  const matchingPeople = people.map((person, index) => ({ person, index })).filter(({ person }) => `${person.name} ${person.specialty} ${person.location} ${person.tags.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  const stats = [
    { title: "Active Care Requirements", icon: ClipboardList, action: "View requirements", panel: "My Care Requirements", value: 0 },
    { title: "Saved Caregivers", icon: Heart, action: "View saved caregivers", panel: "Saved Caregivers", value: saved.length },
    { title: "New Messages", icon: MessageSquare, action: "View messages", panel: "Messages", value: 0 },
    { title: "Upcoming Arrangements", icon: CalendarDays, action: "View arrangements", panel: "My Arrangements", value: 0 },
  ];

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-7 max-[1250px]:px-6 max-[640px]:px-4 min-[1600px]:pt-10">
      {/* <div className="mb-5 flex items-center justify-between">
        <div><p className="mb-1 text-[9px] font-extrabold tracking-widest text-[#a0a2aa]">YOUR CARE, CONNECTED</p><h1 className="font-commissioner text-2xl font-semibold tracking-tight">Dashboard Overview</h1></div>
        <span className="flex items-center gap-2 text-[11px] text-[#9598a1] max-[1250px]:hidden"><CalendarDays size={16} />Your care journey starts here</span>
      </div> */}

      <section className="relative mb-6 flex items-center justify-between gap-5 overflow-hidden rounded-xl border border-[#ececf0] bg-white px-7 py-6 max-[850px]:flex-col max-[850px]:items-start max-[640px]:px-5">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] text-[#92949e]"/>
          <h2 className="mb-1.5 font-commissioner text-[42px] font-bold  capitialize tracking-tight">{greeting}, <span className="text-[#ff2f68] text-[42px] font-bold">James!</span></h2>
          <p className="text-[16px] max-w-[700px] text-black/70 font-nunito ">Manage your care requirements, discover caregivers, keep track of your conversations your care arrangements.</p>
        </div>
        <Link className="inline-flex items-center justify-center gap-2 font-medium rounded-lg bg-[#ff2f68] px-5 py-3 text-[14px] font-bold text-white hover:bg-[#e92359]" href="/care-seeker-dashboard/find-caregivers">Find a Caregiver
        <ArrowRight size={18} />
        </Link>
      </section>

      <section className="mb-6 grid grid-cols-4 gap-4 max-[850px]:grid-cols-2 max-[640px]:gap-3" aria-label="Your care statistics">
        {stats.map(({ title, icon: Icon, action, panel, value }) => (
          <article className="rounded-xl font-nunito text-[14px] border border-[#ececf0] bg-white p-5 max-[640px]:p-3.5" key={title}>
            <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#777c87]"><span className="font-nunito text-[12px] text-black">{title}</span><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f5] text-[#ff2f68] max-[1250px]:size-8"><Icon size={21} /></span></div>
            <strong className="mt-2 mb-3 block  font-commissioner text-[#14201D] text-[26px] font-bold">{value}</strong>
            <TextButton onClick={() => showPanel(panel)}>{action}</TextButton>
          </article>
        ))}
      </section>

      <div className="grid grid-cols-[minmax(0,1.85fr)_minmax(280px,1fr)] gap-6 max-[1250px]:grid-cols-1">
        <section className="min-w-0 rounded-xl border border-[#ececf0] bg-white p-5 max-[640px]:p-4">
          <SectionHeading title="Caregivers recommended for you" description="Based on your care requirements, location and preferences."><Link className="inline-flex items-center gap-2 whitespace-nowrap text-[14.4px] font-medium text-[#ff2f68] capitalize" href="/care-seeker-dashboard/find-caregivers">View all caregivers<ArrowRight size={16} /></Link></SectionHeading>
          <div className="grid grid-cols-2 gap-3.5 max-[850px]:grid-cols-1">
            {matchingPeople.length ? matchingPeople.map(({ person, index }) => <RecommendedCaregiver key={person.name} person={person} index={index} />) : <p className="col-span-full py-6 text-center text-[#858891]">No recommended caregivers match your search.</p>}
          </div>
        </section>

        <section className="min-w-0 rounded-xl border border-[#ececf0] bg-white p-5 max-[1250px]:row-start-3 max-[640px]:p-4">
          <SectionHeading title="Recent Activity"></SectionHeading>
          <div className="flex flex-col max-[1250px]:grid max-[1250px]:grid-cols-2 max-[1250px]:gap-4 max-[850px]:grid-cols-1">
            {activity.map(({ icon: Icon, text, time }) => <div className="flex items-start gap-3 border-b border-[#f0f0f3] py-3 first:pt-0 last:border-0 last:pb-0 max-[1250px]:border-0 max-[1250px]:py-0" key={text}><span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff0f5] font-nunito text-[14.4px] text-[#ff2f68]"><Icon size={17} /></span><div><p className="max-w-[230px] text-[14.4px] font-nunito font-semibold leading-relaxed max-[1250px]:max-w-none">{text}</p><small className="text-[12.4px] text-black/80">{time}</small></div></div>)}
          </div>
        </section>

        <section className="min-w-0">
          <SectionHeading title="My Active Care Requirements" />
          <article className="rounded-xl border border-[#ececf0] bg-white p-5 max-[640px]:p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-jakarta text-[18.51px] font-semibold">Compassionate elderly care for my mother</h3>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#ecf9f0] px-3 py-1 font-nunito text-xs text-[#3c9c68]"><span className="size-1.5 rounded-full bg-[#3c9c68]" />Active</span>
            </div>
            <div className="mt-4 mb-5 flex flex-wrap gap-5 font-nunito text-[14.4px] font-normal text-[#838893] max-[850px]:gap-3">
              <span className="flex items-center gap-1"><MapPin size={15} className="text-[#a7abb4]" />Manchester</span><span className="flex items-center gap-1"><CalendarDays size={15} className="text-[#a7abb4]" />Monday to Friday</span><span className="flex items-center gap-1"><Clock3 size={15} className="text-[#a7abb4]" />&pound;18/hour</span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-[#ececf0] pt-3.5 max-[850px]:flex-col max-[850px]:items-start">
              <div className="flex items-center gap-2"><div className="flex -space-x-1.5">{[...people, { name: "Catherine Walsh", image: "/images/image-cute-3.png" }].map(person => <Image className="size-7 rounded-full border-2 border-white object-cover" key={person.name} src={person.image} alt={person.name} width={28} height={28} />)}<span className="flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#fff0f5] text-[8px] font-extrabold text-[#ff2f68]">+1</span></div><p className="text-[9px] text-[#9297a1]"><strong className="font-bold text-[14px] text-[#1B2420]">4 caregivers responded</strong> </p></div>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#d9dde3] bg-transparent px-4 py-2 font-nunito text-[14.4px] font-semibold text-black hover:bg-gray-50" onClick={() => showPanel("Caregiver Responses")}>View responses<ArrowRight size={16} className="text-black" /></button>
            </div>
          </article>
        </section>

        <section className="min-w-0 rounded-xl border border-[#ececf0] bg-white p-5 max-[1250px]:row-start-4 max-[640px]:p-4">
          <div className="mb-4 border-b border-[#ececf0] pb-1"><SectionHeading title="Recent Reviews"><TextButton onClick={() => showPanel("My Reviews")}>View all</TextButton></SectionHeading></div>
          <div className="flex gap-1 text-[#F5A524]" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={15} fill="currentColor" />)}</div>
          <p className="mt-3 mb-5 text-[14px] font-jakarta leading-loose text-black">&ldquo;Sarah has been absolutely wonderful with my mother. So patient, caring and reliable. We couldn&apos;t be happier!&rdquo;</p>
          <div className="flex items-center justify-between gap-2">
            <span className="font-jakarta text-[12px] font-semibold text-[#344054]">James Wilson</span>
            <time className="whitespace-nowrap font-jakarta text-[12px] font-normal text-[#667085]">2 days ago</time>
          </div>

        </section>
      </div>
      <footer className="flex items-center justify-between gap-3 py-6 text-[9px] text-[#a4a7af] max-[850px]:flex-col max-[850px]:items-start"><span>&copy; {new Date().getFullYear()} My Carer. A little care makes a big difference.</span><Link className="flex items-center gap-1.5 text-[#9398a2]" href="/contact">Need a hand? We&apos;re here to help<ArrowRight size={13} /></Link></footer>
    </main>
  );
}
