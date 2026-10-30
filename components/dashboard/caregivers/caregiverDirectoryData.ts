export type DirectoryCaregiver = {
  id: string;
  name: string;
  specialty: string;
  image: string;
  initials: string;
  location: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  careTypes: string[];
  experience: number;
  verified: boolean;
  availability: string[];
  about: string;
};

export type CaregiverFilters = {
  careTypes: string[];
  experience: string;
  maxRate: number;
  verifiedOnly: boolean;
  minRating: number;
  availability: string[];
};

export const defaultCaregiverFilters: CaregiverFilters = {
  careTypes: [], experience: "", maxRate: 30, verifiedOnly: false, minRating: 0, availability: [],
};

export const directoryCaregivers: DirectoryCaregiver[] = [
  { id: "sarah-mitchell", name: "Sarah Mitchell", specialty: "Elderly Care Specialist", image: "/images/image-cute.png", initials: "SM", location: "Manchester", hourlyRate: 18.5, rating: 4.9, reviews: 45, careTypes: ["Dementia Care", "Personal Care", "Companionship"], experience: 9, verified: true, availability: ["Weekdays", "Weekends"], about: "I provide patient, compassionate support for older adults, including dementia care, personal care and everyday companionship. My aim is to help every person feel safe, comfortable and independent at home." },
  { id: "james-wilson", name: "James Wilson", specialty: "Experienced Care Professional", image: "/images/image-cute-2.png", initials: "JW", location: "Manchester", hourlyRate: 17, rating: 4.8, reviews: 32, careTypes: ["Elderly Care", "Mobility Support", "Respite Care"], experience: 7, verified: true, availability: ["Weekdays", "Evenings"], about: "I support older adults with daily routines, mobility and respite care. I bring a calm, reliable approach and work with families to understand the support that matters most." },
  { id: "amira-khan", name: "Amira Khan", specialty: "Dementia & Companionship Carer", image: "/images/image-cute-3.png", initials: "AK", location: "Salford", hourlyRate: 19, rating: 4.9, reviews: 41, careTypes: ["Dementia Care", "Companionship", "Personal Care"], experience: 8, verified: true, availability: ["Weekdays", "Weekends", "Evenings"], about: "I offer thoughtful dementia support, companionship and personal care. I enjoy getting to know each person and creating a consistent routine that helps them feel at ease." },
  { id: "david-okafor", name: "David Okafor", specialty: "Senior Care Professional", image: "/images/image 2 (7).png", initials: "DO", location: "Stockport", hourlyRate: 21, rating: 4.7, reviews: 28, careTypes: ["Live-in Care", "Disability Care", "Respite Care"], experience: 12, verified: true, availability: ["Weekdays", "Weekends", "Overnight"], about: "I have extensive experience with live-in care, disability support and respite arrangements. I focus on respectful, practical care that supports the whole family." },
  { id: "emily-clarke", name: "Emily Clarke", specialty: "Professional Caregiver", image: "/images/image 2 (6).png", initials: "EC", location: "Manchester", hourlyRate: 16.5, rating: 4.8, reviews: 36, careTypes: ["Companionship", "Elderly Care", "Personal Care"], experience: 5, verified: true, availability: ["Weekdays", "Evenings"], about: "I help with personal care, daily activities and companionship. I am committed to making everyday life more comfortable and enjoyable for the people I support." },
  { id: "priya-patel", name: "Priya Patel", specialty: "Registered Nurse & Carer", image: "", initials: "PP", location: "Manchester", hourlyRate: 26, rating: 5, reviews: 54, careTypes: ["Personal Care", "Dementia Care", "Live-in Care"], experience: 11, verified: true, availability: ["Weekdays", "Weekends", "Overnight"], about: "I combine nursing experience with compassionate personal care. I support families who need dementia care, live-in assistance and dependable daily support." },
  { id: "michael-oconnor", name: "Michael O’Connor", specialty: "Personal Care & Companionship", image: "/images/image 2 (8).png", initials: "MO", location: "Manchester", hourlyRate: 16, rating: 4.9, reviews: 38, careTypes: ["Companionship", "Elderly Care", "Respite Care"], experience: 6, verified: true, availability: ["Weekends", "Evenings", "Overnight"], about: "I offer friendly companionship and reliable care for older adults. I help with everyday routines and provide families with flexible respite support." },
];

export const filterCareTypes = ["Elderly Care", "Dementia Care", "Personal Care", "Disability Care", "Companionship", "Respite Care", "Live-in Care"];
export const additionalSavedCaregivers: DirectoryCaregiver[] = [
  { id: "grace-bennett", name: "Grace Bennett", specialty: "Live-in Care Specialist", image: "", initials: "GB", location: "Manchester", hourlyRate: 24, rating: 4.9, reviews: 46, careTypes: ["Live-in Care", "Elderly Care", "Dementia Care"], experience: 10, verified: true, availability: ["Weekdays", "Weekends", "Overnight"], about: "I offer patient, consistent live-in care for older adults and people living with dementia. I work closely with each family to build a comfortable daily routine." },
  { id: "mohammed-ali", name: "Mohammed Ali", specialty: "Personal Care Assistant", image: "", initials: "MA", location: "Oldham", hourlyRate: 16, rating: 4.7, reviews: 29, careTypes: ["Personal Care", "Mobility Support", "Elderly Care"], experience: 6, verified: true, availability: ["Weekdays", "Weekends", "Evenings"], about: "I provide friendly, practical support with personal care, mobility and everyday routines. I focus on helping people stay independent and feel confident at home." },
];

export const allDashboardCaregivers = [...directoryCaregivers, ...additionalSavedCaregivers];
export const defaultSavedCaregiverNames = [...directoryCaregivers.slice(0, 6), ...additionalSavedCaregivers].map(caregiver => caregiver.name);

export const filterAvailability = ["Weekdays", "Weekends", "Evenings", "Overnight"];

export function filterCaregivers(caregivers: DirectoryCaregiver[], query: string, filters: CaregiverFilters) {
  const search = query.trim().toLowerCase();
  return caregivers.filter(person => {
    const matchesSearch = !search || `${person.name} ${person.specialty} ${person.location}`.toLowerCase().includes(search);
    const matchesType = filters.careTypes.length === 0 || filters.careTypes.some(type => person.careTypes.includes(type));
    const matchesExperience = !filters.experience || person.experience >= Number(filters.experience);
    const matchesRate = person.hourlyRate <= filters.maxRate;
    const matchesVerification = !filters.verifiedOnly || person.verified;
    const matchesRating = person.rating >= filters.minRating;
    const matchesAvailability = filters.availability.length === 0 || filters.availability.some(time => person.availability.includes(time));
    return matchesSearch && matchesType && matchesExperience && matchesRate && matchesVerification && matchesRating && matchesAvailability;
  });
}

export function formatCaregiverRate(rate: number) {
  return Number.isInteger(rate) ? String(rate) : rate.toFixed(2);
}
