"use client";
import { useState } from "react";
import {
  useLiveWorkspace,
  personName,
  dateLabel,
} from "@/components/platform/LiveWorkspace";
import ReviewRow from "./ReviewRow";
export default function ReviewsRatingsPage() {
  const { snapshot, mutate, busy } = useLiveWorkspace();
  const [caregiverId, setCaregiverId] = useState("");
  const [rating, setRating] = useState("5");
  const [body, setBody] = useState("");
  const candidates = snapshot.reviewCandidates ?? [];
  const reviews = snapshot.reviews.map((r) => ({
    id: r.id,
    name: personName(r.caregiver),
    initials: `${r.caregiver.firstName[0]}${r.caregiver.lastName[0]}`,
    image: "",
    rating: r.rating,
    careType: "Care support",
    message: r.body,
    time: dateLabel(r.createdAt),
  }));
  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]">
        <h1 className="font-commissioner text-[42px] font-bold max-[640px]:text-[32px]">
          Reviews &amp; Ratings
        </h1>
        <p className="mt-1 text-base text-[#363636]">
          Share your experience and help other care seekers make informed
          decisions.
        </p>
      </section>
      <form
        className="mb-6 space-y-4 rounded-xl border bg-white p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (
            await mutate(
              "platform/reviews",
              { caregiverId, rating: Number(rating), body },
              "POST",
            )
          ) {
            setBody("");
            setCaregiverId("");
          }
        }}
      >
        <h2 className="text-lg font-bold">Write a Review</h2>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <label className="text-sm">
            Caregiver
            <select
              required
              value={caregiverId}
              onChange={(e) => setCaregiverId(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border px-3"
            >
              <option value="">Choose an accepted caregiver</option>
              {candidates.map((p) => (
                <option key={p.id} value={p.id}>
                  {personName(p)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Rating
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border px-3"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} stars
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm">
          Your experience
          <textarea
            required
            maxLength={2000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 h-28 w-full rounded-lg border p-3"
          />
        </label>
        <button
          disabled={busy || !candidates.length}
          className="rounded-lg bg-[#ff2f68] px-5 py-2.5 text-sm text-white disabled:opacity-50"
        >
          Submit Review
        </button>
        {!candidates.length && (
          <p className="text-sm text-[#667085]">
            An accepted care application is required before reviewing a
            caregiver.
          </p>
        )}
      </form>
      <section className="overflow-hidden rounded-[13px] border border-[#eceef2] bg-white">
        <h2 className="border-b px-6 py-4 text-base font-bold">
          Your reviews ({reviews.length})
        </h2>
        {reviews.map((review) => (
          <ReviewRow key={review.id} review={review} />
        ))}
        {!reviews.length && (
          <p className="p-6 text-sm text-[#667085]">No reviews yet.</p>
        )}
      </section>
    </main>
  );
}
