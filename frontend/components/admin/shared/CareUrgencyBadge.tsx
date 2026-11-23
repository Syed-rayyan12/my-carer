import type { CarePriority } from "./careUrgencyData";

export default function CareUrgencyBadge({ priority = "Normal" }: { priority?: CarePriority }) {
  const tone = priority === "Critical" ? "bg-[#fef3f2] text-[#b42318] ring-[#fecdca]" : priority === "High" ? "bg-[#fffaeb] text-[#b54708] ring-[#fedf89]" : "bg-[#f2f4f7] text-[#475467] ring-[#eaecf0]";
  return <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}><span className="size-1.5 rounded-full bg-current" />{priority}</span>;
}
