"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useLiveWorkspace } from "@/components/platform/LiveWorkspace";
import { workspaceDirectory } from "./live-data";
function useStateValue() {
  const live = useLiveWorkspace();
  const router = useRouter();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const caregivers = useMemo(
    () => workspaceDirectory(live.snapshot),
    [live.snapshot],
  );
  const saved = live.snapshot.saved.map((item) => item.caregiverId);
  const setCaregiverSaved = (id: string, value: boolean) =>
    live.mutate(
      value ? "platform/saved" : `platform/saved/${id}`,
      value ? { caregiverId: id } : {},
      value ? "POST" : "DELETE",
    );
  const toggleSaved = (id: string) =>
    setCaregiverSaved(id, !saved.includes(id));
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenu(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const showPanel = (title: string) => {
    setMobileMenu(false);
    const paths: Record<string, string> = {
      "My Profile": "my-profile",
      "My Arrangements": "care-arrangements",
      "Care Arrangements": "care-arrangements",
      "My Reviews": "reviews-ratings",
      "Reviews & Ratings": "reviews-ratings",
      Settings: "settings",
      Messages: "messages",
      "My Requests": "my-requests",
      "Saved Caregivers": "saved-caregivers",
      "My Care Requirements": "care-requirements",
      "Post a Care Requirement": "care-requirements/create",
      "Caregiver Responses": "my-requests",
    };
    if (paths[title]) {
      setPanel(null);
      router.push(`/care-seeker-dashboard/${paths[title]}`);
    } else setPanel(title);
  };
  return {
    ...live,
    showPanel,
    mobileMenu,
    setMobileMenu,
    selected,
    setSelected,
    panel,
    setPanel,
    search,
    setSearch,
    caregivers,
    saved,
    toggleSaved,
    setCaregiverSaved,
    savedReady: live.ready,
    savedStorageError: false,
  };
}
const Context = createContext<ReturnType<typeof useStateValue> | null>(null);
export function DashboardProvider({ children }: { children: ReactNode }) {
  const value = useStateValue();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useDashboard() {
  const value = useContext(Context);
  if (!value) throw new Error("DashboardProvider is required");
  return value;
}
