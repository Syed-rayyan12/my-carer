export const caregiverWeekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export type AvailabilitySlot = { start: string; end: string };
export type AvailabilityDay = { day: string; slots: AvailabilitySlot[] };
export type CaregiverAvailability = { days: string[]; start: string; end: string; weekly?: AvailabilityDay[] };
export const initialCaregiverAvailability: CaregiverAvailability = { days: caregiverWeekdays.slice(0, 5), start: "09:00", end: "18:00" };
const validTime = (value: unknown): value is string => typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
export function validateWeeklySchedule(weekly: AvailabilityDay[]) {
  if (!Array.isArray(weekly) || weekly.length !== 7 || new Set(weekly.map(item => item?.day)).size !== 7) return "Include every day of the week once.";
  for (const row of weekly) {
    if (!row || !caregiverWeekdays.includes(row.day) || !Array.isArray(row.slots) || row.slots.length > 2) return "Use up to two time slots per day.";
    for (let index = 0; index < row.slots.length; index++) { const slot = row.slots[index]; if (!slot || !validTime(slot.start) || !validTime(slot.end) || slot.end <= slot.start) return `${row.day}: choose an end time after the start time.`; if (index > 0 && slot.start < row.slots[index - 1].end) return `${row.day}: time slots must be in order and must not overlap.`; }
  }
  return "";
}
export function isCaregiverAvailability(value: unknown): value is CaregiverAvailability {
  if (!value || typeof value !== "object") return false; const a = value as Record<string, unknown>;
  if (!Array.isArray(a.days) || new Set(a.days).size !== a.days.length || !a.days.every(day => typeof day === "string" && caregiverWeekdays.includes(day)) || !validTime(a.start) || !validTime(a.end) || a.end <= a.start) return false;
  if (a.weekly === undefined) return true;
  if (!Array.isArray(a.weekly) || validateWeeklySchedule(a.weekly)) return false;
  const active = a.weekly.filter(row => row.slots.length).map(row => row.day);
  const days = a.days;
  return active.length === days.length && active.every(day => days.includes(day));
}
export function availabilitySchedule(value: CaregiverAvailability): AvailabilityDay[] { return caregiverWeekdays.map(day => ({ day, slots: value.weekly ? (value.weekly.find(row => row.day === day)?.slots ?? []).map(slot => ({ ...slot })) : value.days.includes(day) ? [{ start: value.start, end: value.end }] : [] })); }
export function weeklyAvailability(weekly: AvailabilityDay[]): CaregiverAvailability { const ordered = caregiverWeekdays.map(day => ({ day, slots: (weekly.find(row => row.day === day)?.slots ?? []).map(slot => ({ ...slot })) })); const first = ordered.find(row => row.slots.length)?.slots[0]; return { days: ordered.filter(row => row.slots.length).map(row => row.day), start: first?.start ?? "09:00", end: first?.end ?? "18:00", weekly: ordered }; }
export function availabilityDays(days: string[]) { const sorted = caregiverWeekdays.filter(day => days.includes(day)); if (sorted.length > 1 && sorted.every((day, index) => index === 0 || caregiverWeekdays.indexOf(day) === caregiverWeekdays.indexOf(sorted[index - 1]) + 1)) return `${sorted[0]} – ${sorted.at(-1)}`; return sorted.join(", "); }
export function availabilityTime(time: string) { const [hours, minutes] = time.split(":").map(Number); return `${String(hours % 12 || 12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`; }
export function availabilityGroups(value: CaregiverAvailability) { const groups: { days: string[]; slots: AvailabilitySlot[] }[] = []; for (const row of availabilitySchedule(value)) { if (!row.slots.length) continue; const key = JSON.stringify(row.slots); const group = groups.find(item => JSON.stringify(item.slots) === key); if (group) group.days.push(row.day); else groups.push({ days: [row.day], slots: row.slots }); } return groups; }
export function availabilitySummary(value: CaregiverAvailability) { const groups = availabilityGroups(value); return groups.length ? groups.map(group => `${availabilityDays(group.days)} · ${group.slots.map(slot => `${availabilityTime(slot.start)}–${availabilityTime(slot.end)}`).join(", ")}`).join("; ") : "Currently unavailable"; }
export function weeklyHours(value: CaregiverAvailability) { return availabilitySchedule(value).reduce((total, row) => total + row.slots.reduce((sum, slot) => { const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3)); return sum + (minutes(slot.end) - minutes(slot.start)) / 60; }, 0), 0); }
