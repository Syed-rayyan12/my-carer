import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { beforeAll, afterAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma, disconnectDatabase } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { newToken, hashToken, csrfToken } from '../src/modules/auth/auth.crypto.js';
import { sessionCookieName } from '../src/modules/auth/auth.middleware.js';

const tag = randomUUID().slice(0, 8);
const ids: string[] = [];
const plans: string[] = [];
const blogIds: string[] = [];
const sessions: Record<string, { cookie: string; csrf: string; id: string }> = {};
let requestId = '';
let foreignRequestId = '';
let applicationId = '';
beforeAll(async () => {
  if (!new URL(env.DATABASE_URL).pathname.endsWith('/carer_auth_test'))
    throw new Error('Test database required');
  for (const role of ['CARE_SEEKER', 'CAREGIVER'] as const) {
    const id = `qa_${tag}_${role}`;
    await prisma.pricingPlan.create({
      data: {
        id,
        title: 'QA plan',
        subtitle: 'Test fixture',
        pricePence: 0,
        defaultRole: role,
        category: role,
        features: [],
        entitlements: {
          jobLimit: 20,
          directMessages: true,
          reviewsCollect: true,
          candidateFilters: true,
          bio: true,
          qualifications: true,
          rightToWork: true,
          dbs: true,
          specialismsLimit: null,
        },
      },
    });
    plans.push(id);
  }
  for (const [name, role] of [
    ['seeker', 'CARE_SEEKER'],
    ['other', 'CARE_SEEKER'],
    ['caregiver', 'CAREGIVER'],
    ['admin', 'ADMIN'],
  ] as const) {
    const user = await prisma.user.create({
      data: {
        email: `${name}-${tag}@example.test`,
        firstName: name,
        lastName: 'QA',
        passwordHash: 'unused-session-test',
        role,
        status: 'ACTIVE',
        profile: {
          create: {
            phone: '+447700900123',
            location: 'York',
            address: 'Test address',
            postcode: 'YO1 7HH',
            about: 'Integration profile',
          },
        },
        ...(role === 'ADMIN'
          ? {}
          : {
              membership: {
                create: { planId: `qa_${tag}_${role}`, status: 'ACTIVE', pricePence: 0 },
              },
            }),
        ...(role === 'CAREGIVER'
          ? {
              professional: {
                create: { location: 'York', bio: 'Care experience', services: 'Support' },
              },
            }
          : {}),
      },
    });
    ids.push(user.id);
    const token = newToken();
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    sessions[name] = {
      cookie: `${sessionCookieName}=${token}`,
      csrf: csrfToken(token),
      id: user.id,
    };
  }
  for (let i = 0; i < 3; i++) {
    const r = await prisma.careRequest.create({
      data: {
        ownerId: sessions.seeker!.id,
        title: `QA care ${i}`,
        description: 'Test care',
        location: 'York',
        budgetPence: 2000,
        fundingType: 'Private',
        tasks: 'Support',
        schedule: 'Daily',
      },
    });
    if (!i) requestId = r.id;
  }
  const foreign = await prisma.careRequest.create({
    data: {
      ownerId: sessions.other!.id,
      title: 'Private other request',
      description: 'Other',
      location: 'York',
      budgetPence: 2000,
      fundingType: 'Private',
      tasks: 'Support',
      schedule: 'Daily',
    },
  });
  foreignRequestId = foreign.id;
  const a = await prisma.application.create({
    data: {
      caregiverId: sessions.caregiver!.id,
      requestId,
      coverLetter: 'I can help',
      status: 'ACCEPTED',
    },
  });
  applicationId = a.id;
  await prisma.message.create({
    data: {
      senderId: sessions.caregiver!.id,
      recipientId: sessions.seeker!.id,
      body: 'Test conversation',
    },
  });
  await prisma.savedCaregiver.create({
    data: { userId: sessions.seeker!.id, caregiverId: sessions.caregiver!.id },
  });
});
afterAll(async () => {
  await prisma.blogPost.deleteMany({ where: { id: { in: blogIds } } });
  await prisma.accountStatusHistory.deleteMany({ where: { actorId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await prisma.pricingPlan.deleteMany({ where: { id: { in: plans } } });
  await disconnectDatabase();
});
const get = (path: string, who = 'seeker') =>
  request(app).get(`/api/v1/platform/${path}`).set('Cookie', sessions[who]!.cookie);
const patch = (path: string, body: object, who = 'seeker') =>
  request(app)
    .patch(`/api/v1/platform/${path}`)
    .set('Cookie', sessions[who]!.cookie)
    .set('Origin', 'http://localhost:3000')
    .set('X-CSRF-Token', sessions[who]!.csrf)
    .send(body);

describe('Focused dashboard APIs and feature integration', () => {
  it('persists notification state per user and prevents foreign event writes', async () => {
    const feed = await get('notifications');
    expect(feed.status).toBe(200);
    const event = feed.body.data.find((n: {kind: string}) => n.kind === 'job');
    expect(event).toBeDefined();
    expect((await patch('notifications', {id:event.id,action:'read'})).status).toBe(200);
    expect((await get('notifications')).body.data.find((n: {id:string})=>n.id===event.id).read).toBe(true);
    expect((await patch('notifications', {id:event.id,action:'dismiss'})).status).toBe(200);
    expect((await get('notifications')).body.data.find((n: {id:string})=>n.id===event.id).dismissed).toBe(true);
    expect((await patch('notifications', {id:event.id,action:'read'}, 'other')).status).toBe(404);
    expect((await patch('notifications', {id:event.id,action:'restore'})).status).toBe(200);
    expect((await patch('notifications', {id:event.id,action:'unread'})).status).toBe(200);
    expect((await get('notifications')).body.data.find((n: {id:string})=>n.id===event.id)).toMatchObject({read:false,dismissed:false});
    const adminFeed=await get('notifications','admin');
    expect(adminFeed.body.data.some((n: {kind:string})=>n.kind==='registration')).toBe(true);
    expect((await patch('notifications',{action:'read-all'},'admin')).status).toBe(200);
    expect((await get('notifications','admin')).body.data.every((n:{read:boolean})=>n.read)).toBe(true);
  });
  it('publishes admin articles through public APIs and keeps drafts private', async () => {
    const id=`qa-blog-${tag}`; blogIds.push(id);
    const body={id,title:'QA article',description:'Description',content:'## Safe article\nTest content',category:'Care Advice',author:'Admin',date:'22 Nov 2026',status:'Draft',image:'',seoTitle:'QA SEO',metaDescription:'QA description'};
    const post=(data:object,who='admin')=>request(app).post('/api/v1/platform/admin/blog').set('Cookie',sessions[who]!.cookie).set('Origin','http://localhost:3000').set('X-CSRF-Token',sessions[who]!.csrf).send(data);
    expect((await post(body,'seeker')).status).toBe(403);
    expect((await post(body)).status).toBe(201);
    expect((await request(app).get('/api/v1/platform/blog/'+id)).status).toBe(404);
    expect((await get('admin/blog','admin')).body.data.some((p:{id:string})=>p.id===id)).toBe(true);
    expect((await post({...body,status:'Published',content:''})).status).toBe(400);
    expect((await post({...body,status:'Published'})).status).toBe(201);
    expect((await request(app).get('/api/v1/platform/blog/'+id)).body.data.title).toBe(body.title);
    expect((await request(app).get('/api/v1/platform/blog')).body.data.some((p:{id:string})=>p.id===id)).toBe(true);
    expect((await post({...body,status:'Published',title:'Updated title'})).status).toBe(201);
    expect((await request(app).get('/api/v1/platform/blog/'+id)).body.data.title).toBe('Updated title');
    expect((await post(body)).status).toBe(201);
    expect((await request(app).get('/api/v1/platform/blog/'+id)).status).toBe(404);
    const deleted=await request(app).delete('/api/v1/platform/admin/blog/'+id).set('Cookie',sessions.admin!.cookie).set('Origin','http://localhost:3000').set('X-CSRF-Token',sessions.admin!.csrf).send({});
    expect(deleted.status).toBe(200);
  });
  it('allows agency organisation saves while enforcing package limits and admin isolation', async () => {
    const planId = `qa_${tag}_agency`;
    await prisma.pricingPlan.create({ data: {
      id: planId, title: 'QA agency', subtitle: 'Test fixture', pricePence: 0,
      defaultRole: 'CARE_SEEKER', category: 'CARE_AGENCY', features: [],
      entitlements: { team: false, multiBranch: false },
    } });
    plans.push(planId);
    const agencyId = sessions.other!.id;
    await prisma.membership.update({ where: { userId: agencyId }, data: { planId } });
    const body = { name: 'QA agency', description: 'Care support', address: 'Test address',
      postcode: 'YO1 7HH', phone: '+447700900123', website: 'https://example.test',
      coverage: 'York', services: 'Home care', feeRange: '', gallery: [], team: '',
      virtualTour: '', branches: [], cqcReference: 'QA-REFERENCE' };
    try {
      expect((await patch('organisation', body, 'other')).status).toBe(200);
      const saved = await get('organisation', 'other');
      expect(saved.status).toBe(200);
      expect(saved.body.data.name).toBe(body.name);
      expect((await get('organisation')).status).toBe(403);
      expect((await patch('organisation', { ...body, team: 'Premium team' }, 'other')).status).toBe(403);
      expect((await patch('organisation', { ...body, website: 'javascript:alert(1)' }, 'other')).status).toBe(400);
      expect((await get('admin/overview', 'other')).status).toBe(403);
      expect((await get('admin/overview', 'admin')).status).toBe(200);
    } finally {
      await prisma.membership.update({ where: { userId: agencyId },
        data: { planId: `qa_${tag}_CARE_SEEKER` } });
    }
  });
  it('returns seeker overview sections without unrelated application/message/profile arrays', async () => {
    const r = await get('overview');
    expect(r.status).toBe(200);
    expect(Object.keys(r.body.data).sort()).toEqual(
      ['activity', 'caregivers', 'requests', 'reviews', 'saved', 'stats'].sort(),
    );
    expect(r.body.data.stats).toMatchObject({ openRequests: 3, savedCount: 1, arrangements: 1 });
    expect(r.body.data.requests).toHaveLength(2);
    expect(r.body.data.requests[0]._count).toBeDefined();
    expect(r.body.data.caregivers.every((p: { membership?: unknown }) => !p.membership)).toBe(true);
  });
  it('keeps shell access separate from the editable profile', async () => {
    const shell = await get('account');
    expect(shell.status).toBe(200);
    expect(Object.keys(shell.body.data).sort()).toEqual(['access', 'membership']);
    expect(Object.keys(shell.body.data.membership.plan).sort()).toEqual([
      'category',
      'id',
      'title',
    ]);
    const profile = await request(app)
      .get('/api/v1/care-seekers/me')
      .set('Cookie', sessions.seeker!.cookie);
    expect(profile.body.data.phone).toBe('+447700900123');
  });
  it('paginates owned requirements and rejects invalid pagination', async () => {
    const a = await get('requests?limit=2');
    const b = await get('requests?limit=2&page=2');
    expect(a.body.pagination).toEqual({ page: 1, limit: 2, hasMore: true });
    expect(b.body.data).toHaveLength(1);
    expect(a.body.data.every((r: { ownerId: string }) => r.ownerId === sessions.seeker!.id)).toBe(
      true,
    );
    expect(new Set([...a.body.data, ...b.body.data].map((r) => r.id)).size).toBe(3);
    expect((await get('requests?limit=1000')).status).toBe(400);
    expect((await get('requests?id=' + foreignRequestId)).body.data).toEqual([]);
  });
  it('loads only the chosen request responses and includes the UI relationships', async () => {
    const r = await get('applications?requestId=' + requestId);
    expect(r.status).toBe(200);
    expect(r.body.data).toHaveLength(1);
    expect(r.body.data[0].caregiver.professional.location).toBe('York');
    expect(r.body.data[0].caregiver.membership).toBeUndefined();
    expect(r.body.data[0].request.owner.id).toBe(sessions.seeker!.id);
    expect((await get('applications?requestId=' + requestId, 'other')).body.data).toEqual([]);
  });
  it('preserves ownership and CSRF checks on writes', async () => {
    expect((await patch('requests/' + requestId, { title: 'Not mine' }, 'other')).status).toBe(404);
    expect(
      (
        await request(app)
          .patch('/api/v1/platform/requests/' + requestId)
          .set('Cookie', sessions.seeker!.cookie)
          .set('Origin', 'http://localhost:3000')
          .send({ title: 'No token' })
      ).status,
    ).toBe(403);
    expect((await patch('requests/' + requestId, { title: 'Updated care' })).status).toBe(200);
    expect((await get('requests?id=' + requestId)).body.data[0].title).toBe('Updated care');
    expect(
      (
        await patch('applications/' + applicationId + '/arrangement', {
          status: 'active',
          startDate: '2026-11-20',
          schedule: 'Morning',
          location: 'York',
          notes: 'Test',
        })
      ).status,
    ).toBe(200);
  });
  it('returns saved caregiver details without leaking membership', async () => {
    const r = await get('saved');
    expect(r.status).toBe(200);
    expect(r.body.data[0].caregiver.id).toBe(sessions.caregiver!.id);
    expect(r.body.data[0].caregiver.membership).toBeUndefined();
  });
  it('returns caregiver overview and separate professional/application pages', async () => {
    const r = await get('overview', 'caregiver');
    expect(r.status).toBe(200);
    expect(r.body.data.stats.applicationCount).toBe(1);
    expect(r.body.data).not.toHaveProperty('caregivers');
    expect(r.body.data).not.toHaveProperty('saved');
    expect(r.body.data).not.toHaveProperty('professional');
    expect(r.body.data).not.toHaveProperty('verifications');
    expect((await get('professional', 'caregiver')).body.data.location).toBe('York');
    expect((await get('applications', 'caregiver')).body.data[0].request.owner.id).toBe(
      sessions.seeker!.id,
    );
  });
  it('returns professional sections and preserves other details during partial saves', async () => {
    expect(
      (await patch('professional', { details: { savedJobs: [requestId] } }, 'caregiver')).status,
    ).toBe(200);
    expect(
      (
        await patch(
          'professional',
          { services: 'Updated support', details: { services: [] } },
          'caregiver',
        )
      ).status,
    ).toBe(200);
    const section = await get('professional?section=services', 'caregiver');
    expect(Object.keys(section.body.data).sort()).toEqual(['details', 'services']);
    expect(section.body.data.details).not.toHaveProperty('savedJobs');
    const profile = await get('professional', 'caregiver');
    expect(profile.body.data.details.savedJobs).toEqual([requestId]);
    expect(profile.body.data).not.toHaveProperty('userId');
    const summary = await get('application-profile', 'caregiver');
    expect(Object.keys(summary.body.data).sort()).toEqual(['availability', 'photo']);
  });
  it('loads review choices without returning application records', async () => {
    const r = await get('reviews/candidates');
    expect(r.status).toBe(200);
    expect(r.body.data).toEqual([
      { id: sessions.caregiver!.id, firstName: 'caregiver', lastName: 'QA', role: 'CAREGIVER' },
    ]);
  });
  it('keeps admin overview and feature lists separate and protected', async () => {
    const r = await get('admin/overview', 'admin');
    expect(r.status).toBe(200);
    expect(Object.keys(r.body.data).sort()).toEqual(['activity', 'counts', 'users']);
    expect((await get('admin/overview')).status).toBe(403);
    expect(
      (await get('admin/users?role=CAREGIVER&id=' + sessions.caregiver!.id, 'admin')).body.data,
    ).toHaveLength(1);
    expect((await get('admin/requests?id=' + requestId, 'admin')).body.data[0]).not.toHaveProperty(
      'applications',
    );
    expect(
      (await get('admin/applications?requestId=' + requestId, 'admin')).body.data[0].caregiver.id,
    ).toBe(sessions.caregiver!.id);
    expect((await get('admin/verifications', 'admin')).status).toBe(200);
  });
  it('keeps notification payloads bounded and retires bulk endpoints', async () => {
    const r = await get('notifications');
    expect(r.status).toBe(200);
    expect(r.body.data[0]).toHaveProperty('title');
    expect(r.body.data[0]).not.toHaveProperty('body');
    expect((await get('workspace')).status).toBe(404);
    expect((await get('admin/dashboard', 'admin')).status).toBe(404);
  });
  it('saves admin weekly availability without losing other caregiver details', async () => {
    const id = sessions.caregiver!.id;
    const weekly = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({ day, slots: day === 'Monday' ? [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '18:00' }] : [] }));
    const body = { firstName: 'Caregiver', lastName: 'QA', phone: '+447700900123', location: 'York', qualifications: 'Admin edited qualification', availabilitySchedule: { weekly, minimumVisitMinutes: 60 } };
    expect((await patch(`admin/users/${id}/profile`, body, 'seeker')).status).toBe(403);
    expect((await patch(`admin/users/${id}/profile`, body, 'admin')).status).toBe(200);
    const saved = await get('professional', 'caregiver');
    expect(saved.body.data.details.availability).toMatchObject({ weekly, days: ['Monday'], minimumVisitMinutes: 60 });
    expect(saved.body.data.details.savedJobs).toEqual([requestId]);
    expect(saved.body.data.details.profile.qualifications[0].name).toBe('Admin edited qualification');
    const admin = await get(`admin/users?role=CAREGIVER&id=${id}`, 'admin');
    expect(admin.body.data[0].professional.details.availability.weekly).toEqual(weekly);
    const invalid = { ...body, availabilitySchedule: { ...body.availabilitySchedule, weekly: weekly.map(row => row.day === 'Monday' ? { ...row, slots: [{ start: '18:00', end: '09:00' }] } : row) } };
    expect((await patch(`admin/users/${id}/profile`, invalid, 'admin')).status).toBe(400);
    expect((await get('professional', 'caregiver')).body.data.details.availability.weekly).toEqual(weekly);
  });
});
