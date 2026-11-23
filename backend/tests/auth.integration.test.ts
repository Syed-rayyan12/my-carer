import { mkdirSync, writeFileSync } from 'node:fs';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { app } from '../src/app.js';
import { prisma, disconnectDatabase } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import { hashPassword, hashToken } from '../src/modules/auth/auth.crypto.js';

const origin = 'http://localhost:3000';
const responses: Record<string, unknown> = {};
const capture = (name: string, response: request.Response) => {
  responses[name] = {
    statusCode: response.status,
    body: JSON.parse(
      JSON.stringify(response.body, (key, value: unknown) =>
        key === 'csrfToken'
          ? '[REDACTED]'
          : key === 'id'
            ? '<user-id>'
            : typeof value === 'string'
              ? value.replace(/seeker-[a-f0-9]+@example.test/g, 'care.seeker@example.test')
              : value,
      ),
    ),
  };
};
const suffix = randomUUID().slice(0, 8);
const password = 'Care seeker test phrase 2026!';
const email = `seeker-${suffix}@example.test`;
const adminEmail = `admin-${suffix}@example.test`;
const otherEmail = `other-${suffix}@example.test`;
const ids: string[] = [];
const signup = {
  firstName: 'Aisha',
  lastName: 'Khan',
  email,
  password,
  confirmPassword: password,
  role: 'CARE_SEEKER',
  consent: true,
};
const cookieOf = (response: request.Response) =>
  (response.headers['set-cookie'] as unknown as string[])[0]!.split(';')[0]!;
const post = (path: string, body: object, cookie?: string, csrf?: string) => {
  const req = request(app).post(`/api/v1/${path}`).set('Origin', origin);
  if (cookie) req.set('Cookie', cookie);
  if (csrf) req.set('X-CSRF-Token', csrf);
  return req.send(body);
};
let adminCookie = '';
let adminCsrf = '';
let cookieA = '';
let cookieB = '';
let csrfA = '';
let csrfB = '';
let seekerId = '';
let otherId = '';
beforeAll(async () => {
  if (!new URL(env.DATABASE_URL).pathname.endsWith('/carer_auth_test'))
    throw new Error('Refusing to run against a non-test database');
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      firstName: 'Test',
      lastName: 'Admin',
      passwordHash: await hashPassword(password),
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  ids.push(admin.id);
});
afterAll(async () => {
  mkdirSync('coverage', { recursive: true });
  writeFileSync('coverage/auth-api-responses.json', JSON.stringify(responses, null, 2) + '\n');
  // Only remove fixtures created by this run; no truncate, reset, or blanket deletion.
  await prisma.accountStatusHistory.deleteMany({ where: { actorId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await disconnectDatabase();
});
describe('Care Seeker authentication with real PostgreSQL', () => {
  it('rejects anonymous dashboard API access and forged cookies', async () => {
    expect((await request(app).get('/api/v1/auth/me')).status).toBe(401);
    expect(
      (await request(app).get('/api/v1/care-seekers/me').set('Cookie', 'carer_session=forged'))
        .status,
    ).toBe(401);
  });
  it('requires a trusted origin and rejects role/status escalation', async () => {
    expect((await request(app).post('/api/v1/auth/signup').send(signup)).status).toBe(403);
    expect((await post('auth/signup', { ...signup, role: 'ADMIN', status: 'ACTIVE' })).status).toBe(
      400,
    );
  });
  it('creates a pending user and profile atomically, without issuing a session', async () => {
    const result = await post('auth/signup', signup);
    capture('signup-awaiting-approval', result);
    expect(result.status).toBe(201);
    expect(result.headers['set-cookie']).toBeUndefined();
    const user = await prisma.user.findUniqueOrThrow({
      where: { email },
      include: { profile: true },
    });
    seekerId = user.id;
    ids.push(user.id);
    expect(user.status).toBe('PENDING');
    expect(user.profile?.userId).toBe(user.id);
    expect(user.passwordHash).not.toBe(password);
    expect(result.body).not.toHaveProperty('passwordHash');
  });
  it('blocks pending accounts and duplicate registration', async () => {
    const pending = await post('auth/login', { email, password, role: 'CARE_SEEKER' });
    capture('login-blocked-before-approval', pending);
    expect(pending.status).toBe(403);
    expect((await post('auth/signup', signup)).status).toBe(409);
  });
  it('logs in a provisioned admin and requires CSRF for approval', async () => {
    const login = await post('auth/login', { email: adminEmail, password, role: 'ADMIN' });
    expect(login.status).toBe(200);
    adminCookie = cookieOf(login);
    adminCsrf = login.body.data.csrfToken;
    expect(
      (
        await request(app)
          .patch(`/api/v1/admin/registrations/${seekerId}/status`)
          .set('Origin', origin)
          .set('Cookie', adminCookie)
          .send({ status: 'ACTIVE' })
      ).status,
    ).toBe(403);
    const approve = await request(app)
      .patch(`/api/v1/admin/registrations/${seekerId}/status`)
      .set('Origin', origin)
      .set('Cookie', adminCookie)
      .set('X-CSRF-Token', adminCsrf)
      .send({ status: 'ACTIVE' });
    expect(approve.status).toBe(200);
    expect(await prisma.accountStatusHistory.count({ where: { userId: seekerId } })).toBe(1);
  });
  it('uses generic invalid credentials and does not mix account roles', async () => {
    expect(
      (await post('auth/login', { email, password: 'wrong password', role: 'CARE_SEEKER' })).status,
    ).toBe(401);
    expect((await post('auth/login', { email, password, role: 'ADMIN' })).status).toBe(401);
    expect((await post('auth/login', { email, password, role: 'CAREGIVER' })).status).toBe(401);
  });
  it('creates two independent device sessions with HttpOnly cookies', async () => {
    const a = await post('auth/login', { email, password, role: 'CARE_SEEKER' });
    const b = await post('auth/login', { email, password, role: 'CARE_SEEKER', remember: true });
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    capture('login-after-approval', a);
    cookieA = cookieOf(a);
    cookieB = cookieOf(b);
    csrfA = a.body.data.csrfToken;
    csrfB = b.body.data.csrfToken;
    expect(cookieA).not.toBe(cookieB);
    expect(csrfA).not.toBe(csrfB);
    expect(a.headers['set-cookie'][0]).toContain('HttpOnly');
    expect(a.headers['set-cookie'][0]).toContain('SameSite=Lax');
    expect(b.headers['set-cookie'][0]).toContain('Max-Age=');
    expect(a.body.data).not.toHaveProperty('token');
    expect(a.body.data.user).not.toHaveProperty('passwordHash');
    const raw = cookieA.split('=')[1]!;
    expect(await prisma.session.findUnique({ where: { tokenHash: raw } })).toBeNull();
    expect(
      await prisma.session.findUnique({ where: { tokenHash: hashToken(raw) } }),
    ).not.toBeNull();
    expect((await request(app).get('/api/v1/auth/me')).status).toBe(401);
    expect(
      (await request(app).get('/api/v1/auth/me').set('Cookie', cookieA)).body.data.user.id,
    ).toBe(seekerId);
  });
  it('keeps different seekers, caregivers and admins independently signed in', async () => {
    const passwordHash = await hashPassword(password);
    const accounts = [];
    for (const [label, role] of [['parallel-seeker', 'CARE_SEEKER'], ['parallel-caregiver', 'CAREGIVER']] as const) {
      const user = await prisma.user.create({ data: {
        email: `${label}-${suffix}@example.test`, firstName: 'Parallel', lastName: 'Account',
        passwordHash, role, status: 'ACTIVE',
      } });
      ids.push(user.id);
      accounts.push(user);
    }
    const logins = await Promise.all(accounts.map(user => post('auth/login', {
      email: user.email, password, role: user.role,
    })));
    for (const [index, login] of logins.entries()) {
      expect(login.status).toBe(200);
      const me = await request(app).get('/api/v1/auth/me').set('Cookie', cookieOf(login));
      expect(me.status).toBe(200);
      expect(me.body.data.user.id).toBe(accounts[index]!.id);
      expect(me.body.data.user.role).toBe(accounts[index]!.role);
    }
    const caregiverLogin = logins[1]!;
    expect((await post('auth/logout', {}, cookieOf(caregiverLogin), caregiverLogin.body.data.csrfToken)).status).toBe(200);
    for (const [cookie, expectedId] of [[cookieA, seekerId], [cookieOf(logins[0]!), accounts[0]!.id], [adminCookie, ids[0]!]]) {
      const me = await request(app).get('/api/v1/auth/me').set('Cookie', cookie!);
      expect(me.status).toBe(200);
      expect(me.body.data.user.id).toBe(expectedId);
    }
  });
  it('blocks session switching, non-admin access, and cross-session CSRF', async () => {
    expect(
      (await post('auth/login', { email, password, role: 'CARE_SEEKER' }, cookieA)).status,
    ).toBe(409);
    expect(
      (await request(app).get('/api/v1/admin/registrations').set('Cookie', cookieA)).status,
    ).toBe(403);
    expect((await post('auth/logout', {}, cookieA, csrfB)).status).toBe(403);
    expect(
      (
        await request(app)
          .post('/api/v1/auth/logout')
          .set('Origin', 'https://attacker.example')
          .set('Cookie', cookieA)
          .set('X-CSRF-Token', csrfA)
          .send({})
      ).status,
    ).toBe(403);
  });
  it('updates only the current profile and does not change sign-in email', async () => {
    const get = await request(app).get('/api/v1/care-seekers/me').set('Cookie', cookieA);
    expect(get.status).toBe(200);
    const profile = { ...get.body.data };
    delete profile.accountEmail;
    delete profile.profileComplete;
    const saved = await request(app)
      .patch('/api/v1/care-seekers/me')
      .set('Origin', origin)
      .set('Cookie', cookieA)
      .set('X-CSRF-Token', csrfA)
      .send({ ...profile, about: 'Looking for care', email: 'contact@example.test' });
    expect(saved.status).toBe(200);
    expect(saved.body.data.accountEmail).toBe(email);
    expect(
      (
        await request(app)
          .patch('/api/v1/care-seekers/me')
          .set('Origin', origin)
          .set('Cookie', cookieA)
          .set('X-CSRF-Token', csrfA)
          .send({ ...profile, userId: 'another-user' })
      ).status,
    ).toBe(400);
  });
  it('does not extend idle expiry for passive session polling', async () => {
    const hash = hashToken(cookieB.split('=')[1]!);
    const previous = new Date(Date.now() - 120000);
    await prisma.session.update({ where: { tokenHash: hash }, data: { lastSeenAt: previous } });
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookieB)).status).toBe(200);
    expect(
      (await prisma.session.findUniqueOrThrow({ where: { tokenHash: hash } })).lastSeenAt.getTime(),
    ).toBe(previous.getTime());
    expect(
      (
        await request(app)
          .get('/api/v1/auth/me')
          .set('Cookie', cookieB)
          .set('X-Session-Activity', '1')
      ).status,
    ).toBe(200);
    expect(
      (await prisma.session.findUniqueOrThrow({ where: { tokenHash: hash } })).lastSeenAt.getTime(),
    ).toBeGreaterThan(previous.getTime());
  });
  it('logout invalidates only that browser; the other device stays signed in', async () => {
    const loggedOut = await post('auth/logout', {}, cookieA, csrfA);
    capture('logout', loggedOut);
    expect(loggedOut.status).toBe(200);
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookieA)).status).toBe(401);
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookieB)).status).toBe(200);
  });
  it('suspension revokes all sessions immediately', async () => {
    expect(
      (
        await request(app)
          .patch(`/api/v1/admin/registrations/${seekerId}/status`)
          .set('Origin', origin)
          .set('Cookie', adminCookie)
          .set('X-CSRF-Token', adminCsrf)
          .send({ status: 'SUSPENDED', reason: 'Integration test' })
      ).status,
    ).toBe(200);
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookieB)).status).toBe(401);
    expect((await post('auth/login', { email, password, role: 'CARE_SEEKER' })).status).toBe(403);
  });
  it('blocks rejected accounts and records the decision reason', async () => {
    expect((await post('auth/signup', { ...signup, email: otherEmail })).status).toBe(201);
    const other = await prisma.user.findUniqueOrThrow({ where: { email: otherEmail } });
    otherId = other.id;
    ids.push(other.id);
    expect(
      (
        await request(app)
          .patch(`/api/v1/admin/registrations/${otherId}/status`)
          .set('Origin', origin)
          .set('Cookie', adminCookie)
          .set('X-CSRF-Token', adminCsrf)
          .send({ status: 'REJECTED', reason: 'Details incomplete' })
      ).status,
    ).toBe(200);
    expect(
      (await post('auth/login', { email: otherEmail, password, role: 'CARE_SEEKER' })).status,
    ).toBe(403);
  });
  it('enforces absolute and idle expiry', async () => {
    await prisma.user.update({ where: { id: seekerId }, data: { status: 'ACTIVE' } });
    const login = await post('auth/login', { email, password, role: 'CARE_SEEKER' });
    expect(login.status).toBe(200);
    const cookie = cookieOf(login);
    await prisma.session.update({
      where: { tokenHash: hashToken(cookie.split('=')[1]!) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookie)).status).toBe(401);
    const idle = await post('auth/login', { email, password, role: 'CARE_SEEKER' });
    const idleCookie = cookieOf(idle);
    await prisma.session.update({
      where: { tokenHash: hashToken(idleCookie.split('=')[1]!) },
      data: { lastSeenAt: new Date(Date.now() - 61 * 60_000) },
    });
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', idleCookie)).status).toBe(401);
  });
  it('password changes revoke every device and invalidate the old password', async () => {
    const a = await post('auth/login', { email, password, role: 'CARE_SEEKER' });
    const b = await post('auth/login', { email, password, role: 'CARE_SEEKER' });
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    const cookie = cookieOf(a);
    const csrf = a.body.data.csrfToken;
    const nextPassword = 'Changed care seeker phrase 2026!';
    expect(
      (
        await post(
          'auth/password',
          {
            currentPassword: 'incorrect',
            newPassword: nextPassword,
            confirmPassword: nextPassword,
          },
          cookie,
          csrf,
        )
      ).status,
    ).toBe(401);
    expect(
      (
        await post(
          'auth/password',
          { currentPassword: password, newPassword: nextPassword, confirmPassword: nextPassword },
          cookie,
          csrf,
        )
      ).status,
    ).toBe(200);
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookie)).status).toBe(401);
    expect((await request(app).get('/api/v1/auth/me').set('Cookie', cookieOf(b))).status).toBe(401);
    expect((await post('auth/login', { email, password, role: 'CARE_SEEKER' })).status).toBe(401);
    expect(
      (await post('auth/login', { email, password: nextPassword, role: 'CARE_SEEKER' })).status,
    ).toBe(200);
  });
  it('locks an account after five failures and throttles repeated requests', async () => {
    const attempt = (value: string) =>
      request(app)
        .post('/api/v1/auth/login')
        .set('Origin', origin)
        .set('X-Forwarded-For', '192.0.2.50')
        .send({ email, password: value, role: 'CARE_SEEKER' });
    for (let index = 0; index < 5; index++)
      expect((await attempt('incorrect password')).status).toBe(401);
    const user = await prisma.user.findUniqueOrThrow({ where: { id: seekerId } });
    expect(user.lockedUntil!.getTime()).toBeGreaterThan(Date.now());
    expect((await attempt('Changed care seeker phrase 2026!')).status).toBe(429);
    for (let index = 0; index < 15; index++) await attempt('');
    expect((await attempt('')).status).toBe(429);
  });

  it('isolates two different user accounts even when a foreign ID is supplied', async () => {
    expect(
      (
        await request(app)
          .patch('/api/v1/admin/registrations/' + otherId + '/status')
          .set('Origin', origin)
          .set('Cookie', adminCookie)
          .set('X-CSRF-Token', adminCsrf)
          .send({ status: 'ACTIVE' })
      ).status,
    ).toBe(200);
    const login = await request(app)
      .post('/api/v1/auth/login')
      .set('Origin', origin)
      .set('X-Forwarded-For', '192.0.2.51')
      .send({ email: otherEmail, password, role: 'CARE_SEEKER' });
    expect(login.status).toBe(200);
    const cookie = cookieOf(login);
    const own = await request(app)
      .get('/api/v1/care-seekers/me?userId=' + seekerId)
      .set('Cookie', cookie);
    expect(own.status).toBe(200);
    expect(own.body.data.accountEmail).toBe(otherEmail);
    expect(own.body.data.about).toBe('');
    const profile = { ...own.body.data };
    delete profile.accountEmail;
    delete profile.profileComplete;
    expect(
      (
        await request(app)
          .patch('/api/v1/care-seekers/me')
          .set('Origin', origin)
          .set('Cookie', cookie)
          .set('X-CSRF-Token', login.body.data.csrfToken)
          .send({ ...profile, about: 'Second user only' })
      ).status,
    ).toBe(200);
    const original = await prisma.careSeekerProfile.findUniqueOrThrow({
      where: { userId: seekerId },
    });
    expect(original.about).toBe('Looking for care');
  });
});
