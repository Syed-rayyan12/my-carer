"use client";
import { createContext, useContext, useMemo, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthBoundary';
import { accountApi } from '@/components/auth/auth-client';
import { useAdminDashboard } from './AdminDashboardContext';
import { mapRequests, mapMessages, mapReviews, parseBudget } from './admin-live';
import { type AdminBlogPost } from './blog/adminBlogData';
import type { AdminCareRequest } from './care-requests/careRequestsData';
import type { AdminMessage } from './messages/adminMessagesData';
import type { AdminReview } from './reviews/adminReviewsData';
export type AdminContentData = { requests: AdminCareRequest[]; posts: AdminBlogPost[]; messages: AdminMessage[]; reviews: AdminReview[] };
export const initialAdminContent: AdminContentData = { requests: [], posts: [], messages: [], reviews: [] };
export function isAdminContent(value: unknown): value is AdminContentData { return !!value && typeof value === 'object' && ['requests','posts','messages','reviews'].every(key => Array.isArray((value as Record<string, unknown>)[key])); }
function useContentState() {
  const admin = useAdminDashboard(); const auth = useAuth()!;
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [blogReady, setBlogReady] = useState(false);
  const loadPosts = useCallback(async () => {
    try { const r = await accountApi<{data: AdminBlogPost[]}>('platform/admin/blog'); setPosts(r.data); }
    catch(e) { admin.setError(e instanceof Error ? e.message : 'Unable to load blog'); }
    finally { setBlogReady(true); }
  }, [admin.setError]);
  // The loader only updates state after the HTTP request settles.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadPosts(); }, [loadPosts]);
  const data = useMemo(() => ({ requests: mapRequests(admin.snapshot), messages: mapMessages(admin.snapshot, auth.user.id), reviews: mapReviews(admin.snapshot), posts: posts }), [admin.snapshot, auth.user.id, posts]);
  const updateRequest = async (request: AdminCareRequest) => {
    try { return await admin.mutate(`platform/requests/${request.id}`, { title: request.careType, location: request.location, schedule: request.availability, budgetPence: parseBudget(request.budget), description: request.description, status: request.status === 'Removed' ? 'CLOSED' : 'OPEN' }); }
    catch (issue) { admin.setError(issue instanceof Error ? issue.message : 'Unable to save request'); return false; }
  };
  const updateMessage = async (message: AdminMessage) => {
    const current = data.messages.find(item => item.id === message.id);
    const reply = message.replies.length > (current?.replies.length ?? 0) ? message.replies.at(-1) : undefined;
    if (reply) return admin.mutate('platform/messages', { recipientId: message.id, body: reply }, 'POST');
    if (message.status === 'Archived' || current?.status === 'Archived') { admin.setError('Message archiving is not enabled by the backend.'); return false; }
    return true;
  };
  const updateReview = (review: AdminReview) => admin.mutate(`platform/admin/reviews/${review.id}`, { visible: review.status === 'Published' });
  const savePost = async (post: AdminBlogPost) => {
    try { await accountApi('platform/admin/blog', {method:'POST', body:Object.fromEntries(['id','title','description','content','category','author','date','status','image','seoTitle','metaDescription'].map(key=>[key,post[key as keyof AdminBlogPost]])), csrfToken:auth.csrfToken}); await loadPosts(); return true; }
    catch(e) { admin.setError(e instanceof Error ? e.message : 'Unable to save blog'); return false; }
  };
  const deletePost = async (id: string) => {
    try { await accountApi('platform/admin/blog/'+id, {method:'DELETE', body:{}, csrfToken:auth.csrfToken}); await loadPosts(); return true; }
    catch(e) { admin.setError(e instanceof Error ? e.message : 'Unable to delete blog'); return false; }
  };
  return { data, ready: admin.ready && blogReady, storageError: false, notice: admin.notice, updateRequest, updateMessage, updateReview, savePost, deletePost };
}
const ContentContext = createContext<ReturnType<typeof useContentState> | null>(null);
export function AdminContentProvider({ children }: { children: ReactNode }) { const value = useContentState(); return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>; }
export function useAdminContent() { const value = useContext(ContentContext); if (!value) throw new Error('AdminContentProvider is required'); return value; }
