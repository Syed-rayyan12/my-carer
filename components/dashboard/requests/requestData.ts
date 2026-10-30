import { allDashboardCaregivers } from "../caregivers/caregiverDirectoryData";
import type { CareRequirement } from "../requirements/CareRequirementsContext";

export type RequestTab = "all" | "active" | "responses" | "closed";

export function filterRequests(requirements: CareRequirement[], tab: RequestTab) {
  if (tab === "active") return requirements.filter(requirement => requirement.status === "active");
  if (tab === "closed") return requirements.filter(requirement => requirement.status === "closed");
  if (tab === "responses") return requirements.filter(requirement => requirement.responses > 0);
  return requirements;
}

export function getRequestResponders(requirement: CareRequirement) {
  const responseIds: Record<string, string[]> = {
    "dementia-care": ["sarah-mitchell", "james-wilson", "amira-khan", "david-okafor"],
    "weekend-respite": ["emily-clarke", "mohammed-ali", "james-wilson", "michael-oconnor"],
    "post-surgery": ["david-okafor", "priya-patel", "james-wilson"],
  };
  const ids = responseIds[requirement.id];
  if (!ids) return [];
  return ids.slice(0, requirement.responses).flatMap(id => {
    const caregiver = allDashboardCaregivers.find(person => person.id === id);
    return caregiver ? [caregiver] : [];
  });
}

export function formatRequestBudget(budget: string) {
  return `£${budget.replace(/[–-]/g, "–£")}/hour`;
}
