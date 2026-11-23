"use client";
import { createContext, useContext, type ReactNode } from 'react';
import { useAdminDashboard } from '../AdminDashboardContext';
import { mapJobs, parseBudget } from '../admin-live';
import type { AdminCareJob } from './careJobsData';
function useCareJobsState() {
  const admin = useAdminDashboard(); const jobs = mapJobs(admin.snapshot);
  const saveJob = async (job: AdminCareJob) => {
    try {
      if ((job.priority ?? 'Normal') !== 'Normal' || job.careNeededBy) throw new Error('Care urgency and required start date are not supported by the current backend.');
      return await admin.mutate(`platform/requests/${job.id}`, { title: job.title, tasks: job.careType, location: job.location, budgetPence: parseBudget(job.payRate), schedule: job.schedule, description: job.description });
    } catch (issue) { admin.setError(issue instanceof Error ? issue.message : 'Unable to save job'); return false; }
  };
  const decide = (id: string, status: 'Active' | 'Removed') => admin.mutate(`platform/requests/${id}`, { status: status === 'Active' ? 'OPEN' : 'CLOSED' });
  return { jobs, ready: admin.ready, storageError: false, notice: admin.notice, saveJob, decide };
}
const CareJobsContext = createContext<ReturnType<typeof useCareJobsState> | null>(null);
export function CareJobsProvider({ children }: { children: ReactNode }) { const value = useCareJobsState(); return <CareJobsContext.Provider value={value}>{children}</CareJobsContext.Provider>; }
export function useCareJobs() { const value = useContext(CareJobsContext); if (!value) throw new Error('CareJobsProvider is required'); return value; }
