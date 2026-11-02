import { BriefcaseBusiness, FileClock, MessageSquare, ShieldCheck, Star } from "lucide-react";
import DashboardNotificationMenu from "@/components/dashboard/DashboardNotificationMenu";
import type { DashboardNotificationItem } from "@/components/dashboard/DashboardNotificationDropdown";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";

const icons = { verified: ShieldCheck, job: BriefcaseBusiness, message: MessageSquare, review: Star, expiry: FileClock };
const tones: Record<keyof typeof icons, DashboardNotificationItem["tone"]> = { verified: "green", job: "pink", message: "blue", review: "amber", expiry: "red" };

export default function CaregiverNotificationDropdown({ open, onToggle, onClose }: { open: boolean; onToggle: () => void; onClose: () => void }) {
  const { notifications, ready, markAllNotificationsRead, markNotificationRead, removeNotification } = useCaregiverDashboard();
  return <DashboardNotificationMenu open={open} onToggle={onToggle} unreadCount={ready ? notifications.filter(item => item.unread).length : 0} items={notifications.map(item => ({ id: item.id, text: item.title, time: item.time, icon: icons[item.kind], href: item.href, unread: item.unread, tone: tones[item.kind] }))} loading={!ready} markAllDisabled={!ready || !notifications.some(item => item.unread)} onRemove={removeNotification} onMarkAllRead={markAllNotificationsRead} onItemClick={id => { markNotificationRead(id); onClose(); }} />;
}
