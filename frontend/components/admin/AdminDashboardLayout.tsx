"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import {
  AdminDashboardProvider,
  useAdminDashboard,
} from "./AdminDashboardContext";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminDialogs from "./AdminDialogs";
import { AdminContentProvider } from "./AdminContentContext";
import SaveToast from '@/components/platform/SaveToast';

function AdminShell({ children }: { children: ReactNode }) {
  const {
    mobileMenu,
    setMobileMenu,
    error,
    notice,
    busy,
    refresh,
    pagination,
    page,
    setPage,
    ready,
  } = useAdminDashboard();
  return (
    <div className="flex min-h-screen bg-[#f3f4f6] text-[13px] text-[#202630]">
      {mobileMenu && (
        <button
          className="fixed inset-0 z-30 bg-[#101929]/35"
          aria-label="Close admin navigation"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <AdminSidebar />
      <div className="ml-[278px] min-w-0 flex-1 max-[1250px]:ml-[251px] max-[850px]:ml-[241px] max-[640px]:ml-0">
        <AdminHeader />
        {error && (
          <div
            role="alert"
            className="mx-8 mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
            <button
              className="ml-4 underline"
              onClick={() => {
                void refresh().catch(() => {});
              }}
            >
              Retry
            </button>
          </div>
        )}
        {notice && <SaveToast key={notice} message={notice} />}
        {busy && (
          <p role="status" className="sr-only">
            Saving changes
          </p>
        )}
        {children}
        {ready && pagination && (pagination.hasMore || page > 1) && (
          <nav
            aria-label="Results pages"
            className="mx-8 my-5 flex justify-end items-center gap-3"
          >
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              disabled={!pagination.hasMore}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border px-3 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </nav>
        )}
      </div>
      <AdminDialogs />
    </div>
  );
}

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <AdminDashboardProvider>
        <AdminContentProvider>
          <AdminShell>{children}</AdminShell>
        </AdminContentProvider>
      </AdminDashboardProvider>
    </MotionConfig>
  );
}
