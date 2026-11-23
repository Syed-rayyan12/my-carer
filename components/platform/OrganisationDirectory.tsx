"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, MapPin, ShieldCheck } from "lucide-react";
import { accountApi, getSession } from "@/components/auth/auth-client";
import { useWebsiteSession } from '@/components/auth/useWebsiteSession';
import { accountDestination } from '@/config/auth-routing';
type Listing = {
  reviews: { rating: number; body: string; response: string | null }[];
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  postcode: string;
  phone: string;
  website: string;
  coverage: string;
  services: string;
  feeRange: string;
  gallery: string[];
  virtualTour: string;
  cqcRating: string | null;
  cqcVerifiedAt: string | null;
  featured: boolean;
  agencyBadge: boolean;
  team: string;
  branches: { name: string; address: string }[];
};
export default function OrganisationDirectory() {
  const account = useWebsiteSession();
  const [items, setItems] = useState<Listing[]>([]);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    accountApi<{ data: Listing[] }>("platform/organisations")
      .then((r) => {
        if (active) setItems(r.data);
      })
      .catch(() => {
        if (active) setError("Unable to load organisation listings.");
      });
    return () => {
      active = false;
    };
  }, []);
  return (
    <section className="bg-[#fff9f7] px-5 py-16">
      <div className="mx-auto max-w-[1240px]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#c71d50]">
          Find care organisations
        </p>
        <h1 className="mt-3 font-commissioner text-4xl font-bold">
          Care homes &amp; agencies
        </h1>
        <p className="mt-4 text-sm leading-6 text-[#667085]">
          Discover active care organisations and contact the team directly. CQC
          ratings appear only after verification.
        </p>
        <div
          className="my-7 flex flex-wrap gap-2"
          role="group"
          aria-label="Organisation category"
        >
          {[
            { id: "", title: "All organisations" },
            { id: "CARE_HOME", title: "Care homes" },
            { id: "CARE_AGENCY", title: "Care agencies" },
          ].map((c) => (
            <button
              key={c.id}
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
              className={`rounded-lg border px-4 py-2 text-sm ${category === c.id ? "border-[#ff2f68] bg-[#fff0f4] text-[#b6204c]" : "border-[#e6dfe2] bg-white"}`}
            >
              {c.title}
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className="mb-4 text-sm text-red-700">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mb-4 text-sm text-green-700">
            {notice}
          </p>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items
            .filter((p) => !category || p.category === category)
            .map((p) => (
              <article
                key={p.id}
                id={`org-${p.id}`}
                className="overflow-hidden rounded-2xl border border-[#e8dfe2] bg-white"
              >
                {p.gallery[0] ? (
                  <img
                    src={p.gallery[0]}
                    alt={p.name}
                    loading="lazy"
                    className="h-44 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 items-center justify-center bg-[#fff1f4] text-[#c71d50]">
                    <Building2 size={34} />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs text-[#b6204c]">
                    {p.category === "CARE_HOME" ? "Care home" : "Care agency"}
                    {p.featured ? " · Featured" : ""}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">{p.name}</h2>
                  <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-[#667085]">
                    <MapPin size={14} className="mt-0.5 shrink-0" />
                    {[p.address, p.postcode].filter(Boolean).join(", ") ||
                      p.coverage ||
                      "Location details pending"}
                  </p>
                  {p.cqcRating && (
                    <p className="mt-3 flex items-center gap-2 text-xs text-[#227b56]">
                      <ShieldCheck size={14} />
                      CQC: {p.cqcRating}
                    </p>
                  )}
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#667085]">
                    {p.description}
                  </p>
                  {p.services && (
                    <p className="mt-3 text-xs leading-5">
                      <strong>Services:</strong> {p.services}
                    </p>
                  )}
                  {p.feeRange && (
                    <p className="mt-3 text-xs">
                      <strong>Fees:</strong> {p.feeRange}
                    </p>
                  )}
                  {p.team && (
                    <p className="mt-3 whitespace-pre-wrap text-xs leading-5">
                      <strong>Team:</strong> {p.team}
                    </p>
                  )}
                  {p.branches.length > 0 && (
                    <details className="mt-3 text-xs">
                      <summary className="cursor-pointer font-semibold">
                        Our branches
                      </summary>
                      {p.branches.map((b) => (
                        <p key={`${b.name}-${b.address}`} className="mt-2">
                          {b.name} · {b.address}
                        </p>
                      ))}
                    </details>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-[#b6204c]">
                    {p.phone && (
                      <a href={`tel:${p.phone}`} className="underline">
                        {p.phone}
                      </a>
                    )}
                    {p.website && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Website
                      </a>
                    )}
                    {p.virtualTour && (
                      <a
                        href={p.virtualTour}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Virtual tour
                      </a>
                    )}
                  </div>
                  <form
                    className="mt-5 border-t pt-4"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      if (busy) return;
                      setBusy(true);
                      setError("");
                      setNotice("");
                      const form = event.currentTarget;
                      const data = new FormData(form);
                      try {
                        const session = await getSession();
                        await accountApi("platform/messages", {
                          method: "POST",
                          csrfToken: session.csrfToken,
                          body: {
                            recipientId: p.id,
                            body: String(data.get("body")),
                          },
                        });
                        form.reset();
                        setNotice(
                          "Your enquiry was sent. You can continue the conversation in Messages.",
                        );
                      } catch (issue) {
                        setError(
                          issue instanceof Error
                            ? issue.message
                            : "Unable to send enquiry",
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <label className="text-xs">
                      Send an enquiry
                      <textarea
                        name="body"
                        required
                        maxLength={4000}
                        rows={2}
                        className="mt-2 w-full rounded-lg border p-2 text-sm"
                      />
                    </label>
                    <button
                      disabled={busy}
                      className="mt-2 rounded-lg bg-[#ff2f68] px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      Send enquiry
                    </button>
                    <p className="mt-2 text-[11px] text-[#667085]">
                      An approved, completed account is required.{" "}
                      {account.ready && <Link href={account.session ? accountDestination(account.session.user) : '/signin'} className="underline">
                        {account.session ? 'Return to your dashboard' : 'Sign in'}
                      </Link>}
                      .
                    </p>
                  </form>
                  {p.reviews.length > 0 && (
                    <details className="mt-4 border-t pt-4">
                      <summary className="cursor-pointer text-sm font-semibold">
                        Family &amp; carer reviews ({p.reviews.length})
                      </summary>
                      {p.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="mt-3 border-b pb-3 text-xs leading-6"
                        >
                          <p className="font-semibold">{review.rating} / 5</p>
                          <p>{review.body}</p>
                          {review.response && (
                            <p className="mt-2 rounded bg-[#fff5f8] p-2">
                              Organisation response: {review.response}
                            </p>
                          )}
                        </div>
                      ))}
                    </details>
                  )}
                  <form
                    className="mt-5 border-t pt-4"
                    onSubmit={async (event) => {
                      event.preventDefault();
                      if (busy) return;
                      setBusy(true);
                      setError("");
                      const data = new FormData(event.currentTarget);
                      try {
                        const session = await getSession();
                        await accountApi("platform/reviews", {
                          method: "POST",
                          csrfToken: session.csrfToken,
                          body: {
                            caregiverId: p.id,
                            rating: Number(data.get("rating")),
                            body: String(data.get("review")),
                          },
                        });
                        setNotice(
                          "Your review has been saved. Refresh to see it on the listing.",
                        );
                      } catch (issue) {
                        setError(
                          issue instanceof Error
                            ? issue.message
                            : "Unable to save review",
                        );
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    <label className="block text-xs">
                      Your rating
                      <select
                        name="rating"
                        className="mt-2 block w-full rounded-lg border p-2 text-sm"
                      >
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <option key={rating} value={rating}>
                            {rating} / 5
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="mt-3 block text-xs">
                      Share your experience
                      <textarea
                        name="review"
                        required
                        maxLength={2000}
                        rows={2}
                        className="mt-2 w-full rounded-lg border p-2 text-sm"
                      />
                    </label>
                    <button
                      disabled={busy}
                      className="mt-2 rounded-lg border border-[#f1b8ca] px-4 py-2 text-xs text-[#b6204c]"
                    >
                      Submit review
                    </button>
                    <p className="mt-2 text-[11px] leading-5 text-[#667085]">
                      Available after an accepted application or a two-way
                      enquiry conversation.
                    </p>
                  </form>
                </div>
              </article>
            ))}
        </div>
        {!items.length && !error && (
          <p className="rounded-xl border bg-white p-6 text-sm text-[#667085]">
            Approved organisation listings will appear here once their profiles
            are completed.
          </p>
        )}
      </div>
    </section>
  );
}
