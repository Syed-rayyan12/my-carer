"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CareRequirement = {
  id: string;
  title: string;
  postedAt: string;
  status: "active" | "closed";
  careType: string;
  location: string;
  recipient: string;
  startDate: string;
  frequency: string;
  preferredTimes: string[];
  hours: string;
  budget: string;
  description: string;
  preferences: string[];
  schedule: string;
  responses: number;
};

export type RequirementInput = Omit<CareRequirement, "id" | "postedAt" | "status" | "responses">;

export const initialRequirements: CareRequirement[] = [
  { id: "dementia-care", title: "Dementia Care for Mum", postedAt: "2026-10-08", status: "active", careType: "Dementia Care", location: "Manchester", recipient: "Parent", startDate: "2026-10-15", frequency: "Weekly", preferredTimes: ["Morning"], hours: "5", budget: "18–22", description: "", preferences: ["Dementia experience", "Companionship"], schedule: "Monday–Friday: 9:00 AM–2:00 PM", responses: 4 },
  { id: "weekend-respite", title: "Weekend Respite Care", postedAt: "2026-10-02", status: "active", careType: "Respite Care", location: "Manchester", recipient: "Parent", startDate: "2026-10-24", frequency: "Weekly", preferredTimes: ["Morning", "Afternoon"], hours: "6", budget: "16–20", description: "", preferences: ["Personal care"], schedule: "Saturdays: 10:00 AM–4:00 PM", responses: 4 },
  { id: "post-surgery", title: "Post-surgery Support for Dad", postedAt: "2026-07-20", status: "closed", careType: "Post-surgery Support", location: "Stockport", recipient: "Parent", startDate: "2026-08-03", frequency: "Daily", preferredTimes: ["Morning"], hours: "3", budget: "17–21", description: "", preferences: ["Mobility assistance"], schedule: "Daily: 8:00 AM–11:00 AM", responses: 3 },
];

type RequirementsState = {
  requirements: CareRequirement[];
  ready: boolean;
  storageError: boolean;
  createRequirement: (input: RequirementInput) => void;
  updateRequirement: (id: string, input: RequirementInput) => void;
  closeRequirement: (id: string) => void;
};

const RequirementsContext = createContext<RequirementsState | null>(null);
const storageKey = "my-carer-care-requirements";

function isRequirement(value: unknown): value is CareRequirement {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const strings = ["id", "title", "postedAt", "careType", "location", "recipient", "startDate", "frequency", "hours", "budget", "description", "schedule"];
  return strings.every(key => typeof item[key] === "string") && (item.status === "active" || item.status === "closed") && typeof item.responses === "number" && Array.isArray(item.preferredTimes) && item.preferredTimes.every(value => typeof value === "string") && Array.isArray(item.preferences) && item.preferences.every(value => typeof value === "string");
}

export function CareRequirementsProvider({ children }: { children: ReactNode }) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(isRequirement)) setRequirements(parsed);
      }
    } catch { setStorageError(true); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(requirements)); }
    catch { setStorageError(true); }
  }, [requirements, ready]);

  function createRequirement(input: RequirementInput) {
    setRequirements(current => [{ ...input, id: crypto.randomUUID(), postedAt: new Date().toISOString().slice(0, 10), status: "active", responses: 0 }, ...current]);
  }

  function updateRequirement(id: string, input: RequirementInput) {
    setRequirements(current => current.map(item => item.id === id ? { ...item, ...input } : item));
  }

  function closeRequirement(id: string) {
    setRequirements(current => current.map(item => item.id === id ? { ...item, status: "closed" } : item));
  }

  return <RequirementsContext.Provider value={{ requirements, ready, storageError, createRequirement, updateRequirement, closeRequirement }}>{children}</RequirementsContext.Provider>;
}

export function useCareRequirements() {
  const context = useContext(RequirementsContext);
  if (!context) throw new Error("Care requirement components must be inside CareRequirementsProvider");
  return context;
}

export function formatRequirementDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(parsed);
}
