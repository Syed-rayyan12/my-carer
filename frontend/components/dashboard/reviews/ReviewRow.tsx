import { Star } from "lucide-react";
import DashboardAvatar from "../loading/DashboardAvatar";
import type { dashboardReviews } from "./reviewsData";

export default function ReviewRow({ review }: { review: typeof dashboardReviews[number] }) {
  return <article className="flex min-h-28 items-start gap-4 border-b border-[#eceef2] px-6 py-5 last:border-b-0 max-[550px]:px-4"><DashboardAvatar src={review.image} name={review.name} initials={review.initials} variant="blush" className="size-10" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-jakarta text-[14px] font-semibold text-[#101929]">{review.name}</h2><span className="font-jakarta text-xs font-normal text-[#667085]">{review.time}</span></div><div className="mt-1 flex flex-wrap items-center gap-2"><span className="flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} className={index < review.rating ? "fill-[#ff9f18] text-[#ff9f18]" : "fill-[#e9ebef] text-[#e9ebef]"} />)}</span><span className="font-jakarta text-xs text-[#667085]">· {review.careType}</span></div><p className="mt-2 font-jakarta text-sm leading-relaxed text-[#344054]">{review.message}</p></div></article>;
}
