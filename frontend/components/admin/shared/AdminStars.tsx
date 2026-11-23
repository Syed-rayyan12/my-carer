import { Star } from "lucide-react";

export default function AdminStars({ rating, amber = false }: { rating: number; amber?: boolean }) { return <span aria-label={`${rating} out of 5 stars`} className="inline-flex shrink-0 gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} aria-hidden="true" className={index < rating ? amber ? "fill-[#a96500] text-[#a96500]" : "fill-[#ff2f68] text-[#ff2f68]" : "fill-[#e3e7e5] text-[#e3e7e5]"} />)}</span>; }
