"use client";
import Link from "next/link";
import {
  CalendarDays,
  ClipboardList,
  Heart,
  MessageSquare,
  MapPin,
  Clock3,
  Star,
} from "lucide-react";
import { useDashboard } from "./DashboardContext";
import CaregiverResultCard from "./caregivers/CaregiverResultCard";
import { dateLabel } from "@/components/platform/LiveWorkspace";
export default function CareSeekerDashboard() {
  const {
    snapshot,
    user,
    caregivers,
    saved,
    toggleSaved,
    setSelected,
    showPanel,
    search,
    ready,
  } = useDashboard();
  const active = snapshot.requests.filter((item) => item.status === "OPEN");
  const people = caregivers
    .filter((person) =>
      `${person.name} ${person.location} ${person.specialty}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .slice(0, 2);
  const stats = [
    {
      title: "Active Care Requirements",
      icon: ClipboardList,
      panel: "My Care Requirements",
      value: snapshot.stats?.openRequests ?? 0,
      action: "View requirements",
    },
    {
      title: "Saved Caregivers",
      icon: Heart,
      panel: "Saved Caregivers",
      value: snapshot.stats?.savedCount ?? 0,
      action: "View saved caregivers",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      panel: "Messages",
      value: snapshot.stats?.messageCount ?? 0,
      action: "View messages",
    },
    {
      title: "Care Arrangements",
      icon: CalendarDays,
      panel: "My Arrangements",
      value: snapshot.stats?.arrangements ?? 0,
      action: "View arrangements",
    },
  ];
  const activity = snapshot.activity ?? [];
  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-7 pb-6 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="relative mb-6 flex items-center justify-between gap-5 overflow-hidden rounded-xl border border-[#ececf0] bg-white px-7 py-6 max-[850px]:flex-col max-[850px]:items-start">
        <div>
          <h1 className="mb-1.5 font-commissioner text-[42px] font-bold tracking-tight max-[640px]:text-[30px]">
            Welcome back,{" "}
            <span className="text-[#ff2f68]">
              {snapshot.account.firstName || user.firstName}!
            </span>
          </h1>
          <p className="max-w-[700px] font-nunito text-base text-black/70">
            Manage your care requirements, discover caregivers and keep track of
            your conversations and care arrangements.
          </p>
        </div>
        <Link
          className="rounded-lg bg-[#ff2f68] px-5 py-3 text-sm font-semibold text-white"
          href="/care-seeker-dashboard/find-caregivers"
        >
          Find a Caregiver
        </Link>
      </section>
      <section
        className="mb-6 grid grid-cols-4 gap-4 max-[850px]:grid-cols-2"
        aria-label="Your care statistics"
      >
        {stats.map(({ title, icon: Icon, panel, value, action }) => (
          <article
            key={title}
            className="rounded-xl border border-[#ececf0] bg-white p-5"
          >
            <div className="flex items-center justify-between gap-2 text-xs">
              <span>{title}</span>
              <span className="rounded-xl bg-[#fff0f5] p-2 text-[#ff2f68]">
                <Icon size={21} />
              </span>
            </div>
            <strong className="my-3 block font-commissioner text-[26px]">
              {ready ? value : "…"}
            </strong>
            <button
              onClick={() => showPanel(panel)}
              className="text-sm text-[#ff2f68]"
            >
              {action}
            </button>
          </article>
        ))}
      </section>
      <div className="grid grid-cols-[minmax(0,1.85fr)_minmax(280px,1fr)] gap-6 max-[1250px]:grid-cols-1">
        <section className="rounded-xl border border-[#ececf0] bg-white p-5">
          <header className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-commissioner text-2xl font-semibold">
                Caregivers for you
              </h2>
              <p className="mt-1 text-sm text-[#5e6b65]">
                Browse active caregiver profiles.
              </p>
            </div>
            <Link
              href="/care-seeker-dashboard/find-caregivers"
              className="text-sm text-[#ff2f68]"
            >
              View all caregivers
            </Link>
          </header>
          <div className="grid grid-cols-2 gap-3.5 max-[850px]:grid-cols-1">
            {people.map((person) => (
              <CaregiverResultCard
                key={person.id}
                caregiver={person}
                saved={saved.includes(person.id)}
                onViewProfile={() =>
                  setSelected(
                    caregivers.findIndex((item) => item.id === person.id),
                  )
                }
                onToggleSave={() => {
                  void toggleSaved(person.id);
                }}
              />
            ))}
            {ready && !people.length && (
              <p className="col-span-full py-8 text-center text-sm text-[#667085]">
                No caregivers are available yet.
              </p>
            )}
          </div>
        </section>
        <section className="rounded-xl border border-[#ececf0] bg-white p-5">
          <h2 className="mb-5 font-commissioner text-2xl font-semibold">
            Recent Activity
          </h2>
          {activity.map((item) => (
            <article
              key={item.id}
              className="flex gap-3 border-b border-[#f0f0f3] py-3 last:border-0"
            >
              <MessageSquare
                size={18}
                className="mt-1 shrink-0 text-[#ff2f68]"
              />
              <div>
                <p className="text-sm">{item.text}</p>
                <time className="text-xs text-[#667085]">
                  {dateLabel(item.time)}
                </time>
              </div>
            </article>
          ))}
          {ready && !activity.length && (
            <p className="text-sm text-[#667085]">
              Your activity will appear here.
            </p>
          )}
        </section>
        <section>
          <h2 className="mb-5 font-commissioner text-2xl font-semibold">
            My Active Care Requirements
          </h2>
          {active.slice(0, 2).map((item) => (
            <article
              key={item.id}
              className="mb-4 rounded-xl border border-[#ececf0] bg-white p-5"
            >
              <div className="flex justify-between gap-3">
                <h3 className="font-jakarta text-lg font-semibold">
                  {item.title}
                </h3>
                <span className="rounded-full bg-[#ecf9f0] px-3 py-1 text-xs text-[#3c9c68]">
                  Active
                </span>
              </div>
              <div className="my-5 flex flex-wrap gap-4 text-sm text-[#838893]">
                <span className="flex gap-1">
                  <MapPin size={15} />
                  {item.location}
                </span>
                <span className="flex gap-1">
                  <CalendarDays size={15} />
                  {item.schedule}
                </span>
                <span className="flex gap-1">
                  <Clock3 size={15} />£{item.budgetPence / 100}/hour
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 text-sm">
                <p>{item._count?.applications ?? 0} caregivers responded</p>
                <Link
                  href={`/care-seeker-dashboard/my-requests/${item.id}/responses`}
                  className="text-[#ff2f68]"
                >
                  View responses
                </Link>
              </div>
            </article>
          ))}
          {ready && !active.length && (
            <div className="rounded-xl border bg-white p-6 text-sm">
              <p>No active care requirements.</p>
              <Link
                href="/care-seeker-dashboard/care-requirements/create"
                className="mt-3 inline-block text-[#ff2f68]"
              >
                Post a Care Requirement
              </Link>
            </div>
          )}
        </section>
        <section className="rounded-xl border border-[#ececf0] bg-white p-5">
          <header className="mb-5 flex justify-between">
            <h2 className="font-commissioner text-2xl font-semibold">
              Recent Reviews
            </h2>
            <Link
              href="/care-seeker-dashboard/reviews-ratings"
              className="text-sm text-[#ff2f68]"
            >
              View all
            </Link>
          </header>
          {snapshot.reviews.slice(0, 2).map((review) => (
            <article key={review.id} className="border-t py-4">
              <p className="flex gap-1 text-[#f5a524]">
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </p>
              <p className="my-3 text-sm leading-6">{review.body}</p>
              <p className="text-xs text-[#667085]">
                For {review.caregiver.firstName} {review.caregiver.lastName}
              </p>
            </article>
          ))}
          {ready && !snapshot.reviews.length && (
            <p className="text-sm text-[#667085]">No reviews yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
