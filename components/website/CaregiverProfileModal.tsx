"use client";
import FullCaregiverProfileModal from "@/components/platform/FullCaregiverProfileModal";

export type CaregiverProfile = {
  id?: string;
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


export default function CaregiverProfileModal(props: Parameters<typeof FullCaregiverProfileModal>[0]) {
  return <FullCaregiverProfileModal {...props} profile={props.profile ?? demoCaregiverProfile} />;
}
