import { MessageSquare, Heart, ClipboardList, ShieldCheck } from "lucide-react";

export const people = [
  { name: "Sarah Mitchell", specialty: "Elderly & dementia care specialist", image: "/images/image-cute.png", location: "Manchester", rate: "18.50", reviews: 45, tags: ["Dementia Care", "Personal Care"] },
  { name: "Michael O’Connor", specialty: "Personal care & companionship", image: "/images/image-cute-2.png", location: "Manchester", rate: "16.00", reviews: 38, tags: ["Companionship", "Elderly Care"] },
];
export const activity = [
  { icon: MessageSquare, text: "Sarah Mitchell responded to your care requirement", time: "10 minutes ago" },
  { icon: Heart, text: "A new caregiver matches your preferences", time: "1 hour ago" },
  { icon: ClipboardList, text: "Your care requirement is now live", time: "3 hours ago" },
  { icon: ShieldCheck, text: "Your profile has been verified", time: "Yesterday" },
];
