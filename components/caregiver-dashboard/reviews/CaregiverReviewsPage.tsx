"use client";

import { useCaregiverDashboard } from "../CaregiverDashboardContext";
import CaregiverPage from "../shared/CaregiverPage";
import CaregiverListSkeleton from "../shared/CaregiverListSkeleton";
import CaregiverReviewRow from "./CaregiverReviewRow";
import { caregiverReviews } from "./caregiverReviewsData";

export default function CaregiverReviewsPage() { const { search, ready } = useCaregiverDashboard(); const reviews = caregiverReviews.filter(review => `${review.name} ${review.careType} ${review.message}`.toLowerCase().includes(search.trim().toLowerCase())); return <CaregiverPage title="Reviews & Ratings" description="See what care seekers say about working with you.">{!ready ? <CaregiverListSkeleton /> : <section className="overflow-hidden rounded-xl border border-[#eaecf0] bg-white"><h2 className="px-6 py-5 text-base font-bold">All reviews <span className="font-normal text-[#667085]">({reviews.length})</span></h2>{reviews.map(review => <CaregiverReviewRow key={review.id} review={review} />)}{!reviews.length && <p className="border-t border-[#eaecf0] py-12 text-center text-sm text-[#667085]">No reviews match your search.</p>}</section>}</CaregiverPage>; }
