import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadPublishedArticle } from '@/config/public-blog';
import WebsitePageShell from '@/components/website/WebsitePageShell';
import BlogPageHero from '@/components/website/BlogPageHero';
import BlogArticleBody from '@/components/admin/blog/BlogArticleBody';
export async function generateMetadata({params}: {params:Promise<{id:string}>}):Promise<Metadata> {
  const post=await loadPublishedArticle((await params).id);
  return {title:post?.seoTitle || post?.title || 'Article | My Carer', description:post?.metaDescription || post?.description};
}
export default async function BlogArticlePage({params}: {params:Promise<{id:string}>}) {
  const post=await loadPublishedArticle((await params).id); if(!post) notFound();
  return <WebsitePageShell activePage="blogs"><BlogPageHero label={post.category || "Blog"} title={post.title} description={post.description} /><article className="mx-auto max-w-3xl px-5 py-12"><Link href="/blogs" className="font-semibold text-[#ff2f68]">All articles</Link><p className="mt-8 text-sm text-slate-600">{post.category} · {post.date} · {post.author}</p>{post.image && <Image width={1024} height={576} sizes="(max-width: 768px) 100vw, 768px" loading="eager" unoptimized={post.image.startsWith("https://")} src={post.image} alt={post.title} className="mb-8 aspect-video w-full rounded-xl object-cover" />}<BlogArticleBody content={post.content}/></article></WebsitePageShell>;
}
