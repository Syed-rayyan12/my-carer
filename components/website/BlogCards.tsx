import Link from "next/link";
import { ArrowRight } from "lucide-react";

const posts = [
  { title: "How to Choose the Right Caregiver for Your Loved One", read: "6 min read", image: "/images/about-offer-caregivers.png" },
  { title: "07 Signs That an Elderly Loved One May Need Extra Support", read: "5 min read", image: "/images/about-story.png" },
  { title: "What to Look for in a Professional Caregiver", read: "4 min read", image: "/images/about-offer-seekers.png" },
  { title: "How to Choose the Right Caregiver for Your Loved One", read: "6 min read", image: "/images/Rectangle 40872.png" },
  { title: "07 Signs That an Elderly Loved One May Need Extra Support", read: "5 min read", image: "/images/about-mission.png" },
];

export default function BlogCards() {
  return (
    <section className="mx-auto grid w-[min(1100px,calc(100%-60px))] grid-cols-3 gap-x-[20px] gap-y-[22px] py-[42px] max-[800px]:grid-cols-2 max-[600px]:w-[calc(100%-30px)] max-[600px]:grid-cols-1 max-[600px]:py-7">
      {posts.map((post, index) => (
        <article key={`${post.title}-${index}`} className="overflow-hidden rounded-[10px] border border-[#dedfe3] bg-white">
          <img src={post.image} alt="Caregiver and client" className="h-[220px] w-full object-cover max-[600px]:h-[230px]" />
          <div className="flex min-h-[190px] flex-col p-[18px]">
            <p className="mb-[10px] font-nunito text-[11px] font-bold tracking-[1px] text-[#ff2f68]">Jun 28, 2026 <span className="px-1">•</span> {post.read}</p>
            <h2 className="mb-[9px] font-commissioner text-[18px] font-bold leading-[1.35] text-[#101929]">{post.title}</h2>
            <p className="mb-4 font-nunito text-[13px] leading-[1.65] text-[#626b78]">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</p>
            <Link href="#article" className="mt-auto inline-flex items-center gap-1 font-nunito text-[12px] font-bold text-[#ff2f68]">Read More <ArrowRight size={13} /></Link>
          </div>
        </article>
      ))}
    </section>
  );
}
