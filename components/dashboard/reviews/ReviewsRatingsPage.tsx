import { dashboardReviews } from "./reviewsData";
import ReviewRow from "./ReviewRow";

export default function ReviewsRatingsPage() {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Reviews &amp; Ratings</h1><p className="font-nunito text-base text-[#363636]">Share your experience and help other care seekers make informed decisions.</p></section><section className="overflow-hidden rounded-[13px] border border-[#eceef2] bg-white" aria-labelledby="all-reviews-heading"><h2 id="all-reviews-heading" className="border-b border-[#eceef2] px-6 py-4 font-jakarta text-base font-bold text-[#101929]">All reviews <span className="font-normal text-[#667085]">({dashboardReviews.length})</span></h2>{dashboardReviews.map(review => <ReviewRow key={review.id} review={review} />)}</section></main>;
}
