import { accountApi } from "@/components/auth/auth-client";
import { emptySnapshot, type AdminSnapshot } from "./admin-live";
import type { Pagination } from "@/components/platform/workspace-api";
type Response<T> = { data: T; pagination?: Pagination };
export async function loadAdminPage(pathname: string, page: number) {
  const snapshot: AdminSnapshot = { ...emptySnapshot };
  let pagination: Pagination | null = null;
  const [, section = "", id] = pathname.split("/").filter(Boolean);
  const list = async <
    K extends "users" | "requests" | "messages" | "reviews" | "verifications",
  >(
    key: K,
    path: string,
    primary = false,
  ) => {
    const r = await accountApi<Response<AdminSnapshot[K]>>(
      `${path}${path.includes("?") ? "&" : "?"}page=${primary ? page : 1}&limit=25`,
    );
    Object.assign(snapshot, { [key]: r.data });
    if (primary) pagination = r.pagination ?? null;
  };
  if (!section) {
    const r = await accountApi<
      Response<Pick<AdminSnapshot, "users" | "activity" | "counts">>
    >("platform/admin/overview");
    Object.assign(snapshot, r.data);
  } else if (["caregivers", "care-seekers"].includes(section)) {
    const role = section === "caregivers" ? "CAREGIVER" : "CARE_SEEKER";
    await Promise.all([
      list(
        "users",
        `platform/admin/users?role=${role}${id ? "&id=" + encodeURIComponent(id) : ""}`,
        !id,
      ),
      ...(id
        ? [
            section === "caregivers"
              ? list(
                  "reviews",
                  `platform/admin/reviews?caregiverId=${encodeURIComponent(id)}`,
                )
              : list(
                  "requests",
                  `platform/admin/requests?ownerId=${encodeURIComponent(id)}`,
                ),
          ]
        : []),
    ]);
  } else if (["care-jobs", "care-requests"].includes(section)) {
    await list(
      "requests",
      `platform/admin/requests${id ? "?id=" + encodeURIComponent(id) : ""}`,
      !id,
    );
  } else if (["subscriptions", "membership"].includes(section)) {
    await list("users", "platform/admin/users?view=memberships", true);
  } else if (section === "organisations") {
    await list("users", "platform/admin/users?organisations=true", true);
  } else if (section === "messages") {
    await list("messages", "platform/messages", true);
  } else if (section === "reviews") {
    await list("reviews", "platform/admin/reviews", true);
  } else if (section === "verification") {
    await list("verifications", "platform/admin/verifications", true);
  }
  snapshot.requests = snapshot.requests.map((r) => ({
    ...r,
    applications: r.applications ?? [],
  }));
  if (id && (section === "care-jobs" || section === "care-seekers")) {
    type Application =
      AdminSnapshot["requests"][number]["applications"][number] & {
        requestId: string;
        request?: AdminSnapshot["requests"][number];
      };
    const r = await accountApi<Response<Application[]>>(
      "platform/admin/applications?" +
        (section === "care-jobs" ? "requestId=" : "ownerId=") +
        encodeURIComponent(id) +
        "&page=" +
        page +
        "&limit=25",
    );
    for (const application of r.data) {
      let req = snapshot.requests.find((q) => q.id === application.requestId);
      if (!req && application.request) {
        req = { ...application.request, applications: [] };
        snapshot.requests.push(req);
      }
      if (req) req.applications.push(application);
    }
    pagination = r.pagination ?? null;
    if (section === "care-seekers" && r.data.length) {
      const ids = [...new Set(r.data.map((a) => a.caregiverId))].join(",");
      const people = await accountApi<Response<AdminSnapshot["users"]>>(
        "platform/admin/users?view=identities&ids=" +
          encodeURIComponent(ids) +
          "&limit=100",
      );
      snapshot.users.push(...people.data);
    }
  }
  const notifications = await accountApi<
    Response<NonNullable<AdminSnapshot["notifications"]>>
  >("platform/notifications");
  snapshot.notifications = notifications.data;
  // UI defaults for fields absent from lightweight registration/subscription summaries.
  snapshot.users = snapshot.users.map((u) => ({
    ...u,
    profile: u.profile ?? null,
    professional: u.professional ?? null,
    organisation: u.organisation ?? null,
    membership: u.membership ?? null,
    verifications: u.verifications ?? [],
  }));
  return { snapshot, pagination };
}
