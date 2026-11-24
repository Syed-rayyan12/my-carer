"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useLiveWorkspace,
  personName,
  dateLabel,
  type Professional,
  type Person,
} from "@/components/platform/LiveWorkspace";
import {
  type CaregiverProfile,
  isCaregiverProfile,
} from "./profile/caregiverProfileData";
import { type CaregiverApplication } from "./caregiverDashboardData";
import {
  type CaregiverAvailability,
  isCaregiverAvailability,
  availabilitySummary,
} from "./preview/availabilityData";
import {
  type CaregiverCareService,
  careServiceCatalog,
  isCaregiverServices,
} from "./services/careServicesData";
import type { CaregiverTimeOff } from "./availability/timeOffData";
import type { CaregiverConversation } from "./messages/caregiverMessagesData";
import type { CaregiverVerificationDocument } from "./verification/verificationData";
import type { CaregiverNotification } from "./notifications/notificationsData";
const emptyProfessional: Professional = {
  bio: "",
  location: "",
  qualifications: "",
  experience: "",
  hourlyRatePence: 0,
  travelRadiusMiles: 0,
  services: "",
  availability: "",
  references: "",
  details: {},
};
function useCaregiverState() {
  const live = useLiveWorkspace();
  const { snapshot } = live;
  const p = { ...emptyProfessional, ...snapshot.professional };
  const details = p.details ?? {};
  const [pendingContacts, setPendingContacts] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);
  const [removedNotifications, setRemovedNotifications] = useState<string[]>(
    [],
  );
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenu(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  const profile = useMemo<CaregiverProfile>(() => {
    const a = snapshot.account;
    const old = isCaregiverProfile(details.profile) ? details.profile : null;
    return {
      personal: {
        firstName: a.firstName ?? live.user.firstName,
        lastName: a.lastName ?? live.user.lastName,
        email: a.email ?? live.user.email,
        phone: a.phone ?? "",
        dob: a.dateOfBirth ?? "",
        gender: old?.personal.gender ?? "",
        address: a.address ?? "",
        city: p.location || a.location || "",
        postcode: a.postcode ?? "",
      },
      photo: old?.photo ?? "",
      about: p.bio,
      yearsExperience:
        old?.yearsExperience ?? (Number.parseFloat(p.experience) || 0),
      experiences: old?.experiences ?? [],
      qualifications:
        old?.qualifications ??
        p.qualifications
          .split("\n")
          .filter(Boolean)
          .map((name, index) => ({
            id: `qualification-${index}`,
            name,
            institution: "",
            year: "",
            fileName: "",
          })),
      references: old?.references ?? [],
      hourlyRate: p.hourlyRatePence / 100,
      mileageRate: old?.mileageRate,
    };
  }, [
    snapshot,
    live.user.firstName,
    live.user.lastName,
    live.user.email,
    details.profile,
    p.bio,
    p.experience,
    p.hourlyRatePence,
    p.location,
    p.qualifications,
  ]);
  const services: CaregiverCareService[] = isCaregiverServices(details.services)
    ? details.services
    : p.services
        .split(/[,\n]/)
        .filter(Boolean)
        .map((name, index) => {
          const item = careServiceCatalog.find((s) => s.name === name.trim());
          return {
            id: item?.id ?? `custom-${index}`,
            name: name.trim(),
            description: item?.description ?? "",
            experience: 0,
            preferredClients: "",
            additionalInformation: "",
            reference: "",
            shown: true,
          };
        });
  const availability: CaregiverAvailability = isCaregiverAvailability(
    details.availability,
  )
    ? details.availability
    : { days: [], start: "09:00", end: "18:00", minimumVisitMinutes: 30 };
  const timeOff: CaregiverTimeOff[] = Array.isArray(details.timeOff)
    ? (details.timeOff as CaregiverTimeOff[])
    : [];
  const savedJobs: string[] = Array.isArray(details.savedJobs)
    ? details.savedJobs.filter((id): id is string => typeof id === "string")
    : [];
  const saveProfessional = (
    change: Partial<Professional>,
    detailChange: Record<string, unknown> = {},
  ) =>
    live.mutate("platform/professional", {
      ...change,
      ...(Object.keys(detailChange).length ? { details: detailChange } : {}),
    });
  const updateProfile = async (
    update: (value: CaregiverProfile) => CaregiverProfile,
  ) => {
    const value = update(profile);
    const a = snapshot.account;
    const personal = value.personal;
    return live.mutate("platform/profile", {
      firstName: personal.firstName,
      lastName: personal.lastName,
      email: personal.email,
      phone: personal.phone,
      dateOfBirth: personal.dob,
      location: personal.city,
      address: personal.address,
      postcode: personal.postcode,
      about: a.about ?? "",
      emergencyName: a.emergencyName ?? "",
      relationship: a.relationship ?? "",
      emergencyPhone: a.emergencyPhone ?? "",
      language: a.language || "English (UK)",
      professional: {
        ...p,
        references: value.references
          .map((r) => `${r.name} (${r.relationship})`)
          .join("\n"),
        bio: value.about,
        location: personal.city,
        hourlyRatePence: Math.round((value.hourlyRate ?? 0) * 100),
        experience: String(value.yearsExperience),
        qualifications: value.qualifications.map((q) => q.name).join("\n"),
        details: { ...details, profile: value },
      },
    });
  };
  const applications: CaregiverApplication[] = snapshot.applications.map(
    (item) => ({
      id: item.id,
      jobId: item.requestId,
      title: item.request.title,
      detailTitle: item.request.title,
      location: item.request.location,
      applied: dateLabel(item.createdAt),
      applicationDate: item.createdAt.slice(0, 10),
      careSeeker: personName(item.request.owner),
      status:
        item.status === "PENDING" && item.details?.shortlisted
          ? "Shortlisted"
          : ((
              {
                PENDING: "Pending",
                ACCEPTED: "Accepted",
                REJECTED: "Rejected",
                WITHDRAWN: "Withdrawn",
              } as const
            )[item.status as "PENDING"] ?? "Pending"),
      message: item.coverLetter,
      hourlyRate:
        (item.details?.hourlyRatePence ?? item.request.budgetPence) / 100,
      availability: item.details?.availability ?? item.request.schedule,
      local: false,
    }),
  );
  const jobs = snapshot.requests.map((item) => ({
    id: item.id,
    title: item.title,
    detailTitle: item.title,
    name: personName(item.owner),
    location: item.location,
    minimumRate: item.budgetPence / 100,
    maximumRate:
      typeof item.details?.budget === "string" &&
      /^\d+(?:\.\d+)?[–-]\d+(?:\.\d+)?$/.test(item.details.budget)
        ? Number(item.details.budget.split(/[–-]/)[1])
        : item.budgetPence / 100,
    schedule: item.schedule,
    hours:
      typeof item.details?.frequency === "string"
        ? item.details.frequency
        : "Flexible",
    jobType: "Care requirement",
    tags: item.tasks.split(/[,\n]/).filter(Boolean),
    posted: dateLabel(item.createdAt),
    description: item.description,
    responsibilities: item.tasks.split(/[,\n]/).filter(Boolean),
    mileage: 0,
    distance: 0,
  }));
  const addApplication = (application: CaregiverApplication) =>
    live.mutate(
      "platform/applications",
      {
        requestId: application.jobId,
        coverLetter: application.message,
        details: {
          hourlyRatePence: Math.round(application.hourlyRate * 100),
          availability: application.availability,
        },
      },
      "POST",
    );
  const conversations: CaregiverConversation[] = [
    ...new Map([
      ...snapshot.messages.map((m) => {
        const person = m.senderId === live.user.id ? m.recipient : m.sender;
        return [person.id, person] as const;
      }),
      ...pendingContacts.map((person) => [person.id, person] as const),
    ]).values(),
  ].map((person) => {
    const messages = snapshot.messages.filter(
      (m) => m.senderId === person.id || m.recipientId === person.id,
    );
    const latest = messages.at(-1);
    return {
      id: person.id,
      name: personName(person),
      initials: `${person.firstName[0]}${person.lastName[0]}`,
      subject: "Care enquiry",
      message: messages
        .filter((m) => m.senderId === person.id)
        .map((m) => m.body)
        .join("\n\n"),
      messages: messages.map(message => ({
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        sender: message.senderId === live.user.id ? 'you' : 'contact',
      })),
      status: latest?.senderId === live.user.id ? "Replied" : "New",
      replies: messages
        .filter((m) => m.senderId === live.user.id)
        .map((m) => m.body),
      draft: drafts[person.id] ?? "",
      time: latest ? dateLabel(latest.createdAt) : "Not sent",
      unread: false,
    };
  });
  const saveReply = async (id: string, reply: string) => {
    const saved = await live.mutate("platform/messages", { recipientId: id, body: reply }, "POST");
    if (saved) setDrafts(current => ({ ...current, [id]: '' }));
    return saved;
  };
  const updateConversation = (item: CaregiverConversation) => {
    if (item.status === "Archived") {
      live.setError("Archiving is not enabled.");
      return;
    }
    setDrafts((current) => ({ ...current, [item.id]: item.draft }));
  };
  const startConversation = (applicationId: string) => {
    const request = snapshot.applications.find(item => item.id === applicationId)?.request;
    if (request)
      setPendingContacts((current) =>
        current.some((p) => p.id === request.ownerId)
          ? current
          : [...current, request.owner],
      );
    return request?.ownerId ?? "";
  };
  const documents: CaregiverVerificationDocument[] = snapshot.verifications.map(
    (item) => ({
      id: item.id,
      type:
        item.kind === "DBS"
          ? "DBS Certificate"
          : item.kind === "RIGHT_TO_WORK"
            ? "Right to Work"
            : item.kind === "IDENTITY"
              ? "ID Proof"
              : "Qualification",
      status:
        item.status === "APPROVED"
          ? "Approved"
          : item.status === "REJECTED"
            ? "Rejected"
            : "Pending",
      uploaded: item.createdAt.slice(0, 10),
      expiry: "",
      fileName: item.reference,
      notes: "Submitted certificate reference",
      reason: item.reason ?? undefined,
    }),
  );
  const reviews = snapshot.reviews.map((item) => ({
    id: item.id,
    name: personName(item.author),
    initials: `${item.author.firstName[0]}${item.author.lastName[0]}`,
    image: "",
    duration: "",
    rating: item.rating,
    careType: "Care support",
    message: item.body,
    time: dateLabel(item.createdAt),
  }));
  const notifications: CaregiverNotification[] = (snapshot.notifications ?? [])
    .map((n) => ({
      id: n.id,
      title: n.title,
      category:
        n.kind === "verified"
          ? ("Verification" as const)
          : ("Messages" as const),
      kind:
        n.kind === "verified" ? ("verified" as const) : ("message" as const),
      time: dateLabel(n.time),
      unread: !readNotifications.includes(n.id),
      href: n.href,
    }))
    .filter((n) => !removedNotifications.includes(n.id));
  return {
    ...live,
    search,
    setSearch,
    mobileMenu,
    setMobileMenu,
    profile,
    updateProfile,
    applications,
    appliedJobIds: snapshot.requests.filter((r) => r.applied).map((r) => r.id),
    addApplication,
    jobs,
    reviews,
    availability,
    updateAvailability: (value: CaregiverAvailability) =>
      saveProfessional(
        { availability: availabilitySummary(value) },
        { availability: value },
      ),
    services,
    updateCareService: (service: CaregiverCareService) => {
      const next = services.some((s) => s.id === service.id)
        ? services.map((s) => (s.id === service.id ? service : s))
        : [...services, service];
      return saveProfessional(
        {
          services: next
            .filter((s) => s.shown)
            .map((s) => s.name)
            .join(", "),
        },
        { services: next },
      );
    },
    toggleService: (id: string) => {
      const next = services.map((s) =>
        s.id === id ? { ...s, shown: !s.shown } : s,
      );
      return saveProfessional(
        {
          services: next
            .filter((s) => s.shown)
            .map((s) => s.name)
            .join(", "),
        },
        { services: next },
      );
    },
    removeService: (id: string) => {
      const next = services.filter((s) => s.id !== id);
      return saveProfessional(
        {
          services: next
            .filter((s) => s.shown)
            .map((s) => s.name)
            .join(", "),
        },
        { services: next },
      );
    },
    timeOff,
    addTimeOff: (value: CaregiverTimeOff) =>
      saveProfessional({}, { timeOff: [...timeOff, value] }),
    removeTimeOff: (id: string) =>
      saveProfessional(
        {},
        { timeOff: timeOff.filter((item) => item.id !== id) },
      ),
    savedJobs,
    toggleSavedJob: (id: string) =>
      saveProfessional(
        {},
        {
          savedJobs: savedJobs.includes(id)
            ? savedJobs.filter((i) => i !== id)
            : [...savedJobs, id],
        },
      ),
    withdrawApplication: (id: string) =>
      live.mutate(`platform/applications/${id}`, { status: "WITHDRAWN" }),
    documents,
    updateVerificationDocument: (document: CaregiverVerificationDocument) =>
      live.mutate(
        "platform/verifications",
        {
          kind:
            document.type === "DBS Certificate"
              ? "DBS"
              : document.type === "Right to Work"
                ? "RIGHT_TO_WORK"
                : document.type === "ID Proof"
                  ? "IDENTITY"
                  : "QUALIFICATION",
          reference: document.fileName,
        },
        "POST",
      ),
    conversations,
    saveReply,
    updateConversation,
    startConversation,
    notifications,
    markNotificationRead: (id: string) =>
      setReadNotifications((current) => [...current, id]),
    markAllNotificationsRead: () =>
      setReadNotifications(notifications.map((item) => item.id)),
    removeNotification: (id: string) =>
      setRemovedNotifications((current) => [...current, id]),
    hibernating: false,
    hibernateReady: live.ready,
    setHibernating: (_value: boolean) => {
      void _value;
      live.setError("Account hibernation is not enabled.");
    },
    storageError: false,
  };
}
const Context = createContext<ReturnType<typeof useCaregiverState> | null>(
  null,
);
export function CaregiverDashboardProvider({
  children,
}: {
  children: ReactNode;
}) {
  const value = useCaregiverState();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useCaregiverDashboard() {
  const value = useContext(Context);
  if (!value) throw new Error("CaregiverDashboardProvider is required");
  return value;
}
