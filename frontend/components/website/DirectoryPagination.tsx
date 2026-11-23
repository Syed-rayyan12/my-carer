import { ArrowLeft, ArrowRight } from "lucide-react";

export default function DirectoryPagination() {
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-8 font-nunito text-[13px]">
      <button type="button" aria-label="Previous page" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1d5db] text-[#101929]"><ArrowLeft size={15} /></button>
      <button type="button" aria-current="page" className="h-9 w-9 rounded-full bg-[#ff2f68] font-bold text-white">1</button>
      <button type="button" className="h-9 w-9 rounded-full border border-[#d1d5db] text-[#46505e]">2</button>
      <button type="button" className="h-9 w-9 rounded-full border border-[#d1d5db] text-[#46505e]">3</button>
      <span className="px-1 text-[#667085]">…</span>
      <button type="button" className="h-9 w-9 rounded-full border border-[#d1d5db] text-[#46505e]">12</button>
      <button type="button" aria-label="Next page" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d1d5db] text-[#101929]"><ArrowRight size={15} /></button>
    </nav>
  );
}
