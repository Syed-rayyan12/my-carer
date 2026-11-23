import Link from "next/link";
import { Plus } from "lucide-react";

export default function DashboardPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <section className="mb-6 flex min-h-[120px] items-center justify-between gap-5 rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px] max-[1000px]:flex-col max-[1000px]:items-start">
      <div>
        <h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">{title}</h1>
        <p className="font-nunito text-base text-[#363636]">{description}</p>
      </div>
      <Link className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-5 py-3 font-nunito text-sm font-semibold text-white hover:bg-[#e92359]" href="/care-seeker-dashboard/care-requirements/create"><Plus size={17} />Create New Care Requirement</Link>
    </section>
  );
}
