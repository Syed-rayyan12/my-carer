import type {
  AdminData,
  AdminUser,
  AdminUserStatus,
  AdminActivity,
} from "./adminData";
import type { AdminCaregiver } from "./caregivers/adminCaregiverData";
import type { AdminCareSeeker } from "./care-seekers/adminCareSeekerData";
import type { AdminCareJob } from "./care-jobs/careJobsData";
import type { AdminCareRequest } from "./care-requests/careRequestsData";
import type { AdminMessage } from "./messages/adminMessagesData";
import type { AdminReview } from "./reviews/adminReviewsData";
import type { VerificationRecord } from "./verification/verificationData";
import type { AdminSubscription } from "./subscriptions/subscriptionsData";
import { isCaregiverAvailability } from '@/components/caregiver-dashboard/preview/availabilityData';

type Person = { id: string; firstName: string; lastName: string; role: string };
type Professional = {
  details?: Record<string, unknown>;
  location: string;
  experience: string;
  hourlyRatePence: number;
  services: string;
  qualifications: string;
  availability: string;
};
type LiveUser = Person & {
  organisation?: {
    name: string;
    cqcReference: string;
    cqcRating: string | null;
    cqcVerifiedAt: string | null;
  } | null;
  email: string;
  status: "PENDING" | "ACTIVE" | "REJECTED" | "SUSPENDED";
  createdAt: string;
  profile: { phone: string; location: string } | null;
  professional: Professional | null;
  membership: {
    billingInterval?: string;
    trialEndsAt?: string | null;
    planId: string;
    pricePence: number;
    plan?: { title: string };
    status: string;
    paidThrough: string | null;
    paymentReference: string | null;
    updatedAt: string;
  } | null;
  verifications: { status: string; kind: string; createdAt: string }[];
};
export type LiveRequest = {
  _count?: { applications: number };
  id: string;
  ownerId: string;
  owner: Person;
  title: string;
  tasks: string;
  fundingType: string;
  description: string;
  schedule: string;
  location: string;
  budgetPence: number;
  status: string;
  createdAt: string;
  applications: {
    id: string;
    caregiverId: string;
    caregiver: Person;
    status: string;
    createdAt: string;
  }[];
};
type LiveMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  sender: Person;
  recipient: Person;
  body: string;
  createdAt: string;
};
export type AdminSnapshot = {
  activity?: {
    id: string;
    kind: AdminActivity["kind"];
    text: string;
    time: string;
  }[];
  notifications?: { id: string; title: string; time: string; href: string }[];
  users: LiveUser[];
  requests: LiveRequest[];
  messages: LiveMessage[];
  reviews: {
    id: string;
    author: Person;
    caregiver: Person;
    rating: number;
    body: string;
    disputeReason?: string | null;
    visible: boolean;
    createdAt: string;
  }[];
  verifications: {
    upload?: { id: string; name: string; type: string } | null;
    id: string;
    user: Person & { professional: { location: string } | null };
    kind: string;
    reference: string;
    status: string;
    reason: string | null;
    createdAt: string;
  }[];
  history: { id: string; user: Person; toStatus: string; createdAt: string }[];
  counts: {
    caregivers: number;
    seekers: number;
    openRequests: number;
    pendingVerifications: number;
  };
};
export const emptySnapshot: AdminSnapshot = {
  users: [],
  requests: [],
  messages: [],
  reviews: [],
  verifications: [],
  history: [],
  counts: {
    caregivers: 0,
    seekers: 0,
    openRequests: 0,
    pendingVerifications: 0,
  },
};
const statuses: Record<LiveUser["status"], AdminUserStatus> = {
  PENDING: "Pending",
  ACTIVE: "Active",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};
export const fullName = (person: Person) =>
  `${person.firstName} ${person.lastName}`;
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
export const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
export const pounds = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    pence / 100,
  );
export function parseBudget(value: string) {
  const match =
    /^\s*£?\s*(\d+(?:\.\d{1,2})?)\s*(?:\/\s*(?:hour|hr))?\s*$/i.exec(value);
  if (!match) throw new Error("Use one hourly amount, for example £20 / hour.");
  return Math.round(Number(match[1]) * 100);
}
export function mapAdminData(snapshot: AdminSnapshot): AdminData {
  const users: AdminUser[] = snapshot.users.map((person) => ({
    id: person.id,
    name: fullName(person),
    initials: initials(fullName(person)),
    type: person.role === "CAREGIVER" ? "Caregiver" : "Care Seeker",
    email: person.email,
    status: statuses[person.status],
    date: dateLabel(person.createdAt),
    accountCategory: person.membership?.plan?.title ?? "",
    location: person.professional?.location || person.profile?.location || "",
  }));
  const caregivers: AdminCaregiver[] = snapshot.users
    .filter((person) => person.role === "CAREGIVER")
    .map((person) => ({
      ...users.find((user) => user.id === person.id)!,
      type: "Caregiver",
      avatarTone: "pink",
      verification: person.verifications.some(
        (item) => item.status === "APPROVED",
      )
        ? "Verified"
        : person.verifications.some((item) => item.status === "REJECTED")
          ? "Rejected"
          : "Pending",
      profile: {
        phone: person.profile?.phone ?? "",
        experience:
          Number.parseFloat(person.professional?.experience ?? "") || 0,
        hourlyRate: (person.professional?.hourlyRatePence ?? 0) / 100,
        availability: person.professional?.availability ?? "",
        availabilitySchedule: isCaregiverAvailability(person.professional?.details?.availability) ? person.professional.details.availability : undefined,
        careTypes:
          person.professional?.services.split(/[,\n]/).filter(Boolean) ?? [],
        qualifications:
          person.professional?.qualifications.split("\n").filter(Boolean) ?? [],
        verificationDate:
          person.verifications
            .find((item) => item.status === "APPROVED")
            ?.createdAt.slice(0, 10) ?? "",
      },
    }));
  const careSeekers: AdminCareSeeker[] = snapshot.users
    .filter((person) => person.role === "CARE_SEEKER")
    .map((person) => {
      const request = snapshot.requests.find(
        (item) => item.ownerId === person.id,
      );
      return {
        ...users.find((user) => user.id === person.id)!,
        type: "Care Seeker",
        phone: person.profile?.phone ?? "",
        joinedAt: person.createdAt.slice(0, 10),
        avatarTone: "pink",
        requirement: {
          description: request?.description ?? "",
          careType: request?.title ?? "",
          schedule: request?.schedule ?? "",
          budget: request ? `${pounds(request.budgetPence)} / hour` : "",
        },
        connections: snapshot.requests
          .filter((item) => item.ownerId === person.id)
          .flatMap((item) =>
            item.applications
              .filter((application) => application.status === "ACCEPTED")
              .map((application) => ({
                caregiverId: application.caregiverId,
                since: application.createdAt.slice(0, 10),
                status: "Active" as const,
              })),
          ),
      };
    });
  const events: (AdminActivity & { timestamp: string })[] = [
    ...snapshot.users.map((person) => ({
      id: `registration-${person.id}`,
      kind: "registration" as const,
      text: `${fullName(person)} registered as a ${person.role === "CAREGIVER" ? "caregiver" : "care seeker"}`,
      time: dateLabel(person.createdAt),
      timestamp: person.createdAt,
    })),
    ...snapshot.history.map((item) => ({
      id: item.id,
      kind: "profile" as const,
      text: `${fullName(item.user)} account ${item.toStatus.toLowerCase()}`,
      time: dateLabel(item.createdAt),
      timestamp: item.createdAt,
    })),
    ...snapshot.requests.map((item) => ({
      id: `request-${item.id}`,
      kind: "job" as const,
      text: `${fullName(item.owner)} posted ${item.title}`,
      time: dateLabel(item.createdAt),
      timestamp: item.createdAt,
    })),
    ...snapshot.reviews.map((item) => ({
      id: `review-${item.id}`,
      kind: "review" as const,
      text: `${fullName(item.author)} reviewed ${fullName(item.caregiver)}`,
      time: dateLabel(item.createdAt),
      timestamp: item.createdAt,
    })),
  ];
  return {
    users,
    caregivers,
    careSeekers,
    activity: snapshot.activity
      ? snapshot.activity.map((item) => ({
          ...item,
          time: dateLabel(item.time),
        }))
      : events
          .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
          .slice(0, 10),
  };
}
export function mapJobs(snapshot: AdminSnapshot): AdminCareJob[] {
  return snapshot.requests.map((item) => ({
    id: item.id,
    title: item.title,
    careType: item.tasks,
    date: dateLabel(item.createdAt),
    location: item.location,
    postedBy: fullName(item.owner),
    applicants: item._count?.applications ?? item.applications.length,
    status: item.status === "OPEN" ? "Active" : "Removed",
    payRate: `${pounds(item.budgetPence)} / hour`,
    schedule: item.schedule,
    description: item.description,
    requirements: item.tasks.split(/[,\n]/).filter(Boolean),
  }));
}
export function mapRequests(snapshot: AdminSnapshot): AdminCareRequest[] {
  return snapshot.requests.map((item) => ({
    id: item.id,
    name: fullName(item.owner),
    initials: initials(fullName(item.owner)),
    careType: item.title,
    location: item.location,
    date: dateLabel(item.createdAt),
    status: item.status === "OPEN" ? "Active" : "Removed",
    availability: item.schedule,
    budget: `${pounds(item.budgetPence)} / hour`,
    description: item.description,
    matches: [],
  }));
}
export function mapReviews(snapshot: AdminSnapshot): AdminReview[] {
  return snapshot.reviews.map((item) => ({
    id: item.id,
    name: fullName(item.author),
    caregiver: fullName(item.caregiver),
    title: `${item.rating}-star review`,
    message:
      item.body +
      (item.disputeReason
        ? "\n\nDispute submitted: " + item.disputeReason
        : ""),
    rating: item.rating,
    status: item.visible ? "Published" : "Hidden",
  }));
}
export function mapMessages(
  snapshot: AdminSnapshot,
  adminId: string,
): AdminMessage[] {
  const people = new Map<string, Person>();
  snapshot.messages.forEach((item) => {
    const person = item.senderId === adminId ? item.recipient : item.sender;
    people.set(person.id, person);
  });
  return [...people.values()].map((person) => {
    const thread = snapshot.messages
      .filter(
        (item) => item.senderId === person.id || item.recipientId === person.id,
      )
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const incoming = thread.filter((item) => item.senderId === person.id);
    return {
      id: person.id,
      name: fullName(person),
      initials: initials(fullName(person)),
      subject: "Account enquiry",
      message: incoming.map((item) => item.body).join("\n\n"),
      replies: thread
        .filter((item) => item.senderId === adminId)
        .map((item) => item.body),
      draft: "",
      status: thread.at(-1)?.senderId === adminId ? "Replied" : "New",
    };
  });
}
export function mapVerifications(
  snapshot: AdminSnapshot,
): VerificationRecord[] {
  return snapshot.verifications.map((item) => ({
    id: item.id,
    name: fullName(item.user),
    initials: initials(fullName(item.user)),
    location: item.user.professional?.location ?? "",
    document:
      item.kind === "DBS"
        ? "DBS Certificate"
        : item.kind === "IDENTITY"
          ? "ID Proof"
          : item.kind === "RIGHT_TO_WORK"
            ? "Right to Work"
            : "Qualification Certificate",
    submitted: dateLabel(item.createdAt),
    status:
      item.status === "APPROVED"
        ? "Approved"
        : item.status === "REJECTED"
          ? "Rejected"
          : "Pending",
    reason: item.reason ?? undefined,
    reference: item.upload?.name ?? item.reference,
    uploadId: item.upload?.id,
  }));
}
export function mapSubscriptions(snapshot: AdminSnapshot): AdminSubscription[] {
  return snapshot.users
    .filter((person) => person.membership)
    .map((person) => {
      const membership = person.membership!;
      const paid =
        !!membership.paidThrough &&
        new Date(membership.paidThrough) > new Date();
      return {
        id: person.id,
        transactionId:
          membership.paymentReference ?? "Awaiting payment verification",
        name: fullName(person),
        initials: initials(fullName(person)),
        role: person.role === "CAREGIVER" ? "Caregiver" : "Care Seeker",
        plan: `${membership.plan?.title ?? membership.planId}${membership.billingInterval === "annual" ? " (annual)" : ""}`,
        amountPence: membership.pricePence,
        status:
          membership.status === "CANCELLED"
            ? "Cancelled"
            : membership.status === "TRIAL" &&
                !!membership.trialEndsAt &&
                new Date(membership.trialEndsAt) > new Date()
              ? "Trial"
              : membership.pricePence === 0 ||
                  (membership.status === "ACTIVE" && paid)
                ? "Active"
                : "Pending",
        payment:
          membership.pricePence === 0
            ? "Free"
            : membership.status === "TRIAL"
              ? "Trial"
              : paid
                ? "Paid"
                : "Pending",
        date: dateLabel(membership.updatedAt),
        paidThrough: membership.paidThrough,
      };
    });
}
