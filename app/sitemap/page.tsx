import type { Metadata } from "next";
import WebsiteHeader from "@/components/shared/WebsiteHeader";
import WebsiteFooter from "@/components/shared/WebsiteFooter";
import SitemapContent from "@/components/sitemap/SitemapContent";

export const metadata: Metadata = {
  title: "Visual Sitemap | My Carer",
  description: "Explore every My Carer page, understand the care seeker dashboard, and follow the journeys that connect finding care to managing it.",
};

export default function Page() {
  return <><WebsiteHeader /><SitemapContent /><WebsiteFooter /></>;
}
