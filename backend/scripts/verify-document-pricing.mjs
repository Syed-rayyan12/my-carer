import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { app } from '../dist/app.js';
import { prisma } from '../dist/config/db.js';
import { hashPassword } from '../dist/modules/auth/auth.crypto.js';
import { signupSchema } from '../dist/modules/auth/auth.validation.js';
import { createSeeker, provisionAdmin } from '../dist/modules/auth/auth.repository.js';
const expected = JSON.parse(
  readFileSync(new URL('../docs/pricing-catalogue.json', import.meta.url), 'utf8'),
);
const tag = `document-pricing-${Date.now()}`;
const fixtureIds = [];
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${server.address().port}/api/v1/`;
const password = 'Document pricing verification 8362!';
const passwordHash = await hashPassword(password);
let calls = 0;
let checks = 0;
const pass = (label) => {
  checks++;
  console.log(`PASS ${label}`);
};
async function api(path, { method = 'GET', body, session, status = 200 } = {}) {
  calls++;
  const response = await fetch(base + path, {
    method,
    headers: {
      'content-type': 'application/json',
      origin: 'http://localhost:3002',
      ...(session ? { cookie: session.cookie, 'x-csrf-token': session.csrfToken } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json();
  assert.equal(response.status, status, `${method} ${path}: ${JSON.stringify(result)}`);
  return { ...result, cookie: response.headers.get('set-cookie')?.split(';')[0] };
}
const login = async (user) => {
  const r = await api('auth/login', {
    method: 'POST',
    body: { email: user.email, password, role: user.role },
  });
  return { cookie: r.cookie, csrfToken: r.data.csrfToken, user: r.data.user };
};
const profile = {
  firstName: 'Pricing',
  lastName: 'Fixture',
  email: '',
  phone: '07700 900123',
  dateOfBirth: '',
  location: 'York',
  address: 'Test address',
  postcode: 'YO1 7HH',
  about: 'Test profile for package verification.',
  emergencyName: '',
  relationship: '',
  emergencyPhone: '',
  language: 'English (UK)',
};
const professional = {
  bio: '',
  location: 'York',
  qualifications: '',
  experience: '',
  hourlyRatePence: 1800,
  travelRadiusMiles: 10,
  services: 'Companionship',
  availability: '',
  references: '',
  details: {},
};
const organisation = {
  name: 'Pricing QA organisation',
  description: 'Temporary test organisation',
  address: 'Test address',
  postcode: 'YO1 7HH',
  phone: '07700 900123',
  website: '',
  coverage: 'York',
  services: '',
  feeRange: '',
  gallery: [],
  team: '',
  virtualTour: '',
  branches: [],
  cqcReference: '',
};
const job = {
  title: 'Temporary pricing QA job',
  description: 'Temporary recruitment fixture',
  location: 'York',
  budgetPence: 1800,
  fundingType: 'Agency',
  tasks: 'Companionship',
  schedule: 'Monday',
};
const sessions = {};
const users = {};
try {
  const admin = await provisionAdmin(`${tag}-admin@example.com`, passwordHash);
  fixtureIds.push(admin.id);
  const adminSession = await login(admin);
  const plans = (await api('platform/plans')).data;
  assert.equal(plans.length, 10);
  for (const plan of expected) {
    const live = plans.find((p) => p.id === plan.id);
    assert.equal(live.pricePence, plan.pricePence);
    assert.equal(live.annualPricePence, plan.annualPricePence);
    assert.deepEqual(live.featureRows, plan.featureRows);
  }
  pass('all ten database packages match the document prices and every feature row');
  for (const plan of [
    ...expected,
    {
      id: 'FAMILY_FREE',
      category: 'CARE_SEEKER',
      pricePence: 0,
      annualPricePence: 0,
      defaultRole: 'CARE_SEEKER',
    },
  ]) {
    const annual = plan.id === 'CARER_VERIFIED';
    const input = signupSchema.parse({
      firstName: 'Pricing',
      lastName: 'Fixture',
      email: `${tag}-${plan.id.toLowerCase()}@example.com`,
      password,
      confirmPassword: password,
      consent: true,
      role: plan.defaultRole,
      planId: plan.id,
      billingInterval: annual ? 'annual' : 'monthly',
      organisationName: 'Pricing QA organisation',
      phone: '07700 900123',
      location: 'York',
    });
    let user;
    if (['CARER_VERIFIED', 'HOME_ENHANCED', 'AGENCY_GROWTH_PLUS'].includes(plan.id)) {
      await api('auth/signup', { method: 'POST', body: input, status: 201 });
      user = await prisma.user.findUniqueOrThrow({ where: { email: input.email } });
    } else user = await createSeeker(input, passwordHash);
    fixtureIds.push(user.id);
    users[plan.id] = user;
    const before = await prisma.membership.findUniqueOrThrow({ where: { userId: user.id } });
    assert.equal(before.planId, plan.id);
    assert.equal(before.pricePence, annual ? plan.annualPricePence : plan.pricePence);
    assert.equal(before.trialStartedAt, null);
    assert.equal(user.accountCategory, plan.category);
    await api(`admin/registrations/${user.id}/status`, {
      method: 'PATCH',
      session: adminSession,
      body: { status: 'ACTIVE' },
    });
    const after = await prisma.membership.findUniqueOrThrow({ where: { userId: user.id } });
    assert.equal(after.status, plan.pricePence === 0 ? 'ACTIVE' : 'TRIAL');
    assert.equal(!!after.trialEndsAt, plan.pricePence > 0);
    const session = await login(user);
    sessions[plan.id] = session;
    if (user.role === 'CARE_SEEKER') {
      assert.equal(session.user.profileComplete, false);
      if (plan.id === 'HOME_ENHANCED') {
        await api('platform/account', { session, status: 403 });
        await api('care-seekers/me', { method: 'PATCH', session, body: profile });
      } else
        await prisma.careSeekerProfile.update({
          where: { userId: user.id },
          data: {
            phone: '+447700900123',
            location: 'York',
            address: 'Test address',
            postcode: 'YO1 7HH',
            about: profile.about,
          },
        });
    }
  }
  pass(
    'all package categories, dedicated login roles, annual quote and approval-started trials persist correctly',
  );
  for (const id of Object.keys(users)) {
    const data = (await api('platform/account', { session: sessions[id] })).data;
    assert.equal(data.access.active, true);
    assert.equal(data.membership.planId, id);
  }
  pass(
    'all eleven account/package combinations load an authenticated dashboard; profile-first gate remains enforced',
  );
  const free = sessions.CARER_FREE,
    verified = sessions.CARER_VERIFIED,
    pro = sessions.CARER_PRO;
  await api('platform/professional', { method: 'PATCH', session: free, body: professional });
  await api('platform/professional', {
    method: 'PATCH',
    session: free,
    body: { ...professional, services: 'A,B' },
    status: 403,
  });
  await api('platform/professional', {
    method: 'PATCH',
    session: free,
    body: { ...professional, bio: 'Not included' },
    status: 403,
  });
  await api('platform/professional', {
    method: 'PATCH',
    session: verified,
    body: { ...professional, bio: 'Verified bio', services: 'A,B,C,D,E' },
  });
  await api('platform/professional', {
    method: 'PATCH',
    session: verified,
    body: { ...professional, qualifications: 'Not included' },
    status: 403,
  });
  await api('platform/professional', {
    method: 'PATCH',
    session: pro,
    body: {
      ...professional,
      bio: 'Pro bio',
      qualifications: 'NVQ',
      availability: 'Monday',
      services: 'A,B,C,D,E,F',
    },
  });
  await api('platform/job-alerts', { session: verified, status: 403 });
  await api('platform/job-alerts', { session: pro });
  await api('platform/analytics', { session: free, status: 403 });
  await api('platform/analytics', { session: pro });
  await api('platform/messages', {
    method: 'POST',
    session: free,
    body: { recipientId: users.FAMILY_FREE.id, body: 'Blocked' },
    status: 403,
  });
  await api('platform/messages', {
    method: 'POST',
    session: verified,
    body: { recipientId: users.FAMILY_FREE.id, body: 'Allowed during trial' },
    status: 201,
  });
  await api('platform/verifications', {
    method: 'POST',
    session: verified,
    body: { kind: 'RIGHT_TO_WORK', reference: 'QA reference' },
    status: 201,
  });
  await api('platform/verifications', {
    method: 'POST',
    session: verified,
    body: { kind: 'QUALIFICATION', reference: 'QA reference' },
    status: 403,
  });
  pass(
    'Free/Verified/Pro profile, specialism, messaging, alerts, analytics and verification restrictions resist direct API calls',
  );
  const gallery = Array.from({ length: 20 }, (_, i) => `https://example.com/qa-${i}.jpg`);
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.HOME_BASIC,
    body: organisation,
  });
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.HOME_BASIC,
    body: { ...organisation, gallery: [gallery[0]] },
    status: 403,
  });
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.HOME_ENHANCED,
    body: { ...organisation, gallery, services: 'Residential care', feeRange: 'GBP 800 per week' },
  });
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.HOME_ENHANCED,
    body: { ...organisation, gallery: [...gallery, 'https://example.com/21.jpg'] },
    status: 403,
  });
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.HOME_PREMIUM,
    body: {
      ...organisation,
      gallery: [...gallery, 'https://example.com/21.jpg'],
      virtualTour: 'https://example.com/tour',
    },
  });
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.AGENCY_STARTER,
    body: { ...organisation, team: 'Not included' },
    status: 403,
  });
  await api('platform/organisation', {
    method: 'PATCH',
    session: sessions.AGENCY_ENTERPRISE,
    body: {
      ...organisation,
      team: 'Test team',
      branches: [{ name: 'York', address: 'Test address' }],
    },
  });
  await api('platform/membership/change', {
    method: 'POST',
    session: sessions.AGENCY_STARTER,
    body: { planId: 'FAMILY_FREE', billingInterval: 'monthly' },
    status: 403,
  });
  await api('platform/membership/change', {
    method: 'POST',
    session: sessions.HOME_BASIC,
    body: { planId: 'AGENCY_STARTER', billingInterval: 'monthly' },
    status: 403,
  });
  pass('organisation limits match package tiers, and category switching cannot bypass job quotas');
  await api('platform/requests', {
    method: 'POST',
    session: sessions.HOME_BASIC,
    body: job,
    status: 403,
  });
  // Pre-fill two slots to check competing requests at the three-post limit.
  await prisma.careRequest.createMany({
    data: [0, 1].map((i) => ({
      ...job,
      title: `QA capacity ${i}`,
      ownerId: users.AGENCY_STARTER.id,
    })),
  });
  const concurrent = await Promise.all(
    [0, 1].map(() =>
      fetch(base + 'platform/requests', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          origin: 'http://localhost:3002',
          cookie: sessions.AGENCY_STARTER.cookie,
          'x-csrf-token': sessions.AGENCY_STARTER.csrfToken,
        },
        body: JSON.stringify(job),
      }),
    ),
  );
  assert.deepEqual(concurrent.map((r) => r.status).sort(), [201, 403]);
  const starterJobs = await prisma.careRequest.findMany({
    where: { ownerId: users.AGENCY_STARTER.id },
  });
  assert.equal(starterJobs.length, 3);
  await api(`platform/requests/${starterJobs[0].id}`, {
    method: 'PATCH',
    session: sessions.AGENCY_STARTER,
    body: { status: 'CLOSED' },
  });
  await api('platform/requests', {
    method: 'POST',
    session: sessions.AGENCY_STARTER,
    body: job,
    status: 201,
  });
  await api(`platform/requests/${starterJobs[0].id}`, {
    method: 'PATCH',
    session: sessions.AGENCY_STARTER,
    body: { status: 'OPEN' },
    status: 403,
  });
  pass(
    'job quota is atomic under concurrent requests, and cannot be bypassed by reopening a posting',
  );
  const growthJob = await prisma.careRequest.create({
    data: { ...job, ownerId: users.AGENCY_GROWTH.id },
  });
  const application = await prisma.application.create({
    data: {
      requestId: growthJob.id,
      caregiverId: users.CARER_PRO.id,
      coverLetter: 'QA application',
    },
  });
  await api(`platform/applications/${application.id}/shortlist`, {
    method: 'PATCH',
    session: sessions.AGENCY_STARTER,
    body: { shortlisted: true },
    status: 403,
  });
  await api(`platform/applications/${application.id}/shortlist`, {
    method: 'PATCH',
    session: sessions.AGENCY_GROWTH,
    body: { shortlisted: true },
  });
  await api('platform/applications?verification=DBS', {
    session: sessions.AGENCY_STARTER,
    status: 403,
  });
  await api('platform/applications?verification=DBS', { session: sessions.AGENCY_GROWTH });
  await api(`platform/applications/${application.id}`, {
    method: 'PATCH',
    session: sessions.AGENCY_GROWTH,
    body: { status: 'ACCEPTED' },
  });
  const review = (
    await api('platform/reviews', {
      method: 'POST',
      session: sessions.AGENCY_GROWTH,
      body: { caregiverId: users.CARER_PRO.id, rating: 5, body: 'QA review' },
      status: 201,
    })
  ).data;
  await api(`platform/reviews/${review.id}/response`, {
    method: 'PATCH',
    session: pro,
    body: { response: 'QA response' },
  });
  await api('platform/messages', {
    method: 'POST',
    session: sessions.FAMILY_FREE,
    body: { recipientId: users.HOME_ENHANCED.id, body: 'QA care home enquiry' },
    status: 201,
  });
  await api('platform/messages', {
    method: 'POST',
    session: sessions.HOME_ENHANCED,
    body: { recipientId: users.FAMILY_FREE.id, body: 'QA enquiry reply' },
    status: 201,
  });
  const homeReview = (
    await api('platform/reviews', {
      method: 'POST',
      session: sessions.FAMILY_FREE,
      body: { caregiverId: users.HOME_ENHANCED.id, rating: 4, body: 'QA care home review' },
      status: 201,
    })
  ).data;
  await api(`platform/reviews/${homeReview.id}/response`, {
    method: 'PATCH',
    session: sessions.HOME_ENHANCED,
    body: { response: 'QA home response' },
  });
  await api(`platform/reviews/${homeReview.id}/dispute`, {
    method: 'POST',
    session: sessions.HOME_ENHANCED,
    body: { reason: 'QA dispute' },
    status: 200,
  });
  const report = (await api('platform/reports/monthly', { session: sessions.AGENCY_ENTERPRISE }))
    .data;
  assert.equal(typeof report.incomingApplications, 'number');
  await api('platform/reports/monthly', { session: sessions.AGENCY_GROWTH, status: 403 });
  const exported = (
    await api('platform/integrations/export', { session: sessions.AGENCY_ENTERPRISE })
  ).data;
  assert.equal(exported.organisation.userId, users.AGENCY_ENTERPRISE.id);
  await api('platform/integrations/export', { session: sessions.AGENCY_GROWTH, status: 403 });
  pass(
    'shortlisting, filters, enquiry-based organisation reviews, responses, disputes and Enterprise exports work',
  );
  const old = await prisma.membership.findUniqueOrThrow({ where: { userId: users.CARER_PRO.id } });
  await api('platform/membership/change', {
    method: 'POST',
    session: pro,
    body: { planId: 'CARER_VERIFIED', billingInterval: 'monthly' },
  });
  const changed = await prisma.membership.findUniqueOrThrow({
    where: { userId: users.CARER_PRO.id },
  });
  assert.equal(changed.trialEndsAt.toISOString(), old.trialEndsAt.toISOString());
  await prisma.membership.update({
    where: { userId: users.CARER_PRO.id },
    data: { trialEndsAt: new Date(Date.now() - 1000) },
  });
  await api('platform/messages', {
    method: 'POST',
    session: pro,
    body: { recipientId: users.FAMILY_FREE.id, body: 'Expired trial' },
    status: 403,
  });
  await api('platform/membership/change', {
    method: 'POST',
    session: pro,
    body: { planId: 'CARER_PRO', billingInterval: 'annual' },
  });
  const expired = await prisma.membership.findUniqueOrThrow({
    where: { userId: users.CARER_PRO.id },
  });
  assert.equal(expired.status, 'PENDING');
  assert(expired.trialEndsAt < new Date());
  assert.equal(expired.pricePence, 19900);
  pass(
    'tier switches preserve trial dates; expired trials cannot be restarted or used for messaging',
  );
  const publicDirectory = (await api('platform/directory')).data;
  assert(!publicDirectory.find((u) => u.id === users.CARER_PRO.id).membership);
  const snapshot = {users:(await api('platform/admin/users?limit=100', {session:adminSession})).data,reviews:(await api('platform/admin/reviews?limit=100',{session:adminSession})).data};
  assert.equal(
    snapshot.users.find((u) => u.id === users.CARER_VERIFIED.id).membership.pricePence,
    9900,
  );
  assert.equal(
    snapshot.reviews.find((r) => r.caregiverId === users.HOME_ENHANCED.id).disputeReason,
    'QA dispute',
  );
  const listing = (await api('platform/organisations')).data.find(
    (p) => p.id === users.HOME_ENHANCED.id,
  );
  assert.equal(listing.cqcRating, null);
  assert.equal(listing.reviews[0].response, 'QA home response');
  pass(
    'public directory hides membership data; organisation reviews and admin disputes/annual prices persist correctly',
  );
  for (const [path, session] of [
    ['/caregiver-dashboard/membership', pro],
    ['/caregiver-dashboard/package-tools', pro],
    ['/care-seeker-dashboard/organisation', sessions.HOME_ENHANCED],
    ['/admin-dashboard/organisations', adminSession],
  ]) {
    const page = await fetch('http://localhost:3002' + path, {
      headers: { cookie: session.cookie },
      redirect: 'manual',
    });
    assert.equal(page.status, 200, `Frontend page ${path} failed: ${page.status}`);
  }
  pass(
    'authenticated membership, package tools, organisation and administrator pages compile and return HTTP 200',
  );
  console.log(`Completed ${checks} grouped live checks using ${calls + 2} HTTP requests.`);
} finally {
  await prisma.accountStatusHistory.deleteMany({
    where: { OR: [{ actorId: { in: fixtureIds } }, { userId: { in: fixtureIds } }] },
  });
  await prisma.user.deleteMany({ where: { id: { in: fixtureIds } } });
  await prisma.$disconnect();
  await new Promise((resolve) => server.close(resolve));
  console.log(
    'Removed only pricing QA accounts and their dependent records; existing accounts retained.',
  );
}
