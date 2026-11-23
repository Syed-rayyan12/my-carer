"use client";

import { useState } from "react";
import { useAdminContent } from "../AdminContentContext";
import { useAdminDashboard } from "../AdminDashboardContext";
import AdminPage from "../shared/AdminPage";
import AdminTabs from "../shared/AdminTabs";
import CareRequestsTable from "./CareRequestsTable";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function CareRequestsPage() {
  const { data, ready, storageError } = useAdminContent();
  const { search } = useAdminDashboard();
  const [tab, setTab] = useState("All");
  const requests = data.requests.filter(request => (tab === "All" || request.status === tab) && `${request.name} ${request.location} ${request.careType}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <AdminPage title="Care Requests" description="Care seeker requirements and their caregiver matches.">{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Changes will last for this visit.</p>}{!ready ? <AdminCaregiversTableSkeleton label="Loading care requests" /> : <section className="min-h-[450px] overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"><AdminTabs tabs={["All", "Pending", "Active", "Removed"].map(status => ({ label: status, value: status, count: status === "All" ? data.requests.length : data.requests.filter(request => request.status === status).length }))} active={tab} onChange={setTab} /><CareRequestsTable requests={requests} /></section>}</AdminPage>;
}
