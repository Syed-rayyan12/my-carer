import type { ReactNode } from "react";
import HomePageMotion from "./HomePageMotion";
import WebsiteHeader from "@/components/shared/WebsiteHeader";
import WebsiteFooter from "@/components/shared/WebsiteFooter";
import NewsletterSection from "@/components/website/NewsletterSection";

type PageKey = "caregivers" | "care-seekers" | "care-homes" | "jobs" | "technology" | "pricing" | "faqs" | "blogs" | "contact" | "terms" | "privacy-policy";

export default function WebsitePageShell({ activePage, children }: { activePage: PageKey; children: ReactNode }) {
  return (
    <HomePageMotion animateSections={false} animationPage={activePage}>
      <WebsiteHeader activePage={activePage} />
      {children}
      <NewsletterSection />
      <WebsiteFooter />
    </HomePageMotion>
  );
}
