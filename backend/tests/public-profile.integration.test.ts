import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma, disconnectDatabase } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { newToken, hashToken } from '../src/modules/auth/auth.crypto.js';

const tag = randomUUID(); const planId = `profile-${tag.slice(0, 8)}`;
const photo = `/api/platform/profile-photos/${randomUUID()}`;
let id = ''; let cookie = '';
beforeAll(async () => {
  if (!new URL(env.DATABASE_URL).pathname.endsWith('/carer_auth_test')) throw new Error('Disposable database required');
  await prisma.pricingPlan.create({ data: { id: planId, title: 'QA Pro', subtitle: 'Disposable', category: 'CAREGIVER', defaultRole: 'CAREGIVER', pricePence: 1999, features: [], entitlements: { bio: true, qualifications: true, availability: true, specialismsLimit: null, dbs: true, rightToWork: true } } });
  const user = await prisma.user.create({ data: {
    email: `profile-${tag}@example.test`, firstName: 'Full', lastName: 'Profile', role: 'CAREGIVER', status: 'ACTIVE', passwordHash: 'unused-test-session',
    membership: { create: { planId, status: 'TRIAL', pricePence: 1999, trialEndsAt: new Date(Date.now() + 86400000) } },
    professional: { create: { bio: 'Saved introduction', location: 'York', experience: '8', hourlyRatePence: 2200, travelRadiusMiles: 15, qualifications: 'NVQ Level 3', services: 'Companionship', availability: 'Monday 09:00–17:00', details: {
      profile: { photo, personal: { gender: 'Female', email: 'private-contact', dob: 'private-dob', address: 'private-address' }, mileageRate: 0.45,
        experiences: [{ title: 'Senior carer', employer: 'Care team', start: '2020-01', end: '', current: true, responsibilities: 'Daily support' }],
        qualifications: [{ name: 'NVQ Level 3', institution: 'Test college', year: '2020', fileUrl: '/private-certificate', fileName: 'private-file' }],
        references: [{ name: 'Reference Name', relationship: 'Employer', email: 'private-ref-email', phone: 'private-ref-phone' }] },
      availability: { days: ['Monday'], start: '09:00', end: '17:00', minimumVisitMinutes: 60 },
      timeOff: [{ start: '2027-02-01', end: '2027-02-03', reason: 'private-time-off-reason' }],
      services: [{ name: 'Companionship', shown: true, description: 'Friendly visits', experience: 8, preferredClients: 'Adults', additionalInformation: 'Evenings by arrangement', reference: 'private-service-reference' }, { name: 'Hidden service', shown: false, description: 'Hidden data' }],
      jobPreferences: { privateNotes: 'private-preferences' },
    } } },
  } });
  id = user.id;
  const token = newToken(); cookie = `carer_session=${token}`;
  await prisma.session.create({ data: { userId: id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + 3600000) } });
});
afterAll(async () => {
  if (id) await prisma.user.deleteMany({ where: { id } });
  await prisma.pricingPlan.deleteMany({ where: { id: planId } });
  await disconnectDatabase();
});
describe('complete public caregiver profile', () => {
  it('returns every saved public Pro section without publishing private JSON', async () => {
    const response = await request(app).get(`/api/v1/platform/directory/${id}`);
    expect(response.status).toBe(200);
    const record = response.body.data;
    expect(record.photo).toBe(photo);
    expect(record.professional).toMatchObject({ experience: '8', hourlyRatePence: 2200, travelRadiusMiles: 15 });
    expect(record.profileDetails).toMatchObject({ mileageRate: 0.45, minimumVisitMinutes: 60,
      qualifications: [{ title: 'NVQ Level 3', provider: 'Test college', date: '2020' }],
      references: [{ name: 'Reference Name', role: 'Employer' }],
      workHistory: [{ title: 'Senior carer', employer: 'Care team', current: true }],
      schedule: [{ day: 'Monday', slots: [{ start: '09:00', end: '17:00' }] }],
      timeOff: [{ start: '2027-02-01', end: '2027-02-03' }],
      services: [{ name: 'Companionship', description: 'Friendly visits' }],
    });
    expect(JSON.stringify(record)).not.toContain('private-');
    expect(record.professional).not.toHaveProperty('details');
    expect(record).not.toHaveProperty('membership');
  });
  it('returns experience/availability and photos consistently in both directory lists', async () => {
    const publicList = await request(app).get('/api/v1/platform/directory?search=Full');
    expect(publicList.body.data.find((row: { id: string }) => row.id === id)).toMatchObject({ photo, professional: { experience: '8', availability: 'Monday 09:00–17:00' } });
    const dashboardList = await request(app).get('/api/v1/platform/caregivers?search=York').set('Cookie', cookie);
    expect(dashboardList.status).toBe(200);
    const record = dashboardList.body.data.find((row: { id: string }) => row.id === id);
    expect(record.photo).toBe(photo);
    expect(record.professional).not.toHaveProperty('details');
  });
  it('rejects malformed IDs and hides inactive caregivers', async () => {
    expect((await request(app).get('/api/v1/platform/directory/invalid')).status).toBe(400);
    await prisma.user.update({ where: { id }, data: { status: 'SUSPENDED' } });
    expect((await request(app).get(`/api/v1/platform/directory/${id}`)).status).toBe(404);
    await prisma.user.update({ where: { id }, data: { status: 'ACTIVE' } });
  });
  it('removes gated historic details after the trial expires', async () => {
    await prisma.membership.update({ where: { userId: id }, data: { trialEndsAt: new Date(Date.now() - 1000) } });
    const response = await request(app).get(`/api/v1/platform/directory/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.data.photo).toBe('');
    expect(response.body.data.professional).toMatchObject({ bio: '', qualifications: '', availability: '' });
    expect(response.body.data.profileDetails).toMatchObject({ workHistory: [], qualifications: [], schedule: [], references: [], timeOff: [] });
  });
});
