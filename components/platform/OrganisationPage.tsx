"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { accountApi } from "@/components/auth/auth-client";
import type {
  LiveRequest,
  LiveApplication,
  LiveCaregiver,
} from "./workspace.types";
import type { Pagination } from "./workspace-api";
import { Building2, Check, Save } from "lucide-react";
import { useLiveWorkspace, personName } from "./LiveWorkspace";
const input =
  "mt-2 w-full rounded-lg border border-[#ded9dc] bg-white px-3 py-2.5 text-sm disabled:bg-[#f5f5f5]";
export default function OrganisationPage() {
  const live = useLiveWorkspace();
  const { snapshot, ready, mutate, busy } = live;
  const [tab, setTab] = useState("Profile");
  const [filter, setFilter] = useState("");
  const [jobs, setJobs] = useState<LiveRequest[]>([]);
  const [applications, setApplications] = useState<LiveApplication[]>([]);
  const [page, setPage] = useState(1);
  const [paging, setPaging] = useState<Pagination | null>(null);
  const [resourceError, setResourceError] = useState("");
  const resourceKey = tab + ":" + filter + ":" + page;
  const [loadedResource, setLoadedResource] = useState("");
  const resourceLoading = tab !== "Profile" && resourceKey !== loadedResource;
  useEffect(() => {
    if (!ready || busy || tab === "Profile") return;
    let active = true;
    const query =
      "?page=" +
      page +
      "&limit=25" +
      (tab === "Applicants" && filter ? "&verification=" + filter : "");
    const load =
      tab === "Jobs"
        ? accountApi<{ data: LiveRequest[]; pagination: Pagination }>(
            "platform/requests" + query,
          ).then((r) => {
            if (active) {
              setResourceError("");
              setJobs(r.data);
              setPaging(r.pagination);
            }
          })
        : accountApi<{ data: LiveApplication[]; pagination: Pagination }>(
            "platform/applications" + query,
          ).then((r) => {
            if (active) {
              setResourceError("");
              setApplications(r.data);
              setPaging(r.pagination);
            }
          });
    load
      .catch((issue) => {
        if (active)
          setResourceError(
            issue instanceof Error
              ? issue.message
              : "Unable to load organisation tools",
          );
      })
      .finally(() => {
        if (active) setLoadedResource(resourceKey);
      });
    return () => {
      active = false;
    };
  }, [ready, busy, tab, filter, page, resourceKey]);
  const p = snapshot.organisation;
  const e = snapshot.access?.entitlements ?? {};
  const category = snapshot.membership?.plan?.category;
  const organisation = category === "CARE_HOME" || category === "CARE_AGENCY";
  if (!ready)
    return (
      <p role="status" className="p-8">
        Loading organisation...
      </p>
    );
  if (!organisation)
    return (
      <section className="p-8">
        <h1 className="text-2xl font-semibold">Organisation packages</h1>
        <p className="mt-3 text-sm">
          Choose a Care Home or Care Agency package to manage an organisation.
        </p>
        <Link
          href="/pricing"
          className="mt-4 inline-block text-[#c71d50] underline"
        >
          View packages
        </Link>
      </section>
    );
  return (
    <main className="mx-auto max-w-[1400px] px-6 pb-10">
      <header className="mb-6 flex items-center gap-4 rounded-xl border border-[#e6dfe2] bg-white p-6">
        <span className="rounded-xl bg-[#fff1f4] p-3 text-[#c71d50]">
          <Building2 size={24} />
        </span>
        <div>
          <p className="text-xs text-[#c71d50]">
            {snapshot.membership?.plan?.title}
          </p>
          <h1 className="mt-1 text-3xl font-bold">
            {p?.name || "Your organisation"}
          </h1>
        </div>
      </header>
      {e.reviewsCollect === true && (
        <p className="mb-5 rounded-lg border border-[#ffd3df] bg-[#fff5f8] p-4 text-xs leading-6">
          Invite families to review your organisation by sharing{" "}
          <Link
            href={`/organisations#org-${live.user.id}`}
            className="font-semibold text-[#c71d50] underline"
          >
            your public listing
          </Link>
          . Reviews require an accepted application or a two-way enquiry
          conversation.
        </p>
      )}
      <div
        className="mb-5 flex gap-2"
        role="group"
        aria-label="Organisation tools"
      >
        {["Profile", "Jobs", "Applicants"].map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={tab === item}
            onClick={() => {
              setTab(item);
              setPage(1);
              setPaging(null);
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${tab === item ? "bg-[#ff2f68] text-white" : "bg-white text-[#667085]"}`}
          >
            {item}
          </button>
        ))}
        <Link
          href="/care-seeker-dashboard/package-tools"
          className="rounded-lg bg-white px-4 py-2 text-sm"
        >
          Analytics
        </Link>
      </div>
      {resourceError && loadedResource === resourceKey && tab !== "Profile" && (
        <p role="alert" className="mb-4 text-sm text-red-700">
          {resourceError}
        </p>
      )}
      {resourceLoading && tab !== "Profile" && (
        <p role="status" className="mb-4 text-sm">
          Loading {tab.toLowerCase()}...
        </p>
      )}
      {tab !== "Profile" && paging && (paging.hasMore || page > 1) && (
        <nav
          aria-label="Organisation results pages"
          className="mb-4 flex justify-end items-center gap-3"
        >
          <button
            disabled={page === 1 || resourceLoading}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            disabled={!paging.hasMore || resourceLoading}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
      {tab === "Profile" && (
        <form
          key={(p?.updatedAt as string) ?? snapshot.membership?.planId}
          className="space-y-6 rounded-xl border border-[#e6dfe2] bg-white p-6"
          onSubmit={async (event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            const value = (key: string) => String(data.get(key) ?? "");
            const branches = value("branches")
              .split("\n")
              .filter((s) => s.trim())
              .map((s) => {
                const [name, ...address] = s.split("|");
                return { name: name.trim(), address: address.join("|").trim() };
              });
            await mutate("platform/organisation", {
              name: value("name"),
              description: value("description"),
              address: value("address"),
              postcode: value("postcode"),
              phone: value("phone"),
              website: value("website"),
              coverage: value("coverage"),
              services: value("services"),
              feeRange: value("feeRange"),
              gallery: value("gallery")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean),
              team: value("team"),
              virtualTour: value("virtualTour"),
              branches,
              cqcReference: value("cqcReference"),
            });
          }}
        >
          <h2 className="text-xl font-semibold">Listing &amp; profile</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { key: "name", label: "Organisation name", max: 160 },
              { key: "phone", label: "UK contact phone", max: 64 },
              { key: "address", label: "Address", max: 300 },
              { key: "postcode", label: "Postcode", max: 12 },
              { key: "website", label: "Website (HTTPS)", max: 300 },
              {
                key: "cqcReference",
                label: "CQC location / provider reference",
                max: 100,
              },
            ].map((field) => (
              <label key={field.key} className="text-sm">
                {field.label}
                <input
                  name={field.key}
                  defaultValue={String(p?.[field.key as keyof typeof p] ?? "")}
                  required={field.key === "name"}
                  maxLength={field.max}
                  className={input}
                />
              </label>
            ))}
          </div>
          <p className="rounded-lg bg-[#f6f7fa] p-3 text-xs leading-5 text-[#667085]">
            CQC rating:{" "}
            {p?.cqcRating && p.cqcVerifiedAt
              ? p.cqcRating
              : "Awaiting verified CQC data"}
            . Enter your reference for administrator review. Subscription level
            does not grant a CQC rating.
          </p>
          <label className="block text-sm">
            About your organisation
            <textarea
              name="description"
              defaultValue={p?.description ?? ""}
              maxLength={4000}
              rows={4}
              className={input}
            />
          </label>
          <label className="block text-sm">
            Coverage areas
            <textarea
              name="coverage"
              defaultValue={p?.coverage ?? ""}
              maxLength={1000}
              rows={2}
              className={input}
            />
          </label>
          {category === "CARE_AGENCY" || e.serviceDetails === true ? (
            <label className="block text-sm">
              Services &amp; specialisms
              <textarea
                name="services"
                defaultValue={p?.services ?? ""}
                maxLength={2000}
                rows={3}
                className={input}
              />
            </label>
          ) : (
            <Locked label="Detailed services" />
          )}
          {e.feeRange === true && (
            <label className="block text-sm">
              Fee range
              <input
                name="feeRange"
                defaultValue={p?.feeRange ?? ""}
                maxLength={200}
                className={input}
              />
            </label>
          )}
          {(category === "CARE_AGENCY"
            ? e.team === true
            : e.galleryLimit !== 0) && (
            <label className="block text-sm">
              Gallery image URLs (HTTPS, one per line)
              {typeof e.galleryLimit === "number" &&
                e.galleryLimit > 0 &&
                ` · up to ${e.galleryLimit}`}
              <textarea
                name="gallery"
                defaultValue={p?.gallery.join("\n") ?? ""}
                rows={4}
                className={input}
              />
            </label>
          )}
          {e.team === true && (
            <label className="block text-sm">
              Team
              <textarea
                name="team"
                defaultValue={p?.team ?? ""}
                maxLength={2000}
                rows={3}
                className={input}
              />
            </label>
          )}
          {e.virtualTour === true && (
            <label className="block text-sm">
              Virtual tour URL (HTTPS)
              <input
                name="virtualTour"
                defaultValue={p?.virtualTour ?? ""}
                maxLength={300}
                className={input}
              />
            </label>
          )}
          {e.multiBranch === true && (
            <label className="block text-sm">
              Branches (one per line: Branch name | Address)
              <textarea
                name="branches"
                defaultValue={
                  p?.branches
                    .map((b) => `${b.name} | ${b.address}`)
                    .join("\n") ?? ""
                }
                rows={4}
                className={input}
              />
            </label>
          )}
          <button
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-[#ff2f68] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save size={16} />
            {busy ? "Saving..." : "Save organisation"}
          </button>
        </form>
      )}
      {tab === "Jobs" && (
        <section className="space-y-5">
          <div className="rounded-xl border border-[#e6dfe2] bg-white p-6">
            <h2 className="text-xl font-semibold">Recruitment</h2>
            <p className="mt-2 text-sm text-[#667085]">
              {jobs.filter((r) => r.status === "OPEN").length} open postings /{" "}
              {e.jobLimit === null ? "unlimited" : String(e.jobLimit ?? 0)}{" "}
              included in your package.
            </p>
            {e.jobLimit === 0 ? (
              <Locked label="Job vacancy posts" />
            ) : (
              <form
                className="mt-5 grid gap-4 sm:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const data = new FormData(form);
                  const get = (key: string) => String(data.get(key) ?? "");
                  const saved = await mutate(
                    "platform/requests",
                    {
                      title: get("title"),
                      description: get("description"),
                      location: get("location"),
                      budgetPence: Math.round(Number(get("rate")) * 100),
                      fundingType:
                        category === "CARE_HOME" ? "Care home" : "Care agency",
                      tasks: get("tasks"),
                      schedule: get("schedule"),
                    },
                    "POST",
                  );
                  if (saved) form.reset();
                }}
              >
                {[
                  { key: "title", label: "Job title", max: 160 },
                  { key: "location", label: "Location", max: 120 },
                  { key: "schedule", label: "Schedule", max: 2000 },
                  { key: "tasks", label: "Tasks / specialisms", max: 2000 },
                ].map((f) => (
                  <label key={f.key} className="text-sm">
                    {f.label}
                    <input
                      name={f.key}
                      maxLength={f.max}
                      required
                      className={input}
                    />
                  </label>
                ))}
                <label className="text-sm">
                  Hourly rate (GBP)
                  <input
                    name="rate"
                    type="number"
                    min="0.01"
                    max="10000"
                    step="0.01"
                    required
                    className={input}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  Description
                  <textarea
                    name="description"
                    required
                    maxLength={4000}
                    rows={3}
                    className={input}
                  />
                </label>
                <button
                  disabled={busy}
                  className="rounded-lg bg-[#ff2f68] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Publish job
                </button>
              </form>
            )}
          </div>
          {jobs.map((job) => (
            <article
              key={job.id}
              className="flex items-center justify-between gap-4 rounded-xl border bg-white p-5"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="mt-1 text-xs text-[#667085]">
                  {job.location} · {job.status} ·{" "}
                  {job._count?.applications ?? 0} applications
                </p>
              </div>
              {job.status === "OPEN" && (
                <button
                  disabled={busy}
                  onClick={() =>
                    void mutate(`platform/requests/${job.id}`, {
                      status: "CLOSED",
                    })
                  }
                  className="rounded-lg border px-4 py-2 text-xs"
                >
                  Close posting
                </button>
              )}
            </article>
          ))}
        </section>
      )}
      {tab === "Applicants" && (
        <section className="space-y-4 rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Applicants</h2>
          {e.candidateFilters === true ? (
            <label className="block text-sm">
              Filter by DBS / qualifications
              <select
                className={input}
                value={filter}
                onChange={(event) => {
                  setFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">All applicants</option>
                <option value="DBS">DBS approved</option>
                <option value="QUALIFICATION">Qualification approved</option>
              </select>
            </label>
          ) : (
            <p className="text-xs text-[#667085]">
              Applicant verification filters and shortlisting are included from
              Agency Growth.
            </p>
          )}
          {applications
            .filter(
              (a): a is LiveApplication & { caregiver: LiveCaregiver } =>
                Boolean(a.caregiver) &&
                (!filter ||
                  a.caregiver!.verifications.some((v) => v.kind === filter)),
            )
            .map((application) => (
              <article key={application.id} className="rounded-lg border p-4">
                <div className="flex justify-between gap-3">
                  <h3 className="font-semibold">
                    {personName(application.caregiver)}
                  </h3>
                  <span className="text-xs text-[#667085]">
                    {application.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#667085]">
                  {application.request.title}
                </p>
                <p className="my-3 whitespace-pre-wrap text-sm leading-6">
                  {application.coverLetter}
                </p>
                <div className="flex flex-wrap gap-2">
                  {e.shortlist === true && (
                    <button
                      disabled={busy}
                      onClick={() =>
                        void mutate(
                          `platform/applications/${application.id}/shortlist`,
                          { shortlisted: !application.details.shortlisted },
                        )
                      }
                      className="rounded-lg border px-3 py-2 text-xs"
                    >
                      {application.details.shortlisted
                        ? "Remove shortlist"
                        : "Shortlist"}
                    </button>
                  )}
                  {application.status === "PENDING" &&
                    (["ACCEPTED", "REJECTED"] as const).map((status) => (
                      <button
                        key={status}
                        disabled={busy}
                        onClick={() =>
                          void mutate(
                            `platform/applications/${application.id}`,
                            { status },
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-xs"
                      >
                        {status === "ACCEPTED" && <Check size={13} />}{" "}
                        {status === "ACCEPTED" ? "Accept" : "Reject"}
                      </button>
                    ))}
                </div>
              </article>
            ))}
          {!applications.length && (
            <p className="py-6 text-sm text-[#667085]">
              Applications will appear here when carers apply to your jobs.
            </p>
          )}
        </section>
      )}
    </main>
  );
}
function Locked({ label }: { label: string }) {
  return (
    <p className="mt-4 rounded-lg bg-[#fff5f8] p-3 text-xs text-[#a32149]">
      {label} is not included in this package.{" "}
      <Link href="/care-seeker-dashboard/membership" className="underline">
        Compare packages
      </Link>
      .
    </p>
  );
}
