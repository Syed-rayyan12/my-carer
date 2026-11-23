"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth, LogoutButton } from "./AuthBoundary";
import { LiveWorkspaceProvider } from "@/components/platform/LiveWorkspace";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function CareSeekerProfileGate({
  children,
}: {
  children: ReactNode;
}) {
  const session = useAuth()!;
  const pathname = usePathname();
  const router = useRouter();
  const complete = session.user.profileComplete === true;
  const profilePath = "/care-seeker-dashboard/my-profile";
  useEffect(() => {
    if (!complete && pathname !== profilePath) router.replace(profilePath);
  }, [complete, pathname, router]);
  if (!complete) {
    if (pathname !== profilePath)
      return (
        <main className="grid min-h-screen place-items-center bg-[#f3f4f6]">
          <p role="status">Opening your profile…</p>
        </main>
      );
    return (
      <div className="min-h-screen bg-[#f3f4f6]">
        <header className="mx-auto flex max-w-[1530px] items-center justify-between px-8 py-6">
          <Link href="/" className="text-2xl font-bold text-[#ff2f68]">
            My Carer
          </Link>
          <LogoutButton className="rounded-lg border bg-white px-4 py-2 text-sm" />
        </header>
        <div className="mx-auto mb-6 max-w-[1530px] px-8">
          <p
            role="status"
            className="rounded-xl border border-[#ffd3df] bg-[#fff5f8] p-4 text-sm leading-6 text-[#344054]"
          >
            Your account is approved. Complete your profile to open your
            dashboard. Name, email, UK phone, town/city, address, postcode and
            an introduction are required. Date of birth and emergency contact
            are optional.
          </p>
        </div>
        {children}
      </div>
    );
  }
  return (
    <LiveWorkspaceProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </LiveWorkspaceProvider>
  );
}
