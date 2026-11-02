export type CaregiverExperience = { id: string; title: string; employer: string; start: string; end: string; current: boolean; responsibilities: string };
export type CaregiverQualification = { id: string; name: string; institution: string; year: string; fileName: string; local?: boolean };
export type CaregiverReference = { id: string; name: string; relationship: string; email: string; phone: string };
export type CaregiverPersonalInfo = { firstName: string; lastName: string; email: string; phone: string; dob: string; gender: string; address: string; city: string; postcode: string };
export type CaregiverProfile = { personal: CaregiverPersonalInfo; photo: string; about: string; yearsExperience: number; experiences: CaregiverExperience[]; qualifications: CaregiverQualification[]; references: CaregiverReference[] };
export const initialCaregiverProfile: CaregiverProfile = {
  personal: { firstName: "Sarah", lastName: "Mitchell", email: "", phone: "", dob: "", gender: "", address: "", city: "Manchester", postcode: "" }, photo: "/images/image-cute.png",
  about: "I am a compassionate and experienced caregiver with over 5 years of experience supporting elderly clients with personal care, mobility and companionship. I believe in building trusting relationships and providing respectful, reliable care tailored to each person's needs.", yearsExperience: 5,
  experiences: [
    { id: "willow-grove", title: "Senior Care Assistant", employer: "Willow Grove Care Home", start: "2022-03", end: "", current: true, responsibilities: "Lead a team of four carers on the dementia unit, deliver personal care, manage medication rounds and coordinate with families on care plans." },
    { id: "bright-days", title: "Home Care Worker", employer: "Bright Days Home Care", start: "2019-06", end: "2022-02", current: false, responsibilities: "Supported elderly clients in their own homes with personal care, meal preparation, mobility and companionship visits." },
  ],
  qualifications: [{ id: "nvq-l3", name: "NVQ Level 3 Health & Social Care", institution: "The Manchester College", year: "2020", fileName: "NVQ-L3-certificate.pdf" }, { id: "first-aid", name: "First Aid at Work", institution: "St John Ambulance", year: "2025", fileName: "first-aid-2025.pdf" }], references: [],
};
function hasStrings(value: unknown, keys: string[]): boolean { return !!value && typeof value === "object" && keys.every(key => typeof (value as Record<string, unknown>)[key] === "string"); }
export function isCaregiverProfile(value: unknown): value is CaregiverProfile {
  if (!value || typeof value !== "object") return false; const p = value as Record<string, unknown>;
  return hasStrings(p.personal, ["firstName", "lastName", "email", "phone", "dob", "gender", "address", "city", "postcode"]) && typeof p.photo === "string" && typeof p.about === "string" && p.about.length <= 800 && typeof p.yearsExperience === "number" && Number.isFinite(p.yearsExperience) && p.yearsExperience >= 0 && Array.isArray(p.experiences) && p.experiences.every(item => hasStrings(item, ["id", "title", "employer", "start", "end", "responsibilities"]) && typeof item.current === "boolean") && Array.isArray(p.qualifications) && p.qualifications.every(item => hasStrings(item, ["id", "name", "institution", "year", "fileName"])) && Array.isArray(p.references) && p.references.every(item => hasStrings(item, ["id", "name", "relationship", "email", "phone"]));
}
export function profileCompletion(profile: CaregiverProfile) { return (profile.personal.firstName.trim() && profile.personal.lastName.trim() && profile.photo ? 20 : 0) + (profile.about.trim() ? 20 : 0) + (profile.experiences.length ? 20 : 0) + (profile.qualifications.length ? 20 : 0) + Math.min(profile.references.length, 2) * 10; }
export function formatExperienceDate(value: string) { if (!/^\d{4}-\d{2}$/.test(value)) return value; return new Date(`${value}-01T12:00:00`).toLocaleDateString("en-GB", { month: "short", year: "numeric" }); }
