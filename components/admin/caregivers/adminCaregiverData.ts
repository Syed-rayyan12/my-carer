import type { AdminData, AdminUser } from "../adminData";

export type VerificationStatus = "Pending" | "Verified" | "Rejected";
export type AdminCaregiverProfile = { phone: string; experience: number; hourlyRate: number; availability: string; careTypes: string[]; qualifications: string[]; verificationDate: string };
export type AdminCaregiver = AdminUser & { type: "Caregiver"; verification: VerificationStatus; avatarTone: "pink" | "dark"; profile?: AdminCaregiverProfile; suspendedFrom?: Exclude<AdminUser["status"], "Suspended"> };
export type AdminCaregiverFilters = { location: string; verification: string; status: string };

export const defaultAdminCaregiverFilters: AdminCaregiverFilters = { location: "", verification: "", status: "" };

export const initialAdminCaregivers: AdminCaregiver[] = [
  { id: "sarah-mitchell", name: "Sarah Mitchell", initials: "SM", type: "Caregiver", date: "3 Sep", email: "sarah.mitchell@email.co.uk", location: "London", verification: "Pending", status: "Pending", avatarTone: "pink" },
  { id: "sarah-smith", name: "Sarah Smith", initials: "SS", type: "Caregiver", date: "2 Sep", email: "sarah.smith@email.co.uk", location: "Bristol", verification: "Pending", status: "Pending", avatarTone: "dark" },
  { id: "grace-okafor", name: "Grace Okafor", initials: "GO", type: "Caregiver", date: "3 Sep", email: "grace.okafor@email.co.uk", location: "London", verification: "Verified", status: "Active", avatarTone: "pink" },
  { id: "daniel-hughes", name: "Daniel Hughes", initials: "DH", type: "Caregiver", date: "3 Sep", email: "daniel.hughes@email.co.uk", location: "Manchester", verification: "Verified", status: "Active", avatarTone: "dark" },
  { id: "priya-sharma", name: "Priya Sharma", initials: "PS", type: "Caregiver", date: "3 Sep", email: "priya.sharma@email.co.uk", location: "Birmingham", verification: "Verified", status: "Active", avatarTone: "pink" },
  { id: "tom-richards", name: "Tom Richards", initials: "TR", type: "Caregiver", date: "3 Sep", email: "tom.richards@email.co.uk", location: "Leeds", verification: "Verified", status: "Suspended", avatarTone: "dark" },
  { id: "emily-clarke", name: "Emily Clarke", initials: "EC", type: "Caregiver", date: "4 Sep", email: "emily.clarke@email.co.uk", location: "Liverpool", verification: "Rejected", status: "Pending", avatarTone: "pink" },
  { id: "marek-nowak", name: "Marek Nowak", initials: "MN", type: "Caregiver", date: "4 Sep", email: "marek.nowak@email.co.uk", location: "Glasgow", verification: "Verified", status: "Active", avatarTone: "dark" },
];

export function isAdminCaregiverList(value: unknown): value is AdminCaregiver[] {
  return Array.isArray(value) && value.every(person => person && typeof person === "object" && ["id", "name", "initials", "date", "email", "location"].every(key => typeof person[key] === "string") && person.type === "Caregiver" && ["Pending", "Active", "Rejected", "Suspended"].includes(person.status) && ["Pending", "Verified", "Rejected"].includes(person.verification) && ["pink", "dark"].includes(person.avatarTone) && (person.rejectionReason === undefined || typeof person.rejectionReason === "string") && (person.suspendedFrom === undefined || ["Pending", "Active", "Rejected"].includes(person.suspendedFrom)) && (person.profile === undefined || isAdminCaregiverProfile(person.profile)));
}

export function isAdminCaregiverProfile(value: unknown): value is AdminCaregiverProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return typeof profile.phone === "string" && typeof profile.availability === "string" && typeof profile.verificationDate === "string" && typeof profile.experience === "number" && Number.isFinite(profile.experience) && profile.experience >= 0 && typeof profile.hourlyRate === "number" && Number.isFinite(profile.hourlyRate) && profile.hourlyRate >= 0 && Array.isArray(profile.careTypes) && profile.careTypes.every(type => typeof type === "string") && Array.isArray(profile.qualifications) && profile.qualifications.every(qualification => typeof qualification === "string");
}

export function getAdminCaregiverProfile(caregiver: AdminCaregiver): AdminCaregiverProfile {
  if (caregiver.profile) return caregiver.profile;
  const rates: Record<string, number> = { "sarah-mitchell": 18, "sarah-smith": 18, "grace-okafor": 20, "daniel-hughes": 21, "priya-sharma": 26, "tom-richards": 17, "emily-clarke": 16.5, "marek-nowak": 19 };
  return { phone: "+44 7700 900123", experience: 6, hourlyRate: rates[caregiver.id] ?? 18, availability: "Weekdays, 8am – 6pm", careTypes: ["Elderly Care", "Dementia Care", "Companionship"], qualifications: ["NVQ Level 3 Health & Social Care", "First Aid Certified", "Dementia Awareness"], verificationDate: "" };
}

export function getAdminCaregivers(data: AdminData): AdminCaregiver[] {
  if (data.caregivers) return data.caregivers;
  return initialAdminCaregivers.map(person => {
    const registration = data.users.find(user => user.id === person.id);
    if (!registration || registration.status === person.status) return person;
    return { ...person, status: registration.status, rejectionReason: registration.rejectionReason, verification: registration.status === "Active" ? "Verified" : registration.status === "Rejected" ? "Rejected" : person.verification };
  });
}

export function filterAdminCaregivers(caregivers: AdminCaregiver[], search: string, filters: AdminCaregiverFilters) {
  const query = search.trim().toLowerCase();
  return caregivers.filter(person => (!query || `${person.name} ${person.email} ${person.location} ${person.verification} ${person.status}`.toLowerCase().includes(query)) && (!filters.location || person.location === filters.location) && (!filters.verification || person.verification === filters.verification) && (!filters.status || person.status === filters.status));
}
