import { ApiError } from '../../utils/ApiError.js';
import { publicCaregiver } from '../caregivers/directory-policy.js';
import * as repository from './dashboard.repository.js';
export async function getOverview(userId: string, role: string) {
  if (role === 'CARE_SEEKER') {
    const { requestActivity, messageActivity, applicationActivity, ...page } =
      await repository.seekerOverview(userId);
    const activity = [
      ...requestActivity.map((r) => ({
        id: r.id,
        text: 'You posted ' + r.title,
        time: r.createdAt,
      })),
      ...messageActivity.map((m) => ({
        id: m.id,
        text: m.sender.firstName + ' sent you a message',
        time: m.createdAt,
      })),
      ...applicationActivity.map((a) => ({
        id: a.id,
        text: a.caregiver.firstName + ' applied for ' + a.request.title,
        time: a.createdAt,
      })),
    ]
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 5);
    const visibleIds = new Set(page.caregivers.map((c) => c.id));
    return {
      ...page,
      caregivers: page.caregivers.map((c) => {
        const { savedBy, ...person } = c;
        void savedBy;
        return publicCaregiver(person);
      }),
      saved: page.saved.filter((s) => visibleIds.has(s.caregiverId)),
      activity,
    };
  }
  if (role === 'CAREGIVER') {
    const { professional, verifications, ...page } = await repository.caregiverOverview(userId);
    const d = professional?.details;
    const stored = d && typeof d === 'object' && !Array.isArray(d) ? d.profile : null;
    const p = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    const referencesCount = Array.isArray(p.references) ? p.references.length : 0;
    const profileCompletion =
      (p.photo ? 20 : 0) +
      (professional?.bio?.trim() ? 20 : 0) +
      (Array.isArray(p.experiences) && p.experiences.length ? 20 : 0) +
      ((Array.isArray(p.qualifications) && p.qualifications.length) ||
      professional?.qualifications.trim()
        ? 20
        : 0) +
      Math.min(referencesCount, 2) * 10;
    const verified = ['DBS', 'RIGHT_TO_WORK'].every((kind) =>
      verifications.some((v) => v.kind === kind && v.status === 'APPROVED'),
    );
    return { ...page, stats: { ...page.stats, profileCompletion, referencesCount, verified } };
  }
  throw new ApiError(403, 'Use the administrator overview');
}
