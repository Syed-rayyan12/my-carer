import { initialAdminCaregivers, isAdminCaregiverList, type AdminCaregiver } from "./caregivers/adminCaregiverData";
import { initialAdminCareSeekers, isAdminCareSeekerList, type AdminCareSeeker } from "./care-seekers/adminCareSeekerData";

export type AdminUserStatus = "Pending" | "Active" | "Rejected" | "Suspended";
export type AdminUser = { id: string; name: string; initials: string; type: "Caregiver" | "Care Seeker"; date: string; email: string; location: string; status: AdminUserStatus; rejectionReason?: string };
export type AdminActivity = { id: string; kind: "registration" | "subscription" | "job" | "review" | "profile"; text: string; time: string };
export type AdminSection = "all-users" | "caregivers" | "care-seekers" | "verification" | "care-jobs" | "care-requests" | "messages" | "reviews" | "blog" | "subscriptions" | "settings";
export type AdminData = { users: AdminUser[]; activity: AdminActivity[]; caregivers?: AdminCaregiver[]; careSeekers?: AdminCareSeeker[] };

export const initialAdminData: AdminData = {
  caregivers: initialAdminCaregivers,
  careSeekers: initialAdminCareSeekers,
  users: [
    { id: "sarah-smith", name: "Sarah Smith", initials: "SS", type: "Caregiver", date: "2 Sep", email: "sarah.smith@example.com", location: "Manchester", status: "Pending" },
    { id: "john-brown", name: "John Brown", initials: "JB", type: "Care Seeker", date: "3 Sep", email: "john.brown@example.com", location: "London", status: "Active" },
    { id: "sarah-mitchell", name: "Sarah Mitchell", initials: "SM", type: "Caregiver", date: "3 Sep", email: "sarah.mitchell@example.com", location: "Manchester", status: "Pending" },
    { id: "aisha-rahman", name: "Aisha Rahman", initials: "AR", type: "Care Seeker", date: "4 Sep", email: "aisha.rahman@example.com", location: "Birmingham", status: "Pending" },
    { id: "emily-clarke", name: "Emily Clarke", initials: "EC", type: "Caregiver", date: "4 Sep", email: "emily.clarke@example.com", location: "Manchester", status: "Pending" },
  ],
  activity: [
    { id: "activity-emily", kind: "registration", text: "Emily Clarke registered as a caregiver", time: "12 min ago" },
    { id: "activity-helen", kind: "subscription", text: "Helen Carter purchased the Premium plan", time: "48 min ago" },
    { id: "activity-job", kind: "job", text: "John Brown posted “Dementia Caregiver Required”", time: "2 hrs ago" },
    { id: "activity-review", kind: "review", text: "John Smith left a 5★ review for Daniel Hughes", time: "3 hrs ago" },
    { id: "activity-grace", kind: "profile", text: "Grace Okafor updated her availability", time: "5 hrs ago" },
  ],
};

export const adminSectionTitles: Record<AdminSection, string> = {
  "all-users": "All Users", caregivers: "Caregivers", "care-seekers": "Care Seekers", verification: "Pending Verification",
  "care-jobs": "Care Jobs", "care-requests": "Care Requests", messages: "Messages", reviews: "Reviews", blog: "Blog", subscriptions: "Subscriptions", settings: "Admin Settings",
};

export const adminSectionPreviews: Partial<Record<AdminSection, { title: string; detail: string }[]>> = {
  "care-jobs": [{ title: "Dementia Caregiver Required", detail: "Manchester · Active · Posted by John Brown" }, { title: "Weekend Respite Care", detail: "Manchester · Active · Weekend support" }],
  "care-requests": [{ title: "Dementia Care for Mum", detail: "Manchester · 4 caregiver responses" }, { title: "Companionship Support", detail: "London · Awaiting responses" }],
  messages: [{ title: "Verification enquiry", detail: "Sarah Smith · Documents ready for review" }, { title: "Care requirement support", detail: "John Brown · Question about an active care requirement" }],
  reviews: [{ title: "John Smith → Daniel Hughes", detail: "5 stars · Professional, caring and reliable." }, { title: "Emma Wilson → Sarah Mitchell", detail: "4 stars · Very helpful and punctual." }],
  blog: [{ title: "Finding the right caregiver", detail: "Care advice · Example article" }, { title: "Understanding dementia care", detail: "Care guidance · Example article" }],
  subscriptions: [{ title: "Monthly Revenue", detail: "£12,450 · +8% vs August" }, { title: "Premium plan", detail: "Helen Carter · Recent subscription purchase" }],
  settings: [{ title: "Admin workspace", detail: "Local preview data is stored separately from care seeker dashboard data." }, { title: "Account access", detail: "Authentication and live administration services are not connected in this preview." }],
};

export function filterAdminUsers(users: AdminUser[], search: string, section?: AdminSection) {
  const query = search.trim().toLowerCase();
  return users.filter(user => (!query || `${user.name} ${user.type} ${user.email} ${user.status}`.toLowerCase().includes(query)) && (section !== "caregivers" || user.type === "Caregiver") && (section !== "care-seekers" || user.type === "Care Seeker") && (section !== "verification" || user.type === "Caregiver" && user.status === "Pending"));
}

export function isAdminData(value: unknown): value is AdminData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (data.careSeekers !== undefined && !isAdminCareSeekerList(data.careSeekers)) return false;
  if (data.caregivers !== undefined && !isAdminCaregiverList(data.caregivers)) return false;
  return Array.isArray(data.users) && data.users.every(user => user && ["id", "name", "initials", "date", "email", "location"].every(key => typeof user[key] === "string") && ["Caregiver", "Care Seeker"].includes(user.type) && ["Pending", "Active", "Rejected", "Suspended"].includes(user.status) && (user.rejectionReason === undefined || typeof user.rejectionReason === "string")) && Array.isArray(data.activity) && data.activity.every(item => item && typeof item.id === "string" && typeof item.text === "string" && typeof item.time === "string" && ["registration", "subscription", "job", "review", "profile"].includes(item.kind));
}
