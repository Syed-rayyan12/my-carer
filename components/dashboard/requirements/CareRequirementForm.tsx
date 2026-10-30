"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { useCareRequirements, type CareRequirement, type RequirementInput } from "./CareRequirementsContext";

const careTypes = ["Dementia Care", "Elderly Care", "Personal Care", "Companionship", "Respite Care", "Post-surgery Support", "Live-in Care", "Child Care", "Other"];
const additionalPreferences = ["Dementia experience", "Mobility assistance", "Personal care", "Medication support", "Companionship", "Live-in care"];

function ChoiceGroup({ legend, options, selected, onSelect, multiple = false }: { legend: string; options: string[]; selected: string[]; onSelect: (value: string) => void; multiple?: boolean }) {
  return (
    <fieldset>
      <legend className="mb-1.5 font-nunito text-base font-semibold text-black">{legend}</legend>
      <div className="flex flex-wrap gap-2">{options.map(option => {
        const active = selected.includes(option);
        return <button key={option} type="button" aria-pressed={active} className={`inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-full border px-4 py-1.5 font-nunito text-base font-medium transition-colors ${active ? "border-[#ff2f68] bg-[#ffebf1] text-[#ff2f68]" : "border-[#e5e2dc] bg-white text-[#64716b] hover:border-[#ff9bb5]"}`} onClick={() => onSelect(option)}>{multiple && active && <Check size={15} />}{option}</button>;
      })}</div>
    </fieldset>
  );
}

export default function CareRequirementForm({ requirement }: { requirement?: CareRequirement }) {
  const router = useRouter();
  const { createRequirement, updateRequirement, storageError, ready } = useCareRequirements();
  const [careType, setCareType] = useState(requirement?.careType ?? "");
  const [location, setLocation] = useState(requirement?.location ?? "");
  const [recipient, setRecipient] = useState(requirement?.recipient ?? "Parent");
  const [startDate, setStartDate] = useState(requirement?.startDate ?? "");
  const [frequency, setFrequency] = useState(requirement?.frequency ?? "Weekly");
  const [times, setTimes] = useState(requirement?.preferredTimes ?? ["Morning"]);
  const [hours, setHours] = useState(requirement?.hours ?? "");
  const [budget, setBudget] = useState(requirement?.budget ?? "20");
  const [description, setDescription] = useState(requirement?.description ?? "");
  const [preferences, setPreferences] = useState(requirement?.preferences ?? []);
  const [error, setError] = useState("");

  function togglePreference(value: string) { setPreferences(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]); }
  function toggleTime(value: string) { setTimes(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]); }

  return (
    <form className="overflow-hidden rounded-[11px] border border-[#d9d9d9] bg-white" onSubmit={event => {
      event.preventDefault();
      if (!ready) return;
      if (!location.trim()) { setError("Please enter a location."); return; }
      if (!times.length) { setError("Please choose at least one preferred time."); return; }
      if (!/^\d+(?:\.\d{1,2})?(?:[–-]\d+(?:\.\d{1,2})?)?$/.test(budget.trim()) || budget.trim().split(/[–-]/).some(value => Number(value) <= 0)) { setError("Enter a positive hourly budget, such as 20 or 18–22."); return; }
      const recipientName = ({ Myself: "Myself", Parent: "Mum", Partner: "My Partner", Child: "My Child", Other: "a Loved One" } as Record<string, string>)[recipient];
      const unchangedSchedule = requirement && requirement.frequency === frequency && requirement.hours === hours && requirement.preferredTimes.join() === times.join();
      const input: RequirementInput = {
        title: requirement && requirement.careType === careType && requirement.recipient === recipient ? requirement.title : `${careType} for ${recipientName}`,
        careType, location: location.trim(), recipient, startDate, frequency, preferredTimes: times, hours, budget: budget.trim(), description: description.trim(), preferences,
        schedule: unchangedSchedule ? requirement.schedule : `${frequency}: ${times.join(", ")} · ${hours} hours per visit`,
      };
      if (requirement) updateRequirement(requirement.id, input); else createRequirement(input);
      router.push("/care-seeker-dashboard/care-requirements");
    }}>
      <div className="grid grid-cols-2 gap-x-6 gap-y-6 px-5 pt-7 pb-9 max-[700px]:grid-cols-1">
        <label className="flex min-w-0 flex-col gap-1.5 font-nunito text-base font-semibold text-black" htmlFor="requirement-care-type">What type of care do you need?
          <select id="requirement-care-type" className="h-[46px] w-full appearance-none rounded-lg border border-[#e5e2dc] bg-white px-3.5 font-nunito text-sm font-normal text-[#525252] outline-none focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" required value={careType} onChange={event => setCareType(event.target.value)}><option value="" disabled aria-label="Choose a care type" />{careTypes.map(type => <option key={type} value={type}>{type}</option>)}</select>
        </label>
        <label className="flex min-w-0 flex-col gap-1.5 font-nunito text-base font-semibold text-black" htmlFor="requirement-location">Location
          <input id="requirement-location" className="h-[46px] w-full rounded-lg border border-[#e5e2dc] px-3.5 text-sm font-normal text-[#525252] outline-none placeholder:text-[#9ca3af] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" placeholder="Enter postcode or location" autoComplete="address-level2" required value={location} onChange={event => setLocation(event.target.value)} />
        </label>
        <div className="col-span-2 max-[700px]:col-span-1"><ChoiceGroup legend="Who needs care?" options={["Myself", "Parent", "Partner", "Child", "Other"]} selected={[recipient]} onSelect={setRecipient} /></div>
        <label className="flex min-w-0 flex-col gap-1.5 font-nunito text-base font-semibold text-black" htmlFor="requirement-start-date">When do you need care?
          <input id="requirement-start-date" type="date" className="h-[46px] w-full rounded-lg border border-[#e5e2dc] px-3.5 text-sm font-normal text-[#525252] outline-none focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" required value={startDate} onChange={event => setStartDate(event.target.value)} />
        </label>
        <ChoiceGroup legend="How often do you need care?" options={["Daily", "Weekly", "One-off", "Flexible"]} selected={[frequency]} onSelect={setFrequency} />
        <div className="col-span-2 max-[700px]:col-span-1"><ChoiceGroup legend="Preferred Times" options={["Morning", "Afternoon", "Evening", "Overnight"]} selected={times} onSelect={toggleTime} multiple /></div>
        <div><label className="flex flex-col gap-1.5 font-nunito text-base font-semibold text-black" htmlFor="requirement-hours">How many hours?<input id="requirement-hours" type="number" min="0.5" max="24" step="0.5" className="h-[46px] w-full rounded-lg border border-[#e5e2dc] px-3.5 text-sm font-normal text-[#525252] outline-none placeholder:text-[#525252] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" placeholder="Enter hours" required value={hours} onChange={event => setHours(event.target.value)} aria-describedby="requirement-hours-hint" /></label><p id="requirement-hours-hint" className="mt-1.5 font-nunito text-xs text-[#8d9692]">Hours per visit</p></div>
        <div><label className="mb-1.5 block font-nunito text-base font-semibold text-black" htmlFor="requirement-budget">Budget</label><div className="flex h-[46px] items-center gap-0.5 rounded-lg border border-[#e5e2dc] px-3.5 text-sm text-[#525252] focus-within:border-[#ff2f68] focus-within:ring-2 focus-within:ring-[#ff2f68]/10"><span aria-hidden="true">£</span><input id="requirement-budget" className="w-full min-w-0 bg-transparent outline-none" inputMode="decimal" required value={budget} onChange={event => setBudget(event.target.value)} aria-describedby="requirement-budget-hint" /></div><p id="requirement-budget-hint" className="mt-1.5 font-nunito text-xs text-[#8d9692]">Per hour</p></div>
        <label className="col-span-2 flex flex-col gap-1.5 font-nunito text-base font-semibold text-black max-[700px]:col-span-1" htmlFor="requirement-description">Tell us more about your requirements<textarea id="requirement-description" className="min-h-[116px] w-full resize-y rounded-lg border border-[#e5e2dc] px-3.5 py-3 font-nunito text-sm font-normal text-[#525252] outline-none placeholder:text-[#525252] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" placeholder="Please provide any additional information that could help caregivers understand the support you need." value={description} onChange={event => setDescription(event.target.value)} /></label>
        <fieldset className="col-span-2 pt-1 max-[700px]:col-span-1"><legend className="mb-3 font-nunito text-base font-semibold text-black">Additional Preferences</legend><div className="grid grid-cols-3 gap-x-5 gap-y-2 max-[1000px]:grid-cols-2 max-[500px]:grid-cols-1">{additionalPreferences.map(preference => <label key={preference} className="flex items-center gap-2.5 font-nunito text-base font-normal text-[#525252]"><input type="checkbox" className="size-4 rounded border-[#64716b] accent-[#ff2f68]" checked={preferences.includes(preference)} onChange={() => togglePreference(preference)} />{preference}</label>)}</div></fieldset>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-4 border-t border-[#e5e2dc] px-5 py-4">
        {error && <p role="alert" className="mr-auto font-nunito text-sm text-red-600">{error}</p>}
        {storageError && <p role="status" className="mr-auto font-nunito text-xs text-amber-700">Browser storage is unavailable. Changes will only last for this session.</p>}
        <button type="submit" disabled={!ready} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-5 py-3 font-nunito text-sm font-semibold text-white hover:bg-[#e92359] disabled:cursor-wait disabled:opacity-60">{requirement ? "Save Changes" : "Post Care Requirement"}<ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
