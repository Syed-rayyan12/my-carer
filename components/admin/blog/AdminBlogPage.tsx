"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAdminContent } from "../AdminContentContext";
import { useAdminDashboard } from "../AdminDashboardContext";
import AdminPage from "../shared/AdminPage";
import AdminTabs from "../shared/AdminTabs";
import AdminBlogTable from "./AdminBlogTable";
import BlogPostModal from "./BlogPostModal";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function AdminBlogPage() {
  const { data, ready, storageError, notice, deletePost } = useAdminContent();
  const { search: globalSearch } = useAdminDashboard();
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ id: string; action: "preview" | "delete" } | null>(null);
  const post = data.posts.find(item => item.id === modal?.id);
  const posts = data.posts.filter(item => (tab === "All" || item.status === tab) && item.title.toLowerCase().includes(search.trim().toLowerCase()) && `${item.title} ${item.category} ${item.author}`.toLowerCase().includes(globalSearch.trim().toLowerCase()));
  return <AdminPage title="Blog" description="Articles published on the My Carer website." action={<Link href="/admin-dashboard/blog/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#ff2f68] px-4 text-base text-white"><Plus size={16} />Add Blog</Link>}>{notice && <p role="status" className="mb-4 text-sm text-[#61706c]">{notice}</p>}{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable. Changes will last for this visit.</p>}{!ready ? <AdminCaregiversTableSkeleton label="Loading blog posts" /> : <section className="overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"><div className="flex flex-wrap items-center justify-between gap-3 pt-3"><AdminTabs tabs={[{ label: "All", value: "All", count: data.posts.length }, { label: "Published", value: "Published", count: data.posts.filter(item => item.status === "Published").length }, { label: "Drafts", value: "Draft", count: data.posts.filter(item => item.status === "Draft").length }]} active={tab} onChange={setTab} /><input aria-label="Search blog titles" type="search" placeholder="Search titles" value={search} onChange={event => setSearch(event.target.value)} className="mr-3 mb-3 h-[38px] w-[290px] max-w-[calc(100%-24px)] rounded-lg border border-[#e3e5e7] px-4 text-sm outline-none placeholder:text-[#98a2b3] focus:border-[#ff2f68] max-[700px]:ml-3" /></div><AdminBlogTable posts={posts} onPreview={item => setModal({ id: item.id, action: "preview" })} onDelete={item => setModal({ id: item.id, action: "delete" })} /></section>}{post && modal && <BlogPostModal post={post} action={modal.action} onClose={() => setModal(null)} onDelete={() => { deletePost(post.id); setModal(null); }} />}</AdminPage>;
}
