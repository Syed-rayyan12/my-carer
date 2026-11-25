import Link from 'next/link';
import { connection } from 'next/server';
import { loadPublishedPosts } from '@/config/public-blog';
import PublishedBlogCard from './PublishedBlogCard';

export default async function BlogCards({ limit }: { limit?: number }) {
  await connection();
  const posts = await loadPublishedPosts(limit).catch(() => null);
  if (!posts) return <section className="mx-auto w-[min(1100px,calc(100%-40px))] py-10"><p role="alert">Articles are temporarily unavailable. <Link href="/blogs?retry=1" prefetch={false} className="text-[#ff2f68] underline">Try again</Link></p></section>;
  return <section className="mx-auto w-[min(1100px,calc(100%-40px))] py-10">
    {!posts.length && <p className="py-10 text-center text-slate-600">Our first articles are coming soon.</p>}
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{posts.map(post => <PublishedBlogCard key={post.id} post={post} />)}</div>
  </section>;
}
