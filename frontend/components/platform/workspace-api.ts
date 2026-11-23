import { accountApi } from "@/components/auth/auth-client";
import type { WorkspaceSnapshot, LiveCaregiver } from "./workspace.types";

export type Pagination = { page: number; limit: number; hasMore: boolean };
export type PageResult = {
  snapshot: Partial<WorkspaceSnapshot>;
  pagination: Pagination | null;
};
type Response<T> = { data: T; pagination?: Pagination };

/** Only resources rendered by this page are requested. Defaults live in React, not in the API. */
export async function loadWorkspacePage(
  pathname: string,
  page: number,
): Promise<PageResult> {
  const result: Partial<WorkspaceSnapshot> = {};
  let pagination: Pagination | null = null;
  const list = async <
    K extends
      | "requests"
      | "applications"
      | "messages"
      | "caregivers"
      | "saved"
      | "reviews"
      | "verifications",
  >(
    key: K,
    path: string,
    primary = false,
  ) => {
    const response = await accountApi<Response<WorkspaceSnapshot[K]>>(
      `${path}${path.includes("?") ? "&" : "?"}page=${primary ? page : 1}&limit=25`,
    );
    Object.assign(result, { [key]: response.data });
    if (primary) pagination = response.pagination ?? null;
  };
  const segment = pathname.split("/").filter(Boolean);
  const caregiver = segment[0] === "caregiver-dashboard";
  const section = segment[1] ?? "";
  const actions: Promise<unknown>[] = [];
  // Shared shell: identity, access and membership for navigation/feature gates.
  actions.push(
    accountApi<Response<Pick<WorkspaceSnapshot, "membership" | "access">>>(
      "platform/account",
    ).then((r) => {
      result.access = r.data.access;
      if (section !== "membership") result.membership = r.data.membership;
    }),
  );
  actions.push(
    accountApi<Response<WorkspaceSnapshot["notifications"]>>(
      "platform/notifications",
    ).then((r) => {
      result.notifications = r.data;
    }),
  );
  if (
    ["my-profile", "settings", "account-settings", "profile-preview"].includes(
      section,
    ) &&
    (caregiver || section !== "my-profile")
  ) {
    const profilePath = caregiver ? "platform/profile" : "care-seekers/me";
    actions.push(
      accountApi<Response<Record<string, unknown>>>(profilePath).then((r) => {
        const account: Record<string, string> = {};
        for (const [key, value] of Object.entries(r.data))
          if (typeof value === "string") account[key] = value;
        result.account = account;
      }),
    );
  }
  if (!section) {
    actions.push(
      accountApi<Response<Partial<WorkspaceSnapshot>>>(
        "platform/overview",
      ).then((r) => Object.assign(result, r.data)),
    );
  } else if (
    [
      "my-profile",
      "settings",
      "account-settings",
      "profile-preview",
      "care-services",
      "availability",
      "find-care-jobs",
    ].includes(section) &&
    caregiver
  ) {
    const scope =
      section === "care-services"
        ? "services"
        : section === "availability"
          ? "availability"
          : section === "find-care-jobs"
            ? "job-preferences"
            : "profile";
    actions.push(
      accountApi<Response<WorkspaceSnapshot["professional"]>>(
        "platform/professional?section=" + scope,
      ).then((r) => {
        result.professional = r.data;
      }),
    );
    if (section === "find-care-jobs") {
      actions.push(list("requests", "platform/requests", true));
    }
    if (section === "profile-preview")
      actions.push(list("reviews", "platform/reviews"));
  } else if (["care-requirements", "my-requests"].includes(section)) {
    if (section === "care-requirements" && segment[2] === "create") {
      /* Form needs only account/access. */
    } else {
      const id = segment[2];
      actions.push(
        list(
          "requests",
          `platform/requests${id ? "?id=" + encodeURIComponent(id) : ""}`,
          !id,
        ),
      );
      if (section === "my-requests" && id)
        actions.push(
          list(
            "applications",
            `platform/applications?requestId=${encodeURIComponent(id)}`,
            true,
          ),
        );
    }
  } else if (section === "find-caregivers") {
    actions.push(
      list("caregivers", "platform/caregivers", true).then(() => {
        result.saved = (result.caregivers ?? [])
          .filter((c) => c.saved)
          .map((c) => ({ caregiverId: c.id }));
      }),
    );
  } else if (section === "saved-caregivers") {
    actions.push(
      accountApi<
        Response<
          (WorkspaceSnapshot["saved"][number] & { caregiver: LiveCaregiver })[]
        >
      >(`platform/saved?page=${page}&limit=25`).then((r) => {
        result.saved = r.data.map((s) => ({ caregiverId: s.caregiverId }));
        result.caregivers = r.data.map((s) => s.caregiver);
        pagination = r.pagination ?? null;
      }),
    );
  } else if (section === "care-arrangements") {
    actions.push(
      list("applications", "platform/applications?status=ACCEPTED", true),
    );
  } else if (section === "my-applications") {
    actions.push(list("applications", "platform/applications", true));
  } else if (section === "messages") {
    actions.push(list("messages", "platform/messages", true));
  } else if (section === "reviews-ratings") {
    actions.push(list("reviews", "platform/reviews", true));
    if (!caregiver)
      actions.push(
        accountApi<Response<WorkspaceSnapshot["reviewCandidates"]>>(
          "platform/reviews/candidates",
        ).then((r) => {
          result.reviewCandidates = r.data;
        }),
      );
  } else if (section === "verification") {
    actions.push(list("verifications", "platform/verifications", true));
  } else if (section === "membership") {
    actions.push(
      accountApi<
        Response<{
          membership: WorkspaceSnapshot["membership"];
          plan: import("@/config/pricing").PricingPlan;
        }>
      >("platform/membership").then((r) => {
        if (r.data.membership)
          result.membership = { ...r.data.membership, plan: r.data.plan };
      }),
    );
  } else if (section === "package-tools") {
    actions.push(list("reviews", "platform/reviews?received=true", true));
  } else if (section === "organisation") {
    actions.push(
      accountApi<Response<WorkspaceSnapshot["organisation"]>>(
        "platform/organisation",
      ).then((r) => {
        result.organisation = r.data;
      }),
    );
  }
  await Promise.all(actions);
  if (result.applications)
    result.saved = result.applications.flatMap((a) =>
      a.caregiver?.saved ? [{ caregiverId: a.caregiverId }] : [],
    );
  return { snapshot: result, pagination };
}
