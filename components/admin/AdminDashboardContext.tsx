"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePersistentDashboardState } from "@/components/dashboard/usePersistentDashboardState";
import { initialAdminData, isAdminData, type AdminSection, type AdminUserStatus, type AdminData } from "./adminData";
import { getAdminCaregivers, type AdminCaregiver } from "./caregivers/adminCaregiverData";
import { getAdminCareSeekers, type AdminCareSeeker } from "./care-seekers/adminCareSeekerData";

export type AdminDialog = { type: "user" | "caregiver" | "approve" | "reject"; userId: string } | { type: "section"; section: AdminSection } | null;
type AdminContextValue = {
  data: AdminData; ready: boolean; storageError: boolean;
  search: string; setSearch: (search: string) => void;
  mobileMenu: boolean; setMobileMenu: (open: boolean) => void;
  notificationsRead: boolean; setNotificationsRead: (read: boolean) => void;
  dialog: AdminDialog; setDialog: (dialog: AdminDialog) => void;
  notice: string; setUserStatus: (id: string, status: AdminUserStatus, reason?: string) => void;
  updateCaregiver: (caregiver: AdminCaregiver) => void;
  setCaregiverSuspended: (id: string, suspended: boolean) => void;
  deleteCaregiver: (id: string) => void;
  updateCareSeeker: (seeker: AdminCareSeeker) => void;
  setCareSeekerSuspended: (id: string, suspended: boolean) => void;
  deleteCareSeeker: (id: string) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const { value: data, setValue: setData, ready, storageError } = usePersistentDashboardState("my-carer-admin-overview", initialAdminData, isAdminData);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [dialog, setDialog] = useState<AdminDialog>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    function escape(event: KeyboardEvent) { if (event.key === "Escape") setMobileMenu(false); }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);

  function setUserStatus(id: string, status: AdminUserStatus, reason?: string) {
    if (!ready) return;
    const rejectionReason = reason?.trim();
    if (status === "Rejected" && !rejectionReason) return;
    const user = data.users.find(item => item.id === id) ?? getAdminCaregivers(data).find(item => item.id === id) ?? getAdminCareSeekers(data).find(item => item.id === id);
    if (!user || user.status === status) return;
    setData(current => ({
      ...current,
      users: current.users.map(item => item.id === id ? { ...item, status, rejectionReason: status === "Rejected" ? rejectionReason : undefined } : item),
      careSeekers: getAdminCareSeekers(current).map(item => item.id === id ? { ...item, status, rejectionReason: status === "Rejected" ? rejectionReason : undefined } : item),
      caregivers: getAdminCaregivers(current).map(item => item.id === id ? { ...item, status, rejectionReason: status === "Rejected" ? rejectionReason : undefined, verification: status === "Active" ? "Verified" : status === "Rejected" ? "Rejected" : item.verification } : item),
      activity: [{ id: crypto.randomUUID(), kind: "registration" as const, text: `${user.name} was ${status === "Active" ? "approved" : status === "Suspended" ? "suspended" : status === "Pending" ? "set to pending" : "rejected"} by Admin`, time: "Just now" }, ...current.activity].slice(0, 10),
    }));
    setNotice(`${user.name} ${status === "Active" ? "approved" : status === "Suspended" ? "suspended" : status === "Pending" ? "set to pending" : "rejected"} in this local preview.`);
  }

  function updateCaregiver(caregiver: AdminCaregiver) {
    if (!ready) return;
    setData(current => ({ ...current, caregivers: getAdminCaregivers(current).map(item => item.id === caregiver.id ? caregiver : item), users: current.users.map(item => item.id === caregiver.id ? { ...item, name: caregiver.name, initials: caregiver.initials, email: caregiver.email, location: caregiver.location } : item), activity: [{ id: crypto.randomUUID(), kind: "profile" as const, text: `${caregiver.name}'s profile was updated by Admin`, time: "Just now" }, ...current.activity].slice(0, 10) }));
    setNotice("Caregiver profile saved on this device.");
  }

  function setCaregiverSuspended(id: string, suspended: boolean) {
    if (!ready) return;
    const caregiver = getAdminCaregivers(data).find(item => item.id === id);
    if (!caregiver || (caregiver.status === "Suspended") === suspended) return;
    const status = suspended ? "Suspended" : caregiver.suspendedFrom ?? "Active";
    const suspendedFrom = suspended && caregiver.status !== "Suspended" ? caregiver.status : undefined;
    setData(current => ({ ...current, caregivers: getAdminCaregivers(current).map(item => item.id === id ? { ...item, status, suspendedFrom } : item), users: current.users.map(item => item.id === id ? { ...item, status } : item), activity: [{ id: crypto.randomUUID(), kind: "profile" as const, text: `${caregiver.name}'s account was ${suspended ? "suspended" : "reactivated"} by Admin`, time: "Just now" }, ...current.activity].slice(0, 10) }));
    setNotice(`Account ${suspended ? "suspended" : "reactivated"} in this local preview.`);
  }

  function deleteCaregiver(id: string) {
    if (!ready) return;
    const caregiver = getAdminCaregivers(data).find(item => item.id === id);
    if (!caregiver) return;
    setData(current => ({ ...current, caregivers: getAdminCaregivers(current).filter(item => item.id !== id), users: current.users.filter(item => item.id !== id), activity: [{ id: crypto.randomUUID(), kind: "profile" as const, text: `${caregiver.name}'s account was removed from the local preview`, time: "Just now" }, ...current.activity].slice(0, 10) }));
    setNotice("Caregiver removed from this local preview.");
  }

  function updateCareSeeker(seeker: AdminCareSeeker) {
    if (!ready) return;
    setData(current => ({ ...current, careSeekers: getAdminCareSeekers(current).map(item => item.id === seeker.id ? seeker : item), users: current.users.map(item => item.id === seeker.id ? { ...item, name: seeker.name, initials: seeker.initials, email: seeker.email, location: seeker.location } : item), activity: [{ id: crypto.randomUUID(), kind: "profile" as const, text: `${seeker.name}'s care seeker profile was updated by Admin`, time: "Just now" }, ...current.activity].slice(0, 10) }));
    setNotice("Care seeker profile saved on this device.");
  }

  function setCareSeekerSuspended(id: string, suspended: boolean) {
    if (!ready) return;
    const seeker = getAdminCareSeekers(data).find(item => item.id === id);
    if (!seeker || (seeker.status === "Suspended") === suspended) return;
    const status = suspended ? "Suspended" : seeker.suspendedFrom ?? "Active";
    const suspendedFrom = suspended && seeker.status !== "Suspended" ? seeker.status : undefined;
    setData(current => ({ ...current, careSeekers: getAdminCareSeekers(current).map(item => item.id === id ? { ...item, status, suspendedFrom } : item), users: current.users.map(item => item.id === id ? { ...item, status } : item), activity: [{ id: crypto.randomUUID(), kind: "profile" as const, text: `${seeker.name}'s account was ${suspended ? "suspended" : "reactivated"} by Admin`, time: "Just now" }, ...current.activity].slice(0, 10) }));
    setNotice(`Care seeker account ${suspended ? "suspended" : "reactivated"} in this local preview.`);
  }

  function deleteCareSeeker(id: string) {
    if (!ready) return;
    const seeker = getAdminCareSeekers(data).find(item => item.id === id);
    if (!seeker) return;
    setData(current => ({ ...current, careSeekers: getAdminCareSeekers(current).filter(item => item.id !== id), users: current.users.filter(item => item.id !== id), activity: [{ id: crypto.randomUUID(), kind: "profile" as const, text: `${seeker.name}'s care seeker account was removed from the local preview`, time: "Just now" }, ...current.activity].slice(0, 10) }));
    setNotice("Care seeker removed from this local preview.");
  }

  return <AdminContext.Provider value={{ data, ready, storageError, search, setSearch, mobileMenu, setMobileMenu, notificationsRead, setNotificationsRead, dialog, setDialog, notice, setUserStatus, updateCaregiver, setCaregiverSuspended, deleteCaregiver, updateCareSeeker, setCareSeekerSuspended, deleteCareSeeker }}>{children}</AdminContext.Provider>;
}

export function useAdminDashboard() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("Admin components must be inside AdminDashboardProvider");
  return context;
}
