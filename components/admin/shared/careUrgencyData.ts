export const carePriorities = ["Normal", "High", "Critical"] as const;
export type CarePriority = typeof carePriorities[number];
export function isCarePriority(value: unknown): value is CarePriority { return carePriorities.some(priority => priority === value); }
export function isCareNeededDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  if (!value) return true;
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function formatCareNeededDate(value?: string) {
  if (!value || !isCareNeededDate(value)) return "Not specified";
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
}
