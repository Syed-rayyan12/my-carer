"use client";
import { useSaveNotice } from '@/components/platform/useSaveNotice';

import { usePathname } from "next/navigation";
import { loadAdminPage } from "./admin-api";
import type { Pagination } from "@/components/platform/workspace-api";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth/AuthBoundary";
import { accountApi } from "@/components/auth/auth-client";
import type { AdminSection, AdminUserStatus } from "./adminData";
import type { AdminCaregiver } from "./caregivers/adminCaregiverData";
import type { AdminCareSeeker } from "./care-seekers/adminCareSeekerData";
import { emptySnapshot, mapAdminData, type AdminSnapshot } from "./admin-live";
export type AdminDialog =
  | { type: "user" | "caregiver" | "approve" | "reject"; userId: string }
  | { type: "section"; section: AdminSection }
  | null;
function useLiveDashboard() {
  const auth = useAuth()!;
  const pathname = usePathname();
  const [pageState, setPageState] = useState({ pathname, page: 1 });
  const page = pageState.pathname === pathname ? pageState.page : 1;
  const setPage = (next: number) =>
    setPageState({ pathname, page: Math.max(1, next) });
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const generation = useRef(0);
  const invalidatePending = useCallback(() => {
    generation.current++;
  }, []);
  const routeKey = pathname + ":" + page;
  const [loadedFor, setLoadedFor] = useState("");
  const [loadedSnapshot, setSnapshot] = useState<AdminSnapshot>(emptySnapshot);
  const snapshot = loadedFor === routeKey ? loadedSnapshot : emptySnapshot;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [dialog, setDialog] = useState<AdminDialog>(null);
  const { notice, setNotice } = useSaveNotice(routeKey);
  const refresh = useCallback(async () => {
    const current = ++generation.current;
    const result = await loadAdminPage(pathname, page);
    if (current !== generation.current) return;
    setSnapshot(result.snapshot);
    setLoadedFor(routeKey);
    setPagination(result.pagination);
    setError("");

    setReady(true);
  }, [pathname, page, routeKey]);
  const currentRefresh = useRef(refresh);
  useEffect(() => {
    currentRefresh.current = refresh;
  }, [refresh]);
  useEffect(() => {
    let active = true;
    void refresh().catch((issue) => {
      if (active) {
        setError(
          issue instanceof Error ? issue.message : "Unable to load page",
        );
        setSnapshot(emptySnapshot);
        setLoadedFor(routeKey);
        setReady(true);
      }
    });
    return () => {
      active = false;
      invalidatePending();
    };
  }, [refresh, routeKey, invalidatePending]);
  useEffect(() => {
    const onFocus = () => {
      refresh().catch((issue) =>
        setError(issue instanceof Error ? issue.message : "Unable to refresh"),
      );
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenu(false);
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);
  const data = useMemo(() => mapAdminData(snapshot), [snapshot]);
  const mutate = async (
    path: string,
    body: unknown,
    method: "POST" | "PATCH" | "DELETE" = "PATCH",
  ) => {
    if (saving.current) return false;
    saving.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await accountApi(path, { method, body, csrfToken: auth.csrfToken });
      await currentRefresh.current();
      setNotice("Changes saved to the database.");
      return true;
    } catch (issue) {
      setError(
        issue instanceof Error ? issue.message : "Unable to save changes",
      );
      return false;
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  const setUserStatus = async (
    id: string,
    status: AdminUserStatus,
    reason?: string,
  ) => {
    if (status === "Pending") {
      setError("Accounts cannot be reset to pending.");
      return false;
    }
    return mutate(`admin/registrations/${id}/status`, {
      status: status.toUpperCase(),
      ...(reason?.trim() ? { reason: reason.trim() } : {}),
    });
  };
  const profileBody = (person: AdminCaregiver | AdminCareSeeker) => {
    const current = snapshot.users.find((item) => item.id === person.id);
    if (current && person.email !== current.email)
      throw new Error("Sign-in email changes are not supported here.");
    const [firstName, ...last] = person.name.trim().split(/\s+/);
    if (!last.length) throw new Error("Enter both first and last name.");
    return {
      firstName,
      lastName: last.join(" "),
      location: person.location,
      phone:
        person.type === "Caregiver"
          ? (person.profile?.phone ?? "")
          : person.phone,
    };
  };
  const updateCaregiver = async (person: AdminCaregiver) => {
    try {
      const current = data.caregivers?.find((item) => item.id === person.id);
      if (
        (person.priority ?? "Normal") !== (current?.priority ?? "Normal") ||
        person.profile?.mileageRate !== current?.profile?.mileageRate ||
        person.profile?.experience !== current?.profile?.experience
      )
        throw new Error(
          "Priority, mileage and experience editing are not supported by the current backend.",
        );
      return await mutate(`platform/admin/users/${person.id}/profile`, {
        ...profileBody(person),
        hourlyRatePence: Math.round((person.profile?.hourlyRate ?? 0) * 100),
        availability: person.profile?.availability ?? "",
        ...(person.profile?.availabilitySchedule ? { availabilitySchedule: { weekly: person.profile.availabilitySchedule.weekly, minimumVisitMinutes: person.profile.availabilitySchedule.minimumVisitMinutes ?? 30 } } : {}),
        services: person.profile?.careTypes.join(", ") ?? "",
        qualifications: person.profile?.qualifications.join("\n") ?? "",
      });
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to save");
      return false;
    }
  };
  const updateCareSeeker = async (person: AdminCareSeeker) => {
    try {
      const current = data.careSeekers?.find((item) => item.id === person.id);
      if (
        JSON.stringify(current?.requirement) !==
        JSON.stringify(person.requirement)
      )
        throw new Error(
          "Edit care requirements from the Care Requests section.",
        );
      return await mutate(
        `platform/admin/users/${person.id}/profile`,
        profileBody(person),
      );
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to save");
      return false;
    }
  };
  const setCaregiverSuspended = (id: string, suspended: boolean) =>
    setUserStatus(
      id,
      suspended ? "Suspended" : "Active",
      suspended ? "Suspended by administrator" : undefined,
    );
  const setCareSeekerSuspended = setCaregiverSuspended;
  const deleteCaregiver = (_id: string) => {
    void _id;
    setError(
      "Account deletion is not enabled. Use Suspend Account to revoke access.",
    );
  };
  const deleteCareSeeker = deleteCaregiver;
  return {
    pagination,
    page,
    setPage,
    data,
    snapshot,
    ready: ready && loadedFor === routeKey,
    storageError: false,
    error: loadedFor === routeKey ? error : "",
    setError,
    busy,
    search,
    setSearch,
    mobileMenu,
    setMobileMenu,
    notificationsRead,
    setNotificationsRead,
    dialog,
    setDialog,
    notice: loadedFor === routeKey ? notice : "",
    refresh,
    mutate,
    setUserStatus,
    updateCaregiver,
    updateCareSeeker,
    setCaregiverSuspended,
    setCareSeekerSuspended,
    deleteCaregiver,
    deleteCareSeeker,
  };
}
const AdminContext = createContext<ReturnType<typeof useLiveDashboard> | null>(
  null,
);
export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const value = useLiveDashboard();
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
export function useAdminDashboard() {
  const value = useContext(AdminContext);
  if (!value)
    throw new Error("Admin components must be inside AdminDashboardProvider");
  return value;
}
