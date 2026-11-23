import Link from 'next/link';
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react';
import type { AdminBlogPost } from '@/components/admin/blog/adminBlogData';
export default function PublishedBlogCard({ post }: { post: AdminBlogPost }) {
  return <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e3e5e8] bg-white shadow-[0_5px_18px_#1019290d]">
    <Link href={`/blogs/${post.id}`} aria-label={`Read ${post.title}`} className="block h-[230px] overflow-hidden bg-[#fff0f5]">{post.image ? <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <span className="flex h-full items-center justify-center text-[#ff2f68]"><BookOpen size={48} strokeWidth={1.25} /></span>}</Link>
    <div className="flex flex-1 flex-col p-5"><div className="mb-3 flex flex-wrap items-center gap-2 text-xs"><span className="rounded-full bg-[#fff0f5] px-2.5 py-1 font-semibold text-[#d92358]">{post.category}</span><span className="inline-flex items-center gap-1 text-[#98a2b3]"><CalendarDays size={13} />{post.date}</span></div><h2 className="mb-3 font-commissioner text-[22px] font-bold leading-snug text-[#101929]"><Link href={`/blogs/${post.id}`} className="hover:text-[#ff2f68]">{post.title}</Link></h2><p className="mb-5 line-clamp-3 text-sm leading-6 text-[#667085]">{post.description}</p><Link href={`/blogs/${post.id}`} className="mt-auto inline-flex items-center gap-1.5 text-sm font-bold text-[#ff2f68]">Read article<ArrowRight size={15} /></Link></div>
  </article>;
}
