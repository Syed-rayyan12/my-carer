import 'server-only';
import { cache } from 'react';
import { env } from './env';
import type { AdminBlogPost } from '@/components/admin/blog/adminBlogData';

export const PUBLIC_BLOG_TAG = 'public-blog';
export type BlogCardPost = Pick<AdminBlogPost, 'id' | 'title' | 'description' | 'category' | 'date' | 'image'>;
export const loadPublishedPosts = cache(async (limit = 100): Promise<BlogCardPost[]> => {
  const response = await fetch(`${env.BACKEND_URL}/api/v1/platform/blog?limit=${limit}`, {
    next: { revalidate: 30, tags: [PUBLIC_BLOG_TAG] }, signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error('Unable to load articles');
  return (await response.json()).data;
});
export const loadPublishedArticle = cache(async (id: string): Promise<AdminBlogPost | null> => {
  if (!/^[a-z0-9-]{1,100}$/.test(id)) return null;
  const response = await fetch(`${env.BACKEND_URL}/api/v1/platform/blog/${id}`, {
    next: { revalidate: 30, tags: [PUBLIC_BLOG_TAG] }, signal: AbortSignal.timeout(5000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load article');
  return (await response.json()).data;
});
