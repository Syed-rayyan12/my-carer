"use client";

import { useState } from "react";
import { useAdminContent } from "../AdminContentContext";
import { useAdminDashboard } from "../AdminDashboardContext";
import AdminPage from "../shared/AdminPage";
import AdminTabs from "../shared/AdminTabs";
import AdminReviewsTable from "./AdminReviewsTable";
import AdminReviewModal from "./AdminReviewModal";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function AdminReviewsPage() {
  const { data, ready, storageError, notice, updateReview } = useAdminContent();
  const { search } = useAdminDashboard();
  const [tab, setTab] = useState("Pending");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = data.reviews.find(item => item.id === selectedId);
  const reviews = data.reviews.filter(item => (tab === "All" || item.status === tab) && `${item.name} ${item.caregiver} ${item.title} ${item.message}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <AdminPage title="Reviews" description="Moderate what care seekers say about caregivers before it’s public.">{notice && <p role="status" className="mb-4 text-sm text-[#61706c]">{notice}</p>}{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Moderation changes will last for this visit.</p>}{!ready ? <AdminCaregiversTableSkeleton label="Loading reviews" /> : <section className="min-h-[450px] overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"><AdminTabs tabs={[{ label: "Needs moderation", value: "Pending" }, { label: "Published", value: "Published" }, { label: "Hidden", value: "Hidden" }, { label: "All", value: "All" }].map(tab => ({ ...tab, count: tab.value === "All" ? data.reviews.length : data.reviews.filter(item => item.status === tab.value).length }))} active={tab} onChange={setTab} /><AdminReviewsTable reviews={reviews} onView={review => setSelectedId(review.id)} /></section>}{selected && <AdminReviewModal review={selected} onClose={() => setSelectedId(null)} onSave={review => { updateReview(review); setSelectedId(null); }} />}</AdminPage>;
}
