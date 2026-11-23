import type { Entitlements } from '../membership/plan-policy.js';
const object = (value: unknown): Record<string, unknown> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
const list = (value: unknown) => Array.isArray(value) ? value.map(object) : [];
const text = (value: unknown) => typeof value === 'string' ? value : '';
export function profilePhoto(details: unknown) {
  const photo = text(object(object(details).profile).photo);
  return /^\/api\/platform\/profile-photos\/[a-f0-9-]{36}$/.test(photo) ? photo : '';
}
// Explicit public projection: never return raw profile JSON, certificate URLs,
// personal contact/address/DOB, referee contacts or time-off reasons.
export function publicProfileDetails(value: unknown, entitlements: Entitlements, services: string) {
  const details = object(value); const profile = object(details.profile);
  const enabled = entitlements.bio === true;
  const availability = object(details.availability);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const validTime = (v: unknown) => /^([01]\d|2[0-3]):[0-5]\d$/.test(text(v));
  const weekly = Array.isArray(availability.weekly) ? list(availability.weekly)
    : (Array.isArray(availability.days) ? availability.days : []).map(day => ({ day, slots: [{ start: availability.start, end: availability.end }] }));
  const allowedServices = new Set(services.split(/[,\n]/).map(s => s.trim()));
  return {
    gender: enabled ? text(object(profile.personal).gender) : '',
    mileageRate: enabled && typeof profile.mileageRate === 'number' ? profile.mileageRate : null,
    workHistory: enabled ? list(profile.experiences).map(row => ({ title: text(row.title), employer: text(row.employer), start: text(row.start), end: text(row.end), current: row.current === true, responsibilities: text(row.responsibilities) })) : [],
    qualifications: entitlements.qualifications === true ? list(profile.qualifications).map(row => ({ title: text(row.name), provider: text(row.institution), date: text(row.year) })) : [],
    references: enabled ? list(profile.references).map(row => ({ name: text(row.name), role: text(row.relationship) })) : [],
    services: list(details.services).filter(row => row.shown === true && allowedServices.has(text(row.name))).map(row => ({ name: text(row.name), description: text(row.description), experience: typeof row.experience === 'number' ? row.experience : 0, preferredClients: text(row.preferredClients), additionalInformation: text(row.additionalInformation) })),
    schedule: entitlements.availability === true ? weekly.filter(row => days.includes(text(row.day))).map(row => ({ day: text(row.day), slots: list(row.slots).filter(slot => validTime(slot.start) && validTime(slot.end)).map(slot => ({ start: text(slot.start), end: text(slot.end) })) })) : [],
    minimumVisitMinutes: entitlements.availability === true && typeof availability.minimumVisitMinutes === 'number' ? availability.minimumVisitMinutes : null,
    timeOff: entitlements.availability === true ? list(details.timeOff).map(row => ({ start: text(row.start), end: text(row.end) })) : [],
  };
}
