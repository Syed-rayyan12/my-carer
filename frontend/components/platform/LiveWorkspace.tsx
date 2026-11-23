"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { loadWorkspacePage, type Pagination } from "./workspace-api";
import { useAuth } from "@/components/auth/AuthBoundary";
import { accountApi } from "@/components/auth/auth-client";
import type { WorkspaceSnapshot, Person } from "./workspace.types";
export type * from "./workspace.types";
const empty: WorkspaceSnapshot = {
  account: {},
  professional: null,
  membership: null,
  access: { active: false, trial: false, entitlements: {} },
  organisation: null,
  requests: [],
  applications: [],
  messages: [],
  caregivers: [],
  saved: [],
  reviews: [],
  verifications: [],
};
function useWorkspaceState() {
  const auth = useAuth()!;
  const pathname = usePathname();
  const [pageState, setPageState] = useState({ pathname, page: 1 });
  const page = pageState.pathname === pathname ? pageState.page : 1;
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const generation = useRef(0);
  const setPage = (next: number) =>
    setPageState({ pathname, page: Math.max(1, next) });
  const invalidatePending = useCallback(() => {
    generation.current++;
  }, []);
  const routeKey = pathname + ":" + page;
  const [loadedFor, setLoadedFor] = useState("");
  const [loadedSnapshot, setSnapshot] = useState(empty);
  const snapshot = loadedFor === routeKey ? loadedSnapshot : empty;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const refresh = useCallback(async () => {
    const current = ++generation.current;
    const result = await loadWorkspacePage(pathname, page);
    if (current !== generation.current) return;
    setSnapshot({ ...empty, ...result.snapshot });
    setLoadedFor(routeKey);
    setPagination(result.pagination);
    setError("");
    setNotice("");
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
        setSnapshot(empty);
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
    const focus = () => {
      void refresh().catch((issue) =>
        setError(issue instanceof Error ? issue.message : "Unable to refresh"),
      );
    };
    window.addEventListener("focus", focus);
    return () => window.removeEventListener("focus", focus);
  }, [refresh]);
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
      setNotice("Changes saved.");
      return true;
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to save");
      return false;
    } finally {
      saving.current = false;
      setBusy(false);
    }
  };
  return {
    snapshot,
    pagination,
    page,
    setPage,
    ready: ready && loadedFor === routeKey,
    error: loadedFor === routeKey ? error : "",
    setError,
    notice: loadedFor === routeKey ? notice : "",
    busy,
    refresh,
    mutate,
    user: auth.user,
  };
}
const Context = createContext<ReturnType<typeof useWorkspaceState> | null>(
  null,
);
export function LiveWorkspaceProvider({ children }: { children: ReactNode }) {
  const value = useWorkspaceState();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLiveWorkspace() {
  const value = useContext(Context);
  if (!value) throw new Error("LiveWorkspaceProvider is required");
  return value;
}
export function WorkspaceFeedback() {
  const { error, notice, pagination, page, setPage, ready } =
    useLiveWorkspace();
  return (
    <>
      {ready && pagination && (pagination.hasMore || page > 1) && (
        <nav
          aria-label="Results pages"
          className="mx-8 mb-4 flex items-center justify-end gap-3 text-sm"
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
      {error && (
        <p
          role="alert"
          className="mx-8 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mx-8 mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
        >
          {notice}
        </p>
      )}
    </>
  );
}
export const personName = (person: Person) =>
  `${person.firstName} ${person.lastName}`;
export const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-GB");
