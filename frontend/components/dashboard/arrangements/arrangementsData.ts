export type ArrangementStatus = "upcoming" | "active" | "completed";
export type CareArrangement = {
  id: string; caregiverId: string; title: string; careType: string; location: string;
  startDate: string; schedule: string; status: ArrangementStatus; notes: string;
};

export const arrangementTabs: { id: ArrangementStatus; label: string }[] = [{ id: "upcoming", label: "Upcoming" }, { id: "active", label: "Active" }, { id: "completed", label: "Completed" }];

export const initialArrangements: CareArrangement[] = [
  { id: "arrangement-sarah", caregiverId: "sarah-mitchell", title: "Dementia", careType: "Dementia & Elderly Care", location: "Manchester", startDate: "2026-10-15", schedule: "Monday–Friday 9:00 AM – 2:00 PM", status: "upcoming", notes: "" },
  { id: "arrangement-emily", caregiverId: "emily-clarke", title: "Companionship", careType: "Companionship", location: "Manchester", startDate: "2026-10-15", schedule: "Monday–Friday 9:00 AM – 2:00 PM", status: "upcoming", notes: "" },
  { id: "arrangement-priya", caregiverId: "priya-patel", title: "Personal Care", careType: "Personal Care & Nursing", location: "Manchester", startDate: "2026-10-01", schedule: "Weekdays 8:00 AM – 12:00 PM", status: "active", notes: "" },
  { id: "arrangement-james", caregiverId: "james-wilson", title: "Respite Care", careType: "Respite Care", location: "Manchester", startDate: "2026-09-05", schedule: "Saturdays 10:00 AM – 4:00 PM", status: "completed", notes: "" },
];

export function isArrangementList(value: unknown): value is CareArrangement[] {
  return Array.isArray(value) && value.every(item => item && typeof item === "object" && ["id", "caregiverId", "title", "careType", "location", "startDate", "schedule", "notes"].every(key => typeof item[key] === "string") && ["upcoming", "active", "completed"].includes(item.status));
}
