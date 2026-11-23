"use client";

import { useState } from "react";
import { useAdminContent } from "../AdminContentContext";
import { useAdminDashboard } from "../AdminDashboardContext";
import AdminPage from "../shared/AdminPage";
import AdminMessageRow from "./AdminMessageRow";
import AdminReplyModal from "./AdminReplyModal";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function AdminMessagesPage() {
  const { data, ready, storageError, updateMessage } = useAdminContent();
  const { search } = useAdminDashboard();
  const [tab, setTab] = useState("New");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const message = data.messages.find(item => item.id === selectedId);
  const messages = data.messages.filter(item => (tab === "All" || item.status === tab) && `${item.name} ${item.subject} ${item.message} ${item.replies.join(" ")}`.toLowerCase().includes(search.trim().toLowerCase()));
  return <AdminPage title="Messages" description="Reply to users and track complaints through to resolution.">{!ready ? <AdminCaregiversTableSkeleton label="Loading admin messages" /> : <><div className="mb-6 flex flex-wrap gap-1 rounded-[10px] border border-[#d9d9d9] bg-white p-0.5" aria-label="Message status">{["New", "Replied", "Archived", "All"].map(status => <button key={status} type="button" aria-pressed={tab === status} onClick={() => setTab(status)} className={`min-h-8 rounded-lg px-3 text-sm ${tab === status ? "bg-white text-[#182522] shadow-[0_4px_16px_#0002]" : "text-[#71817b]"}`}>{status} <span className={`ml-1 text-xs ${tab === status ? "text-[#ff2f68]" : "text-[#71817b]"}`}>{status === "All" ? data.messages.length : data.messages.filter(item => item.status === status).length}</span></button>)}</div>{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Replies will only last for this visit.</p>}<section className="overflow-hidden rounded-[10px] border border-[#d9d9d9] bg-white">{messages.map((item, index) => <AdminMessageRow key={item.id} message={item} index={index} onReply={() => setSelectedId(item.id)} onArchive={() => updateMessage({ ...item, status: item.status === "Archived" ? item.replies.length ? "Replied" : "New" : "Archived" })} />)}{!messages.length && <p className="py-12 text-center text-sm text-[#667085]">No messages match this view.</p>}</section></>}{message && <AdminReplyModal key={message.id} message={message} onClose={() => setSelectedId(null)} onSave={updateMessage} />}</AdminPage>;
}
