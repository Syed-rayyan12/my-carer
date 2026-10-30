import { demoCaregiverProfile, type CaregiverProfile } from "@/components/website/CaregiverProfileModal";
import { formatCaregiverRate, type DirectoryCaregiver } from "./caregiverDirectoryData";

export function directoryCaregiverProfile(caregiver: DirectoryCaregiver): CaregiverProfile {
  const isSarah = caregiver.id === "sarah-mitchell";
  return {
    ...demoCaregiverProfile,
    name: caregiver.name,
    desc: caregiver.specialty,
    image: caregiver.image,
    location: `${caregiver.location}, UK`,
    hourlyRate: `£${formatCaregiverRate(caregiver.hourlyRate)}`,
    rating: caregiver.rating,
    reviewCount: caregiver.reviews,
    experience: `${caregiver.experience} years`,
    availability: caregiver.availability,
    specializations: caregiver.careTypes,
    about: caregiver.about,
    email: `${caregiver.id}@example.com`,
    phone: isSarah ? demoCaregiverProfile.phone : "",
    qualifications: isSarah ? demoCaregiverProfile.qualifications : [],
    references: isSarah ? demoCaregiverProfile.references : [],
    verification: isSarah ? demoCaregiverProfile.verification : { certificateNumber: `DEMO-${caregiver.initials}`, lastChecked: "Sample profile", expires: "Sample profile" },
  };
}
