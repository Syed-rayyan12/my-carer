import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { env } from '../src/config/env.js';
import { prisma, disconnectDatabase } from '../src/config/db.js';
import { hashPassword } from '../src/modules/auth/auth.crypto.js';

const base = env.FRONTEND_TEST_URL!;
const suffix = randomUUID().slice(0, 8);
const email = `http-seeker-${suffix}@example.test`;
const adminEmail = `http-admin-${suffix}@example.test`;
const password = 'HTTP care seeker test phrase 2026!';
const ids: string[] = [];
let adminCookie = '';
let adminCsrf = '';
let seekerCookie = '';
let seekerCsrf = '';
let seekerId = '';
const api = (path: string, body?: object, cookie?: string, csrf?: string, method = 'POST') =>
  fetch(`${base}/api/${path}`, {
    method,
    headers: {
      Origin: base,
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
      ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
const cookieOf = (response: Response) => response.headers.getSetCookie()[0]!.split(';')[0]!;
beforeAll(async () => {
  if (
    !new URL(env.DATABASE_URL).pathname.endsWith('/carer_auth_test') ||
    base !== 'http://localhost:3100'
  )
    throw new Error('Refusing non-test targets');
  const user = await prisma.user.create({
    data: {
      email: adminEmail,
      firstName: 'HTTP',
      lastName: 'Admin',
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash: await hashPassword(password),
    },
  });
  ids.push(user.id);
});
afterAll(async () => {
  await prisma.accountStatusHistory.deleteMany({ where: { actorId: { in: ids } } });
  await prisma.user.deleteMany({ where: { id: { in: ids } } });
  await disconnectDatabase();
});
describe('Next.js frontend to Express session integration', () => {
  it('renders separate sign-in tabs and redirects anonymous dashboard requests', async () => {
    const signin = await fetch(`${base}/signin`);
    expect(signin.status).toBe(200);
    const html = await signin.text();
    expect(html).toContain('Care Seeker');
    expect(html).toContain('Caregiver');
    for (const path of [
      '/care-seeker-dashboard',
      '/care-seeker-dashboard/my-profile',
      '/dashboard',
      '/admin-dashboard',
      '/caregiver-dashboard',
    ]) {
      const result = await fetch(base + path, { redirect: 'manual' });
      expect(result.status).toBe(307);
      expect(result.headers.get('location')).toContain('signin');
    }
  });
  it('forwards signup and login cookies without leaking the raw session token', async () => {
    const signup = await api('auth/signup', {
      firstName: 'HTTP',
      lastName: 'Seeker',
      email,
      password,
      confirmPassword: password,
      role: 'CARE_SEEKER',
      consent: true,
    });
    expect(signup.status).toBe(201);
    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    seekerId = user.id;
    ids.push(user.id);
    expect((await api('auth/login', { email, password, role: 'CARE_SEEKER' })).status).toBe(403);
    const admin = await api('auth/login', { email: adminEmail, password, role: 'ADMIN' });
    expect(admin.status).toBe(200);
    adminCookie = cookieOf(admin);
    adminCsrf = (await admin.json()).data.csrfToken;
    expect(
      (
        await api(
          `admin/registrations/${seekerId}/status`,
          { status: 'ACTIVE' },
          adminCookie,
          adminCsrf,
          'PATCH',
        )
      ).status,
    ).toBe(200);
    const login = await api('auth/login', { email, password, role: 'CARE_SEEKER' });
    expect(login.status).toBe(200);
    seekerCookie = cookieOf(login);
    const data = await login.json();
    seekerCsrf = data.data.csrfToken;
    expect(data.data.token).toBeUndefined();
    expect(login.headers.get('set-cookie')).toContain('HttpOnly');
  });
  it('protects dashboard routes, blocks account switching, and leaves other browsers anonymous', async () => {
    const dashboard = await fetch(`${base}/care-seeker-dashboard`, {
      headers: { Cookie: seekerCookie },
      redirect: 'manual',
    });
    expect(dashboard.status).toBe(307);
    expect(dashboard.headers.get('location')).toContain('/care-seeker-dashboard/my-profile');
    const signin = await fetch(`${base}/signin`, {
      headers: { Cookie: seekerCookie },
      redirect: 'manual',
    });
    expect(signin.status).toBe(200);
    const admin = await fetch(`${base}/admin-dashboard`, {
      headers: { Cookie: seekerCookie },
      redirect: 'manual',
    });
    expect(admin.status).toBe(307);
    expect(admin.headers.get('location')).toContain('/care-seeker-dashboard');
    const anonymous = await fetch(`${base}/care-seeker-dashboard`, { redirect: 'manual' });
    expect(anonymous.status).toBe(307);
    const me = await api('auth/me', undefined, seekerCookie, undefined, 'GET');
    expect(me.status).toBe(200);
    expect((await me.json()).data.user.id).toBe(seekerId);
    expect((await api('auth/me', undefined, undefined, undefined, 'GET')).status).toBe(401);
  });
  it('accepts UK-format profile numbers and unlocks the dashboard after completion', async () => {
    const profile = {
      firstName: 'HTTP', lastName: 'Seeker', email, phone: '07700 900123',
      dateOfBirth: '', location: 'London', address: '10 Test Street', postcode: 'SW1A 1AA',
      about: 'Looking for companionship support.', emergencyName: '', relationship: '',
      emergencyPhone: '', language: 'English (UK)',
    };
    expect((await api('platform/account', undefined, seekerCookie, undefined, 'GET')).status).toBe(403);
    expect((await api('care-seekers/me', {...profile, phone: '12345'}, seekerCookie, seekerCsrf, 'PATCH')).status).toBe(400);
    const saved = await api('care-seekers/me', profile, seekerCookie, seekerCsrf, 'PATCH');
    expect(saved.status).toBe(200);
    const savedProfile = await saved.json();
    expect(savedProfile.data.phone).toBe('+447700900123');
    expect(savedProfile.data.profileComplete).toBe(true);
    expect((await api('platform/account', undefined, seekerCookie, undefined, 'GET')).status).toBe(200);
    expect((await fetch(`${base}/care-seeker-dashboard`, {headers:{Cookie:seekerCookie},redirect:'manual'})).status).toBe(200);
  });
  it('isolates multiple accounts in one shared browser cookie jar', async () => {
    const accounts = [];
    for (const role of ['CARE_SEEKER', 'CAREGIVER'] as const) {
      const user = await prisma.user.create({ data: {
        email: `tabs-${role.toLowerCase()}-${suffix}@example.test`, firstName: 'Tab', lastName: 'Account',
        passwordHash: await hashPassword(password), role, status: 'ACTIVE',
        ...(role === 'CAREGIVER' ? { professional: { create: { experience: '5', location: 'York' } } } : {}),
      } });
      ids.push(user.id);
      accounts.push(user);
    }
    let jar = `${seekerCookie}; ${adminCookie}`;
    const contexts = [randomUUID().replaceAll('-', ''), randomUUID().replaceAll('-', ''), randomUUID().replaceAll('-', '')];
    const scoped = (context: string, path: string, body?: object, csrf?: string) => fetch(`${base}/api/${path}`, {
      method: body ? 'POST' : 'GET', redirect: 'manual',
      headers: { Origin: base, 'Content-Type': 'application/json', Cookie: jar,
        'X-Account-Context': context, ...(csrf ? { 'X-CSRF-Token': csrf } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const users = [accounts[0]!, accounts[1]!, { email, role: 'CARE_SEEKER', id: seekerId }];
    const tokens: string[] = [];
    for (const [index, user] of users.entries()) {
      const response = await scoped(contexts[index]!, 'auth/login', { email: user.email, password, role: user.role });
      expect(response.status).toBe(200);
      expect(response.headers.get('set-cookie')).toContain(`carer_session_${contexts[index]}=`);
      expect(response.headers.get('set-cookie')).toContain('HttpOnly');
      jar += `; ${cookieOf(response)}`;
      tokens.push((await response.json()).data.csrfToken);
    }
    for (const [index, user] of users.entries()) {
      const me = await scoped(contexts[index]!, 'auth/me');
      expect(me.status).toBe(200);
      expect((await me.json()).data.user.id).toBe(user.id);
    }
    const profile = await scoped(contexts[1]!, `platform/directory/${accounts[1]!.id}`);
    expect(profile.status).toBe(200);
    const profileData = (await profile.json()).data;
    expect(profileData.professional.experience).toBe('5');
    expect(profileData).toHaveProperty('profileDetails');
    expect(profileData).not.toHaveProperty('passwordHash');
    // Unknown contexts cannot fall back to another account in the cookie jar.
    expect((await scoped(randomUUID().replaceAll('-', ''), 'auth/me')).status).toBe(401);
    expect((await scoped('invalid', 'auth/me')).status).toBe(400);
    expect((await scoped(contexts[0]!, 'auth/logout', {}, tokens[1])).status).toBe(403);
    // Role checks are enforced by the backend even though the shared jar has an admin cookie.
    expect((await scoped(contexts[0]!, 'admin/registrations')).status).toBe(403);
    const logout = await scoped(contexts[0]!, 'auth/logout', {}, tokens[0]);
    expect(logout.status).toBe(200);
    expect(logout.headers.get('set-cookie')).toContain(`carer_session_${contexts[0]}=`);
    expect((await scoped(contexts[0]!, 'auth/me')).status).toBe(401);
    for (const index of [1, 2]) expect((await scoped(contexts[index]!, 'auth/me')).status).toBe(200);
    expect((await fetch(`${base}/signin`, { headers: { Cookie: jar }, redirect: 'manual' })).status).toBe(200);
    expect((await api('auth/me', undefined, seekerCookie, undefined, 'GET')).status).toBe(200);
  });
  it('rejects oversized payloads and revokes cookies on logout', async () => {
    expect((await api('auth/signup', { oversized: 'x'.repeat(17000) })).status).toBe(413);
    expect((await api('auth/logout', {}, seekerCookie, seekerCsrf)).status).toBe(200);
    expect((await api('auth/me', undefined, seekerCookie, undefined, 'GET')).status).toBe(401);
    const dashboard = await fetch(`${base}/care-seeker-dashboard`, {
      headers: { Cookie: seekerCookie },
      redirect: 'manual',
    });
    expect(dashboard.status).toBe(307);
  });
});

