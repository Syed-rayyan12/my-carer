"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePersistentDashboardState } from "@/components/dashboard/usePersistentDashboardState";
import { initialCareJobs, isCareJobs, type AdminCareJob } from "./careJobsData";

function useCareJobsState() {
  const { value: jobs, setValue: setJobs, ready, storageError } = usePersistentDashboardState("my-carer-admin-care-jobs", initialCareJobs, isCareJobs);
  const [notice, setNotice] = useState("");
  function saveJob(updated: AdminCareJob) {
    if (!ready) return;
    setJobs(current => current.map(job => job.id === updated.id ? { ...updated, title: updated.title.trim(), location: updated.location.trim() } : job));
    setNotice("Job changes saved on this device.");
  }
  function decide(id: string, status: "Active" | "Removed") {
    if (!ready) return;
    setJobs(current => current.map(job => job.id === id && (status === "Removed" || job.status === "Pending") ? { ...job, status } : job));
    setNotice(status === "Active" ? "Job approved in this local preview." : "Job removed in this local preview. No applicants have been notified.");
  }
  return { jobs, ready, storageError, notice, saveJob, decide };
}
const CareJobsContext = createContext<ReturnType<typeof useCareJobsState> | null>(null);
export function CareJobsProvider({ children }: { children: ReactNode }) { const value = useCareJobsState(); return <CareJobsContext.Provider value={value}>{children}</CareJobsContext.Provider>; }
export function useCareJobs() { const value = useContext(CareJobsContext); if (!value) throw new Error("CareJobsProvider is required"); return value; }
