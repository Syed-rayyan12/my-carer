"use client";

import { useState } from "react";
import { usePersistentDashboardState } from "@/components/dashboard/usePersistentDashboardState";
import { useAdminDashboard } from "../AdminDashboardContext";
import AdminPage from "../shared/AdminPage";
import AdminTabs from "../shared/AdminTabs";
import SubscriptionStats from "./SubscriptionStats";
import SubscriptionsTable from "./SubscriptionsTable";
import PaymentDetailsModal from "./PaymentDetailsModal";
import { initialSubscriptions, isSubscriptions, filterSubscriptions, refundSubscription } from "./subscriptionsData";
import SubscriptionsSkeleton from "./SubscriptionsSkeleton";

export default function SubscriptionsPage() {
  const { value: records, setValue: setRecords, ready, storageError } = usePersistentDashboardState("my-carer-admin-subscriptions", initialSubscriptions, isSubscriptions);
  const { search } = useAdminDashboard();
  const [tab, setTab] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const selected = records.find(record => record.id === selectedId);
  if (!ready) return <SubscriptionsSkeleton />;
  return <AdminPage title="Subscriptions" description="Revenue, plans and individual transactions."><SubscriptionStats records={records} />{notice && <p role="status" className="mb-4 text-sm text-[#61706c]">{notice}</p>}{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Changes will last for this visit.</p>}<section className="overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"><AdminTabs tabs={["All", "Active", "Pending", "Cancelled"].map(status => ({ label: status, value: status, count: status === "All" ? records.length : records.filter(record => record.status === status).length }))} active={tab} onChange={setTab} /><SubscriptionsTable records={filterSubscriptions(records, tab, search)} onView={record => setSelectedId(record.id)} /></section><p className="mt-3 text-xs text-[#61706c]">Sample subscription data. Payments and refunds are not connected to a payment provider.</p>{selected && <PaymentDetailsModal key={selected.id} record={selected} onClose={() => setSelectedId(null)} onRefund={() => { if (selected.payment !== "Paid") return; setRecords(current => refundSubscription(current, selected.id)); setSelectedId(null); setNotice(`${selected.name}'s payment marked as refunded on this device. No money has been moved.`); }} />}</AdminPage>;
}
