export type PublicCaregiverProfile = {
  id: string; firstName: string; lastName: string; photo: string;
  professional: { bio: string; location: string; hourlyRatePence: number; travelRadiusMiles: number; experience: string; services: string; qualifications: string; availability: string } | null;
  verifications: { kind: string }[];
  reviewsReceived: { rating: number; body: string; response: string | null; createdAt: string }[];
  profileDetails: {
    gender: string; mileageRate: number | null;
    workHistory: { title: string; employer: string; start: string; end: string; current: boolean; responsibilities: string }[];
    qualifications: { title: string; provider: string; date: string }[];
    references: { name: string; role: string }[];
    services: { name: string; description: string; experience: number; preferredClients: string; additionalInformation: string }[];
    schedule: { day: string; slots: { start: string; end: string }[] }[];
    minimumVisitMinutes: number | null;
    timeOff: { start: string; end: string }[];
  };
};
