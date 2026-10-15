"use client";

import { useState } from "react";
import CaregiverRegistrationModal from "./CaregiverRegistrationModal";
import CareSeekerRegistrationModal from "./CareSeekerRegistrationModal";
import CareAgencyRegistrationModal from "./CareAgencyRegistrationModal";
import LocalAuthorityRegistrationModal from "./LocalAuthorityRegistrationModal";
import { ArrowRight, Building2, HandHeart, HeartHandshake, UsersRound } from "lucide-react";

const plans = [
  { id: "caregiver", title: "Caregiver", subtitle: "For Individual Caregivers Advertising Their Services", price: "£2.99", icon: UsersRound, features: ["Create professional profile", "Showcase qualifications and experience", "Upload DBS/CRB verification", "Set your hourly rates", "Define travel radius", "Add references and testimonials", "Receive enquiries from clients", "Browse care seeker postings", "Apply to care agency jobs", "Cancel anytime – no commitment"], button: "Get Started As Caregiver" },
  { id: "care-seeker", title: "Care Seeker", subtitle: "For Individuals With Funding Seeking Care", price: "£1.99", icon: HandHeart, features: ["Post your care requirements", "Specify budget and funding type", "Browse qualified caregivers", "Direct contact with caregivers", "Define care tasks needed", "Set visit schedules", "Filter by qualifications", "Receive caregiver applications", "Cancel anytime – no commitment"], button: "Get Started As Care Seeker" },
  { id: "care-agency", title: "Care Agency", subtitle: "For Private Care Agencies Recruiting Caregivers", price: "£89", icon: Building2, features: ["Post unlimited care positions", "Access to caregiver database", "Detailed job postings", "Specify client requirements", "Set hourly rates and schedules", "Receive applications directly", "Agency branding on listings", "Analytics and reporting", "12-month rolling contract", "90 days notice to cancel"], button: "Get Started As Agency" },
  { id: "local-authority", title: "Local Authority", subtitle: "For Councils And Local Government Care Services", price: "£110", icon: HeartHandshake, features: ["Create professional profile", "Showcase qualifications and experience", "Upload DBS/CRB verification", "Set your hourly rates", "Define travel radius", "Add references and testimonials", "Receive enquiries from clients", "Browse care seeker postings", "Apply to care agency jobs", "Cancel anytime – no commitment"], button: "Get Started As Local Authority" },
];

export default function PricingPlans() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  return (
    <section className="bg-white py-[60px] max-[600px]:py-8">
      <div className="mx-auto grid w-[min(1240px,calc(100%-60px))] grid-cols-4 gap-3 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:w-[min(430px,calc(100%-30px))]">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return <article id={plan.id} key={plan.id} className="flex scroll-mt-8 flex-col rounded-[13px] bg-white p-5 shadow-[0_7px_24px_rgba(16,25,41,.16)] max-[1000px]:p-6"><div className="mx-auto mb-3 flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#fff1f4] text-[#ff2f68]"><Icon size={38} strokeWidth={1.5} /></div><h2 className="text-center font-commissioner text-[21px] font-extrabold text-[#101929]">{plan.title}</h2><p className="mt-2 min-h-[46px] text-center font-nunito text-[13px] leading-[1.5] text-[#667085]">{plan.subtitle}</p><p className="my-4 text-center"><strong className="font-commissioner text-[32px] font-extrabold text-[#ff2f68]">{plan.price}</strong><span className="text-[11px] text-[#475467]"> /Per month</span></p><ul className="mb-5 flex-1 space-y-[10px] font-nunito text-[12px] leading-[1.4] text-[#344054]">{plan.features.map((feature) => <li key={feature} className="flex gap-2"><span aria-hidden="true">•</span><span>{feature}</span></li>)}</ul><button type="button" onClick={() => setActiveModal(plan.id)} className="inline-flex min-h-[42px] items-center justify-center gap-1 rounded-[7px] bg-[#ff2f68] px-2 text-center text-[12px] font-bold text-white transition-colors hover:bg-[#e92359]">{plan.button}<ArrowRight size={13} /></button></article>;
        })}
      </div>
      {activeModal === "caregiver" && <CaregiverRegistrationModal onClose={() => setActiveModal(null)} />}
      {activeModal === "care-seeker" && <CareSeekerRegistrationModal onClose={() => setActiveModal(null)} />}
      {activeModal === "care-agency" && <CareAgencyRegistrationModal onClose={() => setActiveModal(null)} />}
      {activeModal === "local-authority" && <LocalAuthorityRegistrationModal onClose={() => setActiveModal(null)} />}
    </section>
  );
}
