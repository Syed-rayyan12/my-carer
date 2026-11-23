"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { useLiveWorkspace } from "./LiveWorkspace";
export function PackageNotice({
  feature,
  label,
}: {
  feature: string;
  label: string;
}) {
  const { snapshot } = useLiveWorkspace();
  if (snapshot.access?.entitlements[feature] === true) return null;
  return (
    <div className="my-4 flex items-start gap-3 rounded-xl border border-[#ffd3df] bg-[#fff5f8] p-4 text-sm">
      <LockKeyhole className="mt-0.5 shrink-0 text-[#c71d50]" size={18} />
      <div>
        <p className="font-semibold text-[#101929]">
          {label} requires a different package
        </p>
        <p className="mt-1 text-xs leading-5 text-[#667085]">
          Your current package is{" "}
          {snapshot.membership?.plan?.title ?? "loading"}.{" "}
          <Link
            href="/caregiver-dashboard/membership"
            className="font-semibold text-[#c71d50] underline"
          >
            View package options
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
export function PackageAccess({ children }: { children: ReactNode }) {
  const { snapshot, ready, user } = useLiveWorkspace();
  const path = usePathname();
  const feature = path.includes("/availability")
    ? "availability"
    : path.includes("/verification")
      ? "dbs"
      : path.includes("/messages")
        ? "directMessages"
        : null;
  if (!feature || (user.role === "CARE_SEEKER" && !path.includes("/messages")))
    return children;
  if (!ready)
    return (
      <p role="status" className="p-6">
        Loading package access...
      </p>
    );
  if (snapshot.access?.entitlements[feature] === true) return children;
  const root =
    user.role === "CAREGIVER"
      ? "/caregiver-dashboard"
      : "/care-seeker-dashboard";
  return (
    <section className="m-6 rounded-2xl border border-[#e5dce0] bg-white p-8">
      <LockKeyhole size={28} className="mb-4 text-[#ff2f68]" />
      <h1 className="text-2xl font-semibold">
        This feature is outside your current package
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[#667085]">
        Review the features included in your package and choose the access you
        need. A paid package includes a six-month launch trial after approval.
      </p>
      <Link
        href={`${root}/membership`}
        className="mt-6 inline-block rounded-lg bg-[#ff2f68] px-5 py-3 text-sm font-semibold text-white"
      >
        View membership
      </Link>
    </section>
  );
}
