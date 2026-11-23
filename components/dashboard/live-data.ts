import type {
  LiveCaregiver,
  LiveRequest,
  WorkspaceSnapshot,
} from "@/components/platform/LiveWorkspace";
import { personName } from "@/components/platform/LiveWorkspace";
import type { DirectoryCaregiver } from "./caregivers/caregiverDirectoryData";
import type { CareRequirement } from "./requirements/CareRequirementsContext";
export function directoryPerson(person: LiveCaregiver): DirectoryCaregiver {
  const p = person.professional;
  const ratings = person.reviewsReceived ?? [];
  return {
    id: person.id,
    name: personName(person),
    initials: `${person.firstName[0] ?? ""}${person.lastName[0] ?? ""}`,
    image: person.photo ?? "",
    specialty: p?.services || "Caregiver",
    location: p?.location ?? "",
    hourlyRate: (p?.hourlyRatePence ?? 0) / 100,
    rating: ratings.length
      ? ratings.reduce((total, item) => total + item.rating, 0) / ratings.length
      : 0,
    reviews: ratings.length,
    careTypes: p?.services.split(/[,\n]/).filter(Boolean) ?? [],
    experience: Number.parseFloat(p?.experience ?? "") || 0,
    verified: ["DBS", "RIGHT_TO_WORK"].every((kind) =>
      person.verifications.some((item) => item.kind === kind),
    ),
    availability: p?.availability ? [p.availability] : [],
    about: p?.bio ?? "",
    qualifications: p?.qualifications.split("\n").filter(Boolean) ?? [],
  };
}
export function workspaceDirectory(
  snapshot: WorkspaceSnapshot,
): DirectoryCaregiver[] {
  const all = [
    ...snapshot.caregivers,
    ...snapshot.applications.flatMap((item) =>
      item.caregiver ? [item.caregiver] : [],
    ),
  ];
  return [
    ...new Map(
      all.map((person) => [person.id, directoryPerson(person)]),
    ).values(),
  ];
}
export function requirementRecord(item: LiveRequest): CareRequirement {
  const d = item.details ?? {};
  const str = (key: string, fallback = "") =>
    typeof d[key] === "string" ? (d[key] as string) : fallback;
  const list = (key: string) =>
    Array.isArray(d[key])
      ? (d[key] as unknown[]).filter((v): v is string => typeof v === "string")
      : [];
  return {
    id: item.id,
    title: item.title,
    postedAt: item.createdAt.slice(0, 10),
    status: item.status === "OPEN" ? "active" : "closed",
    careType: str("careType", item.tasks),
    location: item.location,
    recipient: str("recipient", "Other"),
    startDate: str("startDate"),
    frequency: str("frequency", "Flexible"),
    preferredTimes: list("preferredTimes"),
    hours: str("hours"),
    budget: str("budget", String(item.budgetPence / 100)),
    description: item.description,
    preferences: list("preferences"),
    schedule: item.schedule,
    responses: item._count?.applications ?? 0,
  };
}
