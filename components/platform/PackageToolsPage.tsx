"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Bell, LockKeyhole, Check } from "lucide-react";
import { accountApi } from "@/components/auth/auth-client";
import { useLiveWorkspace } from "./LiveWorkspace";
type Analytics = {
  jobs: number;
  applications: number;
  incomingMessages: number;
  reviews: number;
  averageRating: number | null;
};
type Job = {
  id: string;
  title: string;
  location: string;
  budgetPence: number;
  createdAt: string;
};
export default function PackageToolsPage() {
  const { snapshot, user, ready, mutate, busy } = useLiveWorkspace();
  const e = snapshot.access?.entitlements ?? {};
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!ready) return;
    let active = true;
    // Clear the previous membership's remote data before requesting its replacement.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnalytics(null);
    setJobs([]);
    setError("");
    const actions = [];
    if (e.analytics === true)
      actions.push(
        accountApi<{ data: Analytics }>("platform/analytics").then((r) => {
          if (active) setAnalytics(r.data);
        }),
      );
    if (e.jobAlerts === true)
      actions.push(
        accountApi<{ data: Job[] }>("platform/job-alerts").then((r) => {
          if (active) setJobs(r.data);
        }),
      );
    Promise.all(actions).catch((issue) => {
      if (active)
        setError(
          issue instanceof Error ? issue.message : "Unable to load tools",
        );
    });
    return () => {
      active = false;
    };
  }, [ready, e.analytics, e.jobAlerts, snapshot.membership?.planId]);
  const download = async (path: string, name: string, csv = false) => {
    try {
      const result = await accountApi<{ data: Record<string, unknown> }>(path);
      const content = csv
        ? Object.keys(result.data).join(",") +
          "\n" +
          Object.values(result.data)
            .map((v) => v ?? "")
            .join(",")
        : JSON.stringify(result.data, null, 2);
      const url = URL.createObjectURL(
        new Blob([content], { type: csv ? "text/csv" : "application/json" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Unable to download report",
      );
    }
  };
  const root =
    user.role === "CAREGIVER"
      ? "/caregiver-dashboard"
      : "/care-seeker-dashboard";
  return (
    <main className="mx-auto max-w-[1400px] space-y-6 px-6 pb-10">
      <header className="rounded-xl border bg-white p-6">
        <p className="text-xs text-[#c71d50]">
          {snapshot.membership?.plan?.title}
        </p>
        <h1 className="mt-2 text-3xl font-bold">Your package tools</h1>
        <p className="mt-2 text-sm text-[#667085]">
          Your available tools follow your current subscription and access
          period.
        </p>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <section className="rounded-xl border bg-white p-6">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <BarChart3 size={21} />
          Activity analytics
        </h2>
        {e.analytics === true ? (
          <>
            {analytics ? (
              <div className="mt-5 grid grid-cols-2 gap-4 xl:grid-cols-4">
                {[
                  { label: "Applications", value: analytics.applications },
                  {
                    label: "Incoming messages",
                    value: analytics.incomingMessages,
                  },
                  { label: "Your job postings", value: analytics.jobs },
                  {
                    label: "Average review",
                    value: analytics.averageRating?.toFixed(1) ?? "No reviews",
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-[#fff5f8] p-5">
                    <p className="text-xs text-[#667085]">{item.label}</p>
                    <p className="mt-3 text-2xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p role="status" className="mt-4 text-sm">
                Loading recorded activity...
              </p>
            )}
            <p className="mt-4 text-xs text-[#667085]">
              Counts use recorded applications, incoming messages, postings and
              reviews. Profile-view tracking is not connected.
            </p>
          </>
        ) : (
          <Upgrade root={root} />
        )}
      </section>
      {user.role === "CAREGIVER" && (
        <section className="rounded-xl border bg-white p-6">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Bell size={21} />
            Agency job alerts
          </h2>
          {e.jobAlerts === true ? (
            <>
              <p className="mt-2 text-xs text-[#667085]">
                Latest open agency and care-home jobs matching your profile town
                or city. Alerts are shown here in your dashboard.
              </p>
              <div className="mt-4 divide-y">
                {jobs.map((job) => (
                  <article key={job.id} className="py-4">
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="mt-1 text-xs text-[#667085]">
                      {job.location} ·{" "}
                      {new Intl.NumberFormat("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      }).format(job.budgetPence / 100)}{" "}
                      / hour
                    </p>
                    <Link
                      href="/caregiver-dashboard/find-care-jobs"
                      className="mt-2 inline-block text-xs text-[#c71d50] underline"
                    >
                      View and apply
                    </Link>
                  </article>
                ))}
                {!jobs.length && (
                  <p className="py-5 text-sm text-[#667085]">
                    No matching organisation jobs yet.
                  </p>
                )}
              </div>
            </>
          ) : (
            <Upgrade root={root} />
          )}
        </section>
      )}
      <section className="rounded-xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Review responses</h2>
        {snapshot.reviews
          .filter((review) => review.caregiver.id === user.id)
          .map((review) => (
            <article key={review.id} className="mt-4 rounded-xl border p-4">
              <p className="text-xs text-[#667085]">{review.rating} / 5</p>
              <p className="mt-2 text-sm leading-6">{review.body}</p>
              {review.response && (
                <p className="mt-3 rounded-lg bg-[#f8f5f6] p-3 text-xs leading-5">
                  Your response: {review.response}
                </p>
              )}
              {e.reviewsRespond === true ? (
                <form
                  className="mt-3 flex flex-wrap gap-2"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const form = event.currentTarget;
                    const data = new FormData(form);
                    await mutate(`platform/reviews/${review.id}/response`, {
                      response: String(data.get("response")),
                    });
                  }}
                >
                  <input
                    name="response"
                    aria-label="Your review response"
                    required
                    maxLength={2000}
                    defaultValue={review.response ?? ""}
                    className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
                  />
                  <button
                    disabled={busy}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#ff2f68] px-3 py-2 text-xs text-white"
                  >
                    <Check size={13} />
                    Publish response
                  </button>
                </form>
              ) : (
                <p className="mt-3 text-xs text-[#667085]">
                  Responding to reviews is not included in this package.
                </p>
              )}
              {e.reviewsDispute === true && (
                <form
                  className="mt-3 flex flex-wrap gap-2"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    await mutate(
                      `platform/reviews/${review.id}/dispute`,
                      { reason: String(data.get("reason")) },
                      "POST",
                    );
                  }}
                >
                  <input
                    name="reason"
                    required
                    maxLength={1000}
                    placeholder="Reason for flagging this review"
                    aria-label="Review dispute reason"
                    className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-xs"
                  />
                  <button
                    disabled={busy}
                    className="rounded-lg border px-3 py-2 text-xs"
                  >
                    Flag for admin review
                  </button>
                </form>
              )}
            </article>
          ))}
        {!snapshot.reviews.length && (
          <p className="mt-3 text-sm text-[#667085]">
            Your reviews will appear here when received.
          </p>
        )}
      </section>
      {(e.monthlyReport === true || e.apiAccess === true) && (
        <section className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Reports &amp; data</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {e.monthlyReport === true && (
              <button
                onClick={() =>
                  void download(
                    "platform/reports/monthly",
                    "my-carer-monthly-report.csv",
                    true,
                  )
                }
                className="rounded-lg bg-[#ff2f68] px-4 py-2.5 text-xs text-white"
              >
                Download current month&apos;s report
              </button>
            )}
            {e.apiAccess === true && (
              <button
                onClick={() =>
                  void download(
                    "platform/integrations/export",
                    "my-carer-recruitment-export.json",
                  )
                }
                className="rounded-lg border px-4 py-2.5 text-xs"
              >
                Export recruitment data (JSON)
              </button>
            )}
          </div>
          <p className="mt-3 text-xs leading-5 text-[#667085]">
            Exports contain your organisation&apos;s records. Direct ATS/CRM
            connections require the chosen provider&apos;s setup.
          </p>
        </section>
      )}
      <section className="rounded-xl border border-[#e7dfe2] bg-[#fff8fa] p-6">
        <h2 className="text-base font-semibold">
          Services that need a connection
        </h2>
        <p className="mt-2 text-xs leading-6 text-[#667085]">
          CQC data import, secure photo and certificate uploads, email/chat
          support, assigned account managers, scheduled reports and ATS/CRM
          connections require their service setup. These are listed in the
          packages as specified in the client document; they are not presented
          as connected dashboard actions.
        </p>
      </section>
    </main>
  );
}
function Upgrade({ root }: { root: string }) {
  return (
    <p className="mt-4 flex items-center gap-2 text-sm text-[#667085]">
      <LockKeyhole size={15} />
      Not included.{" "}
      <Link href={`${root}/membership`} className="text-[#c71d50] underline">
        Compare packages
      </Link>
      .
    </p>
  );
}
