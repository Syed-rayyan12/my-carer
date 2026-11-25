import type { Metadata } from "next";
import BlogPageHero from "@/components/website/BlogPageHero";
import BlogCards from "@/components/website/BlogCards";
import WebsitePageShell from "@/components/website/WebsitePageShell";
import { Suspense } from 'react';
import BlogCardsSkeleton from '@/components/website/BlogCardsSkeleton';
export const metadata: Metadata = { title: "Blog & Care Resources | My Carer", description: "Practical guides and helpful resources for care seekers, families and professional caregivers." };
export default function BlogsPage() {
  return <WebsitePageShell activePage="blogs"><BlogPageHero /><Suspense fallback={<BlogCardsSkeleton />}><BlogCards /></Suspense></WebsitePageShell>;
}
