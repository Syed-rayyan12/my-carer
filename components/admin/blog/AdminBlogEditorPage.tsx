"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAdminContent } from "../AdminContentContext";
import AdminPage from "../shared/AdminPage";
import AdminContentSkeleton from "../shared/AdminContentSkeleton";
import BlogEditorForm from "./BlogEditorForm";
import { newBlogPost } from "./adminBlogData";

function NewPostEditor() { const [post] = useState(newBlogPost); const { savePost } = useAdminContent(); const router = useRouter(); return <BlogEditorForm post={post} isNew onSave={updated => { savePost(updated); router.replace(`/admin-dashboard/blog/${updated.id}`); }} />; }
export default function AdminBlogEditorPage({ postId }: { postId?: string }) {
  const { data, ready, notice, storageError, savePost } = useAdminContent();
  if (!ready) return <AdminContentSkeleton detail label="Loading blog editor" />;
  const post = data.posts.find(item => item.id === postId);
  return <AdminPage><section className="min-h-[calc(100dvh-112px)] rounded-xl border border-[#d9d9d9] bg-white px-3.5 pt-4 pb-5"><Link href="/admin-dashboard/blog" className="inline-flex items-center gap-2 text-sm text-[#ff2f68]"><ArrowLeft size={16} />Blog</Link>{notice && <p role="status" className="mt-4 text-sm text-[#61706c]">{notice}</p>}{storageError && <p role="status" className="mt-4 text-sm text-amber-700">Browser storage is unavailable or full. Your changes cannot persist after this visit.</p>}{!postId ? <NewPostEditor /> : post ? <BlogEditorForm key={post.id} post={post} isNew={false} onSave={savePost} /> : <h1 className="mt-8 text-xl font-bold">Blog post not found</h1>}</section></AdminPage>;
}
