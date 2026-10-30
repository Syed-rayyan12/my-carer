"use client";

import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { defaultSavedCaregiverNames } from "./caregivers/caregiverDirectoryData";

type DashboardState = {
  mobileMenu: boolean;
  setMobileMenu: Dispatch<SetStateAction<boolean>>;
  saved: string[];
  toggleSaved: (name: string) => void;
  setCaregiverSaved: (name: string, saved: boolean) => void;
  savedReady: boolean;
  savedStorageError: boolean;
  selected: number | null;
  setSelected: Dispatch<SetStateAction<number | null>>;
  panel: string | null;
  setPanel: Dispatch<SetStateAction<string | null>>;
  showPanel: (title: string) => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

const DashboardContext = createContext<DashboardState | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [savedReady, setSavedReady] = useState(false);
  const [savedStorageError, setSavedStorageError] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("my-carer-saved-caregivers");
      if (stored === null) {
        setSaved(defaultSavedCaregiverNames);
      } else {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(value => typeof value === "string")) setSaved([...new Set(parsed)]);
      }
    } catch {
      setSavedStorageError(true);
      setSaved(defaultSavedCaregiverNames);
    } finally {
      setSavedReady(true);
    }
  }, []);

  useEffect(() => {
    if (!savedReady) return;
    try { localStorage.setItem("my-carer-saved-caregivers", JSON.stringify(saved)); }
    catch { setSavedStorageError(true); }
  }, [saved, savedReady]);

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileMenu(false);
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, []);

  function showPanel(title: string) {
    setMobileMenu(false);
    const pageRoutes: Record<string, string> = {
      "My Arrangements": "/care-seeker-dashboard/care-arrangements",
      "Care Arrangements": "/care-seeker-dashboard/care-arrangements",
      "My Reviews": "/care-seeker-dashboard/reviews-ratings",
      "Reviews & Ratings": "/care-seeker-dashboard/reviews-ratings",
      "Settings": "/care-seeker-dashboard/settings",
    };
    if (pageRoutes[title]) {
      setPanel(null);
      router.push(pageRoutes[title]);
      return;
    }
    if (title === "Messages") {
      setPanel(null);
      router.push("/care-seeker-dashboard/messages");
      return;
    }
    if (title === "My Requests") {
      setPanel(null);
      router.push("/care-seeker-dashboard/my-requests");
      return;
    }
    if (title === "Saved Caregivers") {
      setPanel(null);
      router.push("/care-seeker-dashboard/saved-caregivers");
      return;
    }
    if (title === "My Care Requirements" || title === "Post a Care Requirement") {
      setPanel(null);
      router.push(title === "My Care Requirements" ? "/care-seeker-dashboard/care-requirements" : "/care-seeker-dashboard/care-requirements/create");
      return;
    }
    setPanel(title);
  }

  function toggleSaved(name: string) {
    setSaved(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
  }

  function setCaregiverSaved(name: string, isSaved: boolean) {
    setSaved(current => isSaved ? current.includes(name) ? current : [...current, name] : current.filter(item => item !== name));
  }

  return (
    <DashboardContext.Provider value={{ mobileMenu, setMobileMenu, saved, toggleSaved, setCaregiverSaved, savedReady, savedStorageError, selected, setSelected, panel, setPanel, showPanel, search, setSearch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("Dashboard components must be inside DashboardProvider");
  return context;
}
