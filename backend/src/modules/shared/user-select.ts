export const identity = { id: true, firstName: true, lastName: true, role: true } as const;
export const publicProfessional = {
  bio: true,
  location: true,
  qualifications: true,
  experience: true,
  hourlyRatePence: true,
  travelRadiusMiles: true,
  services: true,
  availability: true,
} as const;
