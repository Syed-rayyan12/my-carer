"use client";
import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useLiveWorkspace } from "@/components/platform/LiveWorkspace";
import { requirementRecord } from "../live-data";
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
export type RequirementInput = Omit<
  CareRequirement,
  "id" | "postedAt" | "status" | "responses"
>;
export const initialRequirements: CareRequirement[] = [];
function useRequirements() {
  const live = useLiveWorkspace();
  const pathname = usePathname();
  const requirements = /\/(care-requirements|my-requests)(\/|$)/.test(pathname)
    ? live.snapshot.requests.map(requirementRecord)
    : [];
  const save = (input: RequirementInput, id?: string) => {
    const range = input.budget.split(/[–-]/).map(Number);
    const budget = range[0];
    if (
      range.length > 2 ||
      range.some(
        (value) => !Number.isFinite(value) || value <= 0 || value > 10000,
      ) ||
      (range.length === 2 && range[1] < budget)
    ) {
      live.setError(
        "Enter a positive hourly budget or range, for example 20 or 18–22.",
      );
      return Promise.resolve(false);
    }
    return live.mutate(
      id ? `platform/requests/${id}` : "platform/requests",
      {
        title: input.title,
        description: input.description || input.title,
        location: input.location,
        budgetPence: Math.round(budget * 100),
        fundingType: "Private",
        tasks: input.careType,
        schedule: input.schedule,
        details: input,
      },
      id ? "PATCH" : "POST",
    );
  };
  return {
    requirements,
    ready: live.ready,
    storageError: false,
    createRequirement: (input: RequirementInput) => save(input),
    updateRequirement: (id: string, input: RequirementInput) => save(input, id),
    closeRequirement: (id: string) =>
      live.mutate(`platform/requests/${id}`, { status: "CLOSED" }),
  };
}
const Context = createContext<ReturnType<typeof useRequirements> | null>(null);
export function CareRequirementsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useRequirements();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCareRequirements() {
  const value = useContext(Context);
  if (!value) throw new Error("CareRequirementsProvider is required");
  return value;
}

export function formatRequirementDate(value: string) {
  if (!value) return "Not specified";
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}
