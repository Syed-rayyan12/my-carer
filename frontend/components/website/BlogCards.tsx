"use client";
import { useEffect, useState } from 'react';
import { accountApi } from '@/components/auth/auth-client';
import type { AdminBlogPost } from '@/components/admin/blog/adminBlogData';
import PublishedBlogCard from './PublishedBlogCard';
export default function BlogCards({ limit }: { limit?: number }) {
  const [posts, setPosts] = useState<AdminBlogPost[]>([]);
  const [ready, setReady] = useState(false); const [error, setError] = useState('');
  useEffect(() => { let active=true; let generation=0;
    const load = () => {
      const current=++generation;
      accountApi<{data: AdminBlogPost[]}>(`platform/blog${limit ? `?limit=${limit}` : ''}`).then(r => {if(active && current===generation) {setPosts(r.data);setError('');}})
        .catch(() => {if(active && current===generation) setError('Articles could not be loaded. Please refresh to retry.');})
        .finally(() => {if(active && current===generation) setReady(true);});
    };
    load(); window.addEventListener('focus',load); window.addEventListener('pageshow',load);
    return () => {active=false;window.removeEventListener('focus',load);window.removeEventListener('pageshow',load);};
  }, [limit]);
  return <section className="mx-auto w-[min(1100px,calc(100%-40px))] py-10">
    {!ready && <p role="status">Loading articles</p>}{error && <p role="alert">{error}</p>}
    {ready && !error && !posts.length && <p className="py-10 text-center text-slate-600">Our first articles are coming soon.</p>}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map(post => <PublishedBlogCard key={post.id} post={post} />)}</div>
  </section>;
}
