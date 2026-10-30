"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { ProfileFormSkeleton } from "../loading/DashboardSkeleton";

const emptyProfile = {
  firstName: "", lastName: "", email: "", phone: "", dateOfBirth: "",
  address: "", postcode: "", about: "", emergencyName: "", relationship: "", emergencyPhone: "",
};

type ProfileValues = typeof emptyProfile;
type FieldName = keyof ProfileValues;
const storageKey = "my-carer-care-seeker-profile";

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="grid grid-cols-[27%_minmax(0,1fr)] gap-x-5 border-t border-[#e5e2dc] py-8 max-[800px]:grid-cols-1 max-[800px]:gap-y-5">
      <div>
        <h2 className="mb-1 font-nunito text-base font-bold text-[#202925]">{title}</h2>
        <p className="max-w-[250px] font-nunito text-[14px] leading-[1.5] text-[#5e6b65]">{description}</p>
      </div>
      <div className="grid grid-cols-2 items-start gap-x-5 gap-y-[18px] max-[550px]:grid-cols-1">{children}</div>
    </section>
  );
}

export default function ProfileForm({ onCompletionChange }: { onCompletionChange: (completion: number) => void }) {
  const [values, setValues] = useState<ProfileValues>(emptyProfile);
  const [status, setStatus] = useState("");
  const [saveError, setSaveError] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const parsed: unknown = JSON.parse(saved);
      if (typeof parsed !== "object" || parsed === null) return;
      const restored = { ...emptyProfile };
      for (const field of Object.keys(emptyProfile) as FieldName[]) {
        const value = (parsed as Record<string, unknown>)[field];
        if (typeof value === "string") restored[field] = value;
      }
      setValues(restored);
      onCompletionChange(Math.round(Object.values(restored).filter(value => value.trim()).length / Object.keys(restored).length * 100));
    } catch {
      // The form remains available when browser storage is unavailable.
    } finally {
      setReady(true);
    }
  }, [onCompletionChange]);

  function update(field: FieldName, value: string) {
    setValues(current => ({ ...current, [field]: value }));
    setStatus("");
  }

  function field(name: FieldName, label: string, type = "text", autoComplete?: string) {
    return (
      <label className="flex min-w-0 flex-col gap-1.5 font-nunito text-[14px] font-semibold text-[#202925]" htmlFor={`profile-${name === "firstName" ? "first-name" : name}`}>
        {label}
        <input id={`profile-${name === "firstName" ? "first-name" : name}`} name={name} type={type} autoComplete={autoComplete} value={values[name]} onChange={event => update(name, event.target.value)} max={name === "dateOfBirth" ? new Date().toISOString().slice(0, 10) : undefined} className="h-11 w-full rounded-lg border border-[#e5e2dc] bg-white px-3.5 font-nunito text-sm font-normal text-[#202925] outline-none transition-shadow focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" />
      </label>
    );
  }

  if (!ready) return <ProfileFormSkeleton />;

  return (
    <form className="rounded-[11px] border border-[#d9d9d9] bg-white px-3.5 pt-6 pb-[22px]" onSubmit={event => {
      event.preventDefault();
      try {
        localStorage.setItem(storageKey, JSON.stringify(values));
        onCompletionChange(Math.round(Object.values(values).filter(value => value.trim()).length / Object.keys(values).length * 100));
        setSaveError(false);
        setStatus("Your changes have been saved on this device.");
      } catch {
        setSaveError(true);
        setStatus("Your browser could not save these changes. Please allow browser storage and try again.");
      }
    }}>
      <FormSection title="Personal Information" description="Only shared with caregivers you choose to contact.">
        {field("firstName", "First Name", "text", "given-name")}
        {field("lastName", "Last Name", "text", "family-name")}
        {field("email", "Email Address", "email", "email")}
        {field("phone", "Phone Number", "tel", "tel")}
        {field("dateOfBirth", "Date of Birth", "date", "bday")}
      </FormSection>

      <FormSection title="Location" description="Helps us match you with caregivers nearby.">
        {field("address", "Address", "text", "street-address")}
        {field("postcode", "Postcode", "text", "postal-code")}
      </FormSection>

      <FormSection title="About Me" description="Tell caregivers a little about yourself.">
        <div className="col-span-2 max-[550px]:col-span-1">
          <label className="mb-1.5 block font-nunito text-[14px] font-semibold text-[#202925]" htmlFor="profile-about">About you</label>
          <textarea id="profile-about" name="about" rows={4} value={values.about} onChange={event => update("about", event.target.value)} placeholder="I am looking for care support for my mother..." className="block min-h-28 w-full resize-y rounded-lg border border-[#e5e2dc] bg-white px-3.5 py-3 font-nunito text-sm text-[#202925] outline-none placeholder:text-[#9ca3af] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" />
          <p className="mt-2 font-nunito text-xs text-[#8d9692]">Shown on your care requirements.</p>
        </div>
      </FormSection>

      <FormSection title="Emergency Contact" description="Who should we contact if something comes up?">
        {field("emergencyName", "Name")}
        {field("relationship", "Relationship")}
        {field("emergencyPhone", "Phone Number", "tel")}
      </FormSection>

      <div className="flex items-center justify-end gap-4 border-t border-[#e5e2dc] pt-6 max-[550px]:flex-col max-[550px]:items-end">
        <p className={`mr-auto flex items-center gap-2 font-nunito text-xs ${saveError ? "text-red-600" : "text-[#3c9c68]"}`} role="status">{status && !saveError && <CheckCircle2 size={16} className="shrink-0" />}{status}</p>
        <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-lg bg-[#ff2f68] px-5 py-3 font-nunito text-sm font-semibold text-white transition-colors hover:bg-[#e92359] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff2f68]">Save Changes<ArrowRight size={16} /></button>
      </div>
    </form>
  );
}
