import type { AdminData, AdminUser } from "../adminData";

export type CareSeekerConnection = { caregiverId: string; since: string; status: "Active" | "Shortlisted" };
export type AdminCareSeeker = AdminUser & {
  type: "Care Seeker"; phone: string; joinedAt: string; avatarTone: "pink" | "dark";
  requirement: { description: string; careType: string; schedule: string; budget: string };
  connections: CareSeekerConnection[];
  suspendedFrom?: Exclude<AdminUser["status"], "Suspended">;
};
export type CareSeekerFilters = { location: string; careType: string; status: string };
export const defaultCareSeekerFilters: CareSeekerFilters = { location: "", careType: "", status: "" };

const fatherCare = "Looking for help with morning routines, meals and light housework for my 82-year-old father who lives alone.";

export const initialAdminCareSeekers: AdminCareSeeker[] = [
  { id: "john-smith", name: "John Smith", initials: "JS", type: "Care Seeker", date: "14 Aug", joinedAt: "2026-08-14", email: "john.smith@email.co.uk", phone: "+44 7700 901111", location: "Manchester", status: "Active", avatarTone: "pink", requirement: { description: fatherCare, careType: "Elderly Care", schedule: "Weekday mornings, 3 hrs/day", budget: "£250 / week" }, connections: [{ caregiverId: "daniel-hughes", since: "2026-08-20", status: "Active" }, { caregiverId: "marek-nowak", since: "2026-08-25", status: "Shortlisted" }] },
  { id: "john-brown", name: "John Brown", initials: "JB", type: "Care Seeker", date: "3 Sep", joinedAt: "2026-09-03", email: "john.brown@email.co.uk", phone: "+44 7700 901112", location: "London", status: "Active", avatarTone: "dark", requirement: { description: "Looking for an experienced caregiver to provide dementia support and companionship for my mother.", careType: "Dementia Care", schedule: "Monday–Friday, 9am–2pm", budget: "£18–£22 / hour" }, connections: [{ caregiverId: "sarah-mitchell", since: "2026-09-10", status: "Shortlisted" }] },
  { id: "aisha-rahman", name: "Aisha Rahman", initials: "AR", type: "Care Seeker", date: "4 Sep", joinedAt: "2026-09-04", email: "aisha.rahman@email.co.uk", phone: "+44 7700 901113", location: "Birmingham", status: "Pending", avatarTone: "pink", requirement: { description: "Seeking reliable weekend respite care to support our family with personal care and daily routines.", careType: "Respite Care", schedule: "Saturdays, 10am–4pm", budget: "£120 / visit" }, connections: [] },
  { id: "helen-carter", name: "Helen Carter", initials: "HC", type: "Care Seeker", date: "20 Aug", joinedAt: "2026-08-20", email: "helen.carter@email.co.uk", phone: "+44 7700 901114", location: "Bristol", status: "Active", avatarTone: "dark", requirement: { description: "Looking for companionship and practical support with shopping and meal preparation.", careType: "Companionship", schedule: "Weekday afternoons, 2 hrs/day", budget: "£180 / week" }, connections: [{ caregiverId: "grace-okafor", since: "2026-08-27", status: "Active" }] },
  { id: "emma-wilson", name: "Emma Wilson", initials: "EW", type: "Care Seeker", date: "1 Sep", joinedAt: "2026-09-01", email: "emma.wilson@email.co.uk", phone: "+44 7700 901115", location: "Liverpool", status: "Active", avatarTone: "pink", requirement: { description: "Seeking a kind caregiver for personal care and assistance with morning routines.", careType: "Personal Care", schedule: "Monday–Friday, 8am–11am", budget: "£240 / week" }, connections: [{ caregiverId: "emily-clarke", since: "2026-09-07", status: "Shortlisted" }] },
  { id: "david-brown", name: "David Brown", initials: "DB", type: "Care Seeker", date: "22 Aug", joinedAt: "2026-08-22", email: "david.brown@email.co.uk", phone: "+44 7700 901116", location: "Leeds", status: "Suspended", avatarTone: "dark", requirement: { description: "Looking for daily support for an older family member after a hospital stay.", careType: "Elderly Care", schedule: "Daily, 2 hrs/day", budget: "£220 / week" }, connections: [] },
  { id: "linda-clarke", name: "Linda Clarke", initials: "LC", type: "Care Seeker", date: "5 Sep", joinedAt: "2026-09-05", email: "linda.clarke@email.co.uk", phone: "+44 7700 901117", location: "London", status: "Pending", avatarTone: "pink", requirement: { description: "Seeking occasional respite support and companionship for a loved one.", careType: "Respite Care", schedule: "Flexible weekend visits", budget: "£20 / hour" }, connections: [] },
  { id: "mark-evans", name: "Mark Evans", initials: "ME", type: "Care Seeker", date: "6 Sep", joinedAt: "2026-09-06", email: "mark.evans@email.co.uk", phone: "+44 7700 901118", location: "Glasgow", status: "Active", avatarTone: "dark", requirement: { description: "Looking for friendly companionship and support with everyday activities.", careType: "Companionship", schedule: "Three afternoons per week", budget: "£150 / week" }, connections: [{ caregiverId: "marek-nowak", since: "2026-09-12", status: "Shortlisted" }] },
];

export function isAdminCareSeekerList(value: unknown): value is AdminCareSeeker[] {
  return Array.isArray(value) && value.every(person => person && typeof person === "object" && ["id", "name", "initials", "date", "email", "location", "phone", "joinedAt"].every(key => typeof person[key] === "string") && person.type === "Care Seeker" && ["Pending", "Active", "Rejected", "Suspended"].includes(person.status) && ["pink", "dark"].includes(person.avatarTone) && (person.rejectionReason === undefined || typeof person.rejectionReason === "string") && (person.suspendedFrom === undefined || ["Pending", "Active", "Rejected"].includes(person.suspendedFrom)) && person.requirement && typeof person.requirement === "object" && ["description", "careType", "schedule", "budget"].every(key => typeof person.requirement[key] === "string") && Array.isArray(person.connections) && person.connections.every((connection: Record<string, unknown>) => connection && typeof connection.caregiverId === "string" && typeof connection.since === "string" && ["Active", "Shortlisted"].includes(String(connection.status))));
}

export function getAdminCareSeekers(data: AdminData): AdminCareSeeker[] {
  if (data.careSeekers) return data.careSeekers;
  return initialAdminCareSeekers.map(person => {
    const user = data.users.find(item => item.id === person.id);
    return user ? { ...person, status: user.status, rejectionReason: user.rejectionReason } : person;
  });
}

export function filterAdminCareSeekers(seekers: AdminCareSeeker[], search: string, filters: CareSeekerFilters) {
  const query = search.trim().toLowerCase();
  return seekers.filter(person => (!query || `${person.name} ${person.email} ${person.location} ${person.requirement.careType} ${person.status}`.toLowerCase().includes(query)) && (!filters.location || person.location === filters.location) && (!filters.careType || person.requirement.careType === filters.careType) && (!filters.status || person.status === filters.status));
}

export function formatCareSeekerDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}
