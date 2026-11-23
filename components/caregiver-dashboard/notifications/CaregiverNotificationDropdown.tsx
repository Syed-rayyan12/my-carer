import { NotificationBell } from '@/components/dashboard/Notifications';
export default function CaregiverNotificationDropdown({open,onToggle}: {open:boolean;onToggle:()=>void;onClose:()=>void}) {return <NotificationBell open={open} onToggle={onToggle}/>;}
