import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { env } from '@/config/env';
import WebsitePageShell from '@/components/website/WebsitePageShell';
import BlogPageHero from '@/components/website/BlogPageHero';
import BlogArticleBody from '@/components/admin/blog/BlogArticleBody';
import type { AdminBlogPost } from '@/components/admin/blog/adminBlogData';
async function article(id: string): Promise<AdminBlogPost | null> {
  if (!/^[a-z0-9-]{1,100}$/.test(id)) return null;
  const response = await fetch(`${env.BACKEND_URL}/api/v1/platform/blog/${id}`, { cache:'no-store' });
  if(response.status === 404) return null;
  if(!response.ok) throw new Error('Unable to load article');
  return (await response.json()).data;
}
export async function generateMetadata({params}: {params:Promise<{id:string}>}):Promise<Metadata> {
  const post=await article((await params).id);
  return {title:post?.seoTitle || post?.title || 'Article | My Carer', description:post?.metaDescription || post?.description};
}
export default async function BlogArticlePage({params}: {params:Promise<{id:string}>}) {
  const post=await article((await params).id); if(!post) notFound();
  return <WebsitePageShell activePage="blogs"><BlogPageHero label={post.category || "Blog"} title={post.title} description={post.description} /><article className="mx-auto max-w-3xl px-5 py-12"><Link href="/blogs" className="font-semibold text-[#ff2f68]">All articles</Link><p className="mt-8 text-sm text-slate-600">{post.category} · {post.date} · {post.author}</p>{post.image && <img src={post.image} alt={post.title} className="mb-8 aspect-video w-full rounded-xl object-cover" />}<BlogArticleBody content={post.content}/></article></WebsitePageShell>;
}
