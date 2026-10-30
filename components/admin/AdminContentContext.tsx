"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePersistentDashboardState } from "@/components/dashboard/usePersistentDashboardState";
import { initialCareRequests, type AdminCareRequest } from "./care-requests/careRequestsData";
import { initialAdminBlogPosts, type AdminBlogPost } from "./blog/adminBlogData";
import { initialAdminMessages, type AdminMessage } from "./messages/adminMessagesData";
import { initialAdminReviews, type AdminReview } from "./reviews/adminReviewsData";

export type AdminContentData = { requests: AdminCareRequest[]; posts: AdminBlogPost[]; messages: AdminMessage[]; reviews: AdminReview[] };
export const initialAdminContent: AdminContentData = { requests: initialCareRequests, posts: initialAdminBlogPosts, messages: initialAdminMessages, reviews: initialAdminReviews };
function strings(record: Record<string, unknown>, keys: string[]) { return keys.every(key => typeof record[key] === "string"); }
export function isAdminContent(value: unknown): value is AdminContentData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return Array.isArray(data.requests) && data.requests.every(item => item && strings(item, ["id", "name", "initials", "careType", "location", "date", "availability", "budget", "description"]) && ["Pending", "Active", "Removed"].includes(item.status) && Array.isArray(item.matches) && item.matches.every((match: Record<string, unknown>) => match && strings(match, ["id", "name", "initials", "distance"]) && typeof match.rating === "number" && match.rating >= 1 && match.rating <= 5))
    && Array.isArray(data.posts) && data.posts.every(item => item && strings(item, ["id", "title", "description", "content", "category", "author", "date", "image", "seoTitle", "metaDescription"]) && ["Published", "Draft"].includes(item.status))
    && Array.isArray(data.messages) && data.messages.every(item => item && strings(item, ["id", "name", "initials", "subject", "message", "draft"]) && ["New", "Replied", "Archived"].includes(item.status) && Array.isArray(item.replies) && item.replies.every((reply: unknown) => typeof reply === "string"))
    && Array.isArray(data.reviews) && data.reviews.every(item => item && strings(item, ["id", "name", "caregiver", "title", "message"]) && ["Pending", "Published", "Hidden"].includes(item.status) && Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5);
}
function useContentState() {
  const { value: data, setValue: setData, ready, storageError } = usePersistentDashboardState("my-carer-admin-content", initialAdminContent, isAdminContent);
  const [notice, setNotice] = useState("");
  function updateRequest(request: AdminCareRequest) { if (!ready) return; setData(current => ({ ...current, requests: current.requests.map(item => item.id === request.id ? request : item) })); setNotice("Care request saved in this local preview."); }
  function savePost(post: AdminBlogPost) { if (!ready) return; setData(current => ({ ...current, posts: current.posts.some(item => item.id === post.id) ? current.posts.map(item => item.id === post.id ? post : item) : [...current.posts, post] })); setNotice(`Post saved as ${post.status.toLowerCase()} on this device. The public website has not been changed.`); }
  function deletePost(id: string) { if (!ready) return; setData(current => ({ ...current, posts: current.posts.filter(item => item.id !== id) })); setNotice("Post deleted from this local preview."); }
  function updateMessage(message: AdminMessage) { if (!ready) return; setData(current => ({ ...current, messages: current.messages.map(item => item.id === message.id ? message : item) })); }
  function updateReview(review: AdminReview) { if (!ready) return; setData(current => ({ ...current, reviews: current.reviews.map(item => item.id === review.id ? review : item) })); setNotice(`Review ${review.status.toLowerCase()} in this local preview.`); }
  return { data, ready, storageError, notice, updateRequest, savePost, deletePost, updateMessage, updateReview };
}
const ContentContext = createContext<ReturnType<typeof useContentState> | null>(null);
export function AdminContentProvider({ children }: { children: ReactNode }) { const value = useContentState(); return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>; }
export function useAdminContent() { const value = useContext(ContentContext); if (!value) throw new Error("AdminContentProvider is required"); return value; }
