export type CaregiverCareService = { id: string; name: string; description: string; experience: number; preferredClients: string; additionalInformation: string; reference: string; shown: boolean };
export const careServiceCatalog = [
  { id: "elderly-care", name: "Elderly Care", description: "Day-to-day support for older adults at home." },
  { id: "dementia-care", name: "Dementia Care", description: "Patient, routine-based care for people living with dementia." },
  { id: "personal-care", name: "Personal Care", description: "Washing, dressing, toileting and grooming with dignity." },
  { id: "companionship", name: "Companionship", description: "Conversation, outings and social connection." },
  { id: "disability-care", name: "Disability Care", description: "Support for adults with physical or learning disabilities." },
  { id: "respite-care", name: "Respite Care", description: "Short-term cover so family carers can rest." },
  { id: "mobility-support", name: "Mobility Support", description: "Safe transfers, walking support and exercises." },
  { id: "live-in-care", name: "Live-in Care", description: "Consistent care and companionship in the client's home." },
  { id: "post-surgery-care", name: "Post-surgery Care", description: "Practical help and personal care during recovery at home." },
  { id: "overnight-care", name: "Overnight Care", description: "Reassuring support with care needs through the night." },
];
export const initialCaregiverServices: CaregiverCareService[] = careServiceCatalog.slice(0, 7).map((service, index) => ({ ...service, experience: [5, 5, 5, 4, 1, 3, 4][index], preferredClients: "", additionalInformation: "", reference: "", shown: service.id !== "disability-care" }));
export function isCaregiverServices(value: unknown): value is CaregiverCareService[] { return Array.isArray(value) && new Set(value.map(item => item?.id)).size === value.length && new Set(value.map(item => item?.name)).size === value.length && value.every(item => item && typeof item === "object" && ["id", "name", "description", "preferredClients", "additionalInformation", "reference"].every(key => typeof item[key] === "string") && careServiceCatalog.some(service => service.id === item.id && service.name === item.name) && Number.isInteger(item.experience) && item.experience >= 0 && item.experience <= 80 && typeof item.shown === "boolean"); }
export function saveCareService(services: CaregiverCareService[], service: CaregiverCareService) { if (!isCaregiverServices([service])) return services; return services.some(item => item.id === service.id) ? services.map(item => item.id === service.id ? service : item) : [...services, service]; }
export function toggleCareService(services: CaregiverCareService[], id: string) { return services.map(service => service.id === id ? { ...service, shown: !service.shown } : service); }
export function removeCareService(services: CaregiverCareService[], id: string) { return services.filter(service => service.id !== id); }
