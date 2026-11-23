import { BriefcaseBusiness, FileClock, MessageSquare, ShieldCheck, Star } from "lucide-react";
import type { CaregiverNotification } from "./notificationsData";

const icons = { verified: ShieldCheck, job: BriefcaseBusiness, message: MessageSquare, review: Star, expiry: FileClock };
const colors = { verified: "bg-[#ecfdf3] text-[#027a48]", job: "bg-[#fff0f5] text-[#ff2f68]", message: "bg-[#eff8ff] text-[#175cd3]", review: "bg-[#fffaeb] text-[#b54708]", expiry: "bg-[#fef3f2] text-[#f04438]" };
export default function NotificationIcon({ kind }: { kind: CaregiverNotification["kind"] }) { const Icon = icons[kind]; return <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${colors[kind]}`}><Icon size={20} strokeWidth={2} /></span>; }
