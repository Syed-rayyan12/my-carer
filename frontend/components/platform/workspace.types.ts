export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
};
export type Professional = {
  bio: string;
  location: string;
  qualifications: string;
  experience: string;
  hourlyRatePence: number;
  travelRadiusMiles: number;
  services: string;
  availability: string;
  references?: string;
  details?: Record<string, unknown>;
};
export type LiveCaregiver = Person & {
  photo?: string;
  saved?: boolean;
  professional: Professional | null;
  verifications: { kind: string }[];
  reviewsReceived: { rating: number }[];
};
export type LiveRequest = {
  applied?: boolean;
  id: string;
  ownerId: string;
  owner: Person;
  title: string;
  description: string;
  location: string;
  budgetPence: number;
  fundingType: string;
  tasks: string;
  schedule: string;
  status: string;
  createdAt: string;
  details: Record<string, unknown>;
  _count?: { applications: number };
};
export type LiveApplication = {
  id: string;
  caregiverId: string;
  caregiver?: LiveCaregiver;
  requestId: string;
  request: LiveRequest;
  coverLetter: string;
  status: string;
  createdAt: string;
  details: {
    hourlyRatePence?: number;
    availability?: string;
    shortlisted?: boolean;
  };
};
export type LiveMessage = {
  id: string;
  senderId: string;
  recipientId: string;
  sender: Person;
  recipient: Person;
  body: string;
  createdAt: string;
};
export type LiveReview = {
  response?: string | null;
  respondedAt?: string | null;
  id: string;
  author: Person;
  caregiver: Person;
  rating: number;
  body: string;
  visible: boolean;
  createdAt: string;
};
export type WorkspaceSnapshot = {
  reviewCandidates?: Person[];
  notifications?: {
    id: string;
    title: string;
    kind: "message" | "verified" | "registration";
    time: string;
    href: string;
  }[];
  stats?: {
    profileCompletion?: number;
    referencesCount?: number;
    verified?: boolean;
    openRequests?: number;
    savedCount?: number;
    messageCount?: number;
    arrangements?: number;
    jobCount?: number;
    applicationCount?: number;
    pendingApplications?: number;
    conversationCount?: number;
  };
  activity?: { id: string; text: string; time: string }[];
  account: Record<string, string>;
  professional: Professional | null;
  membership: {
    status: string;
    paidThrough: string | null;
    planId: string;
    pricePence: number;
    billingInterval: "monthly" | "annual";
    trialStartedAt: string | null;
    trialEndsAt: string | null;
    plan?: Pick<
      import("@/config/pricing").PricingPlan,
      "id" | "title" | "category"
    > &
      Partial<import("@/config/pricing").PricingPlan>;
  } | null;
  access: {
    active: boolean;
    trial: boolean;
    entitlements: Record<string, boolean | number | null>;
  };
  organisation: OrganisationProfile | null;
  requests: LiveRequest[];
  applications: LiveApplication[];
  messages: LiveMessage[];
  caregivers: LiveCaregiver[];
  saved: { caregiverId: string }[];
  reviews: LiveReview[];
  verifications: {
    upload?: { id: string; name: string; type: string } | null;
    id: string;
    kind: string;
    reference: string;
    status: string;
    reason: string | null;
    createdAt: string;
  }[];
};

export type OrganisationProfile = {
  updatedAt?: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  postcode: string;
  phone: string;
  website: string;
  coverage: string;
  services: string;
  feeRange: string;
  gallery: string[];
  team: string;
  virtualTour: string;
  branches: { name: string; address: string }[];
  cqcReference: string;
  cqcRating: string | null;
  cqcVerifiedAt: string | null;
};
