"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

// Placeholder monthly prices; update these when the plans are finalised.
const plans = [
  { name: "Basic", price: "£2.99" },
  { name: "Standard", price: "£5.99" },
  { name: "Premium", price: "£9.99" },
];

const fields = [
  { name: "firstName", label: "First Name", type: "text", autoComplete: "given-name", placeholder: "Enter first name" },
  { name: "lastName", label: "Last Name", type: "text", autoComplete: "family-name", placeholder: "Enter last name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "Enter email address" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "Enter phone number" },
  { name: "location", label: "Location", type: "text", autoComplete: "address-level2", placeholder: "Enter location" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password", placeholder: "Enter password" },
];

export default function CaregiverRegistrationModal({ onClose }: {
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [notice, setNotice] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
          event.currentTarget.close();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] max-[480px]:max-h-[94dvh] w-[calc(100%-32px)] max-w-[620px] overflow-y-auto rounded-[14px] border-0 bg-white p-0 text-[#101929] shadow-2xl backdrop:bg-[#101929]/60"
    >
      <div className="flex items-center justify-between border-b border-[#e3e5e8] px-6 py-5 max-[480px]:px-4">
        <h2 id={`${id}-title`} className="font-commissioner text-[22px] font-semibold">Caregiver</h2>
        <button type="button" aria-label="Close caregiver form" onClick={() => dialogRef.current?.close()} className="flex h-9 w-9 items-center justify-center rounded-full text-[#101929] transition-colors hover:bg-[#fff1f4] focus-visible:outline-2 focus-visible:outline-[#ff2f68]">
          <X size={22} />
        </button>
      </div>
      <p id={`${id}-description`} className="sr-only">Complete your details and choose a subscription plan to register as a caregiver.</p>
      <form className="space-y-6 p-6 max-[480px]:p-4" onSubmit={(event) => {
        event.preventDefault();
        setNotice("Registration is not connected yet. Your details have not been submitted.");
      }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {fields.map((field, index) => (
            <div key={field.name} className={`flex min-w-0 flex-col gap-2 ${index > 1 ? "col-span-2" : ""}`}>
              <label htmlFor={`${id}-${field.name}`} className="font-nunito text-[14px] font-medium">
                {field.label} <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id={`${id}-${field.name}`}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                autoFocus={index === 0}
                required
                pattern={field.type === "text" ? ".*\\S.*" : field.type === "tel" ? "[+0-9() .\\-]{7,}" : undefined}
                title={field.type === "tel" ? "Enter a phone number with at least seven characters." : undefined}
                className="h-11 min-w-0 w-full rounded-[6px] border border-[#d9dde3] bg-white px-3 font-nunito text-[14px] max-[600px]:text-[16px] font-medium text-[#101929] outline-none placeholder:font-nunito placeholder:text-[14px] placeholder:font-medium placeholder:text-[#98a0ab] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/15"
              />
            </div>
          ))}
        </div>
        <fieldset>
          <legend className="mb-3 font-commissioner text-[22px] font-semibold">Choose Your Plan <span className="text-red-600" aria-hidden="true">*</span></legend>
          <div className="grid grid-cols-3 gap-3 max-[380px]:gap-2">
            {plans.map((plan) => (
              <label key={plan.name} className="relative cursor-pointer">
                <input type="radio" name="plan" value={plan.name.toLowerCase()} required checked={selectedPlan === plan.name} onChange={() => setSelectedPlan(plan.name)} className="peer sr-only" />
                <span className="flex min-h-[88px] flex-col items-start justify-center text-left gap-2 rounded-[7px] border border-[#d9dde3] bg-[#f3f4f6] px-2 py-4 font-nunito text-[13px] font-medium text-[#626b78] transition-colors peer-checked:border-[#ff2f68] peer-checked:bg-[#ffe1e9] peer-checked:text-[#101929] peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff2f68] peer-focus-visible:ring-offset-2">
                  <span className="font-nunito text-[15px] max-[380px]:text-[13px] font-medium uppercase">{plan.name}</span>
                  <span className="flex flex-wrap items-baseline justify-start gap-0.5"><strong className={`font-commissioner text-[22px] max-[380px]:text-[18px] font-bold! leading-tight ${selectedPlan === plan.name ? "text-[#ff2f68]" : "text-black"}`}>{plan.price}</strong><span className="font-nunito text-[13px] font-medium">/mo</span></span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="flex items-start gap-2.5 font-nunito text-[13.08px] font-light leading-[1.5]">
          <input type="checkbox" name="privacyConsent" required className="mt-0.5 h-4 w-4 shrink-0 accent-[#ff2f68]" />
          <span>I agree to the <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-inherit underline underline-offset-2">Privacy Policy</Link> &amp; <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-inherit underline underline-offset-2">Terms &amp; Conditions</Link> <span className="text-red-600" aria-hidden="true">*</span></span>
        </label>
        <button type="submit" className="flex min-h-11 w-full items-center justify-center rounded-[7px] bg-[#ff2f68] px-5 font-nunito text-[14px] font-medium text-white transition-colors hover:bg-[#e92359] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2f68]">Continue</button>
        {notice && <p role="status" className="font-nunito text-[14px] text-[#626b78]">{notice}</p>}
      </form>
    </dialog>
  );
}
