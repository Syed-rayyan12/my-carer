import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
vi.mock('../src/config/env.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/config/env.js')>();
  return { env: { ...actual.env, NODE_ENV: 'production', LOG_LEVEL: 'silent' } };
});
vi.mock('../src/modules/auth/auth.service.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/modules/auth/auth.service.js')>();
  return { ...actual, login: vi.fn() };
});
import { app } from '../src/app.js';
import { login } from '../src/modules/auth/auth.service.js';
describe('Production authentication transport', () => {
  it('sets host-only Secure/HttpOnly cookies and never returns the session secret', async () => {
    vi.mocked(login).mockResolvedValueOnce({
      token: 'a'.repeat(64),
      durationMs: 3600000,
      remember: true,
      user: {
        id: 'test-user',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.test',
        role: 'CARE_SEEKER',
        status: 'ACTIVE',
      },
    });
    const result = await request(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'test@example.test', password: 'test-password', role: 'CARE_SEEKER' });
    expect(result.status).toBe(200);
    const cookie = result.headers['set-cookie'][0];
    expect(cookie).toContain('__Host-carer_session=');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('SameSite=Lax');
    expect(cookie).toContain('Path=/');
    expect(cookie).not.toContain('Domain=');
    expect(result.body.data).not.toHaveProperty('token');
    expect(result.headers['cache-control']).toContain('no-store');
  });
  it('hides internal errors and stacks in production', async () => {
    vi.mocked(login).mockRejectedValueOnce(new Error('Private database details'));
    const result = await request(app)
      .post('/api/v1/auth/login')
      .set('Origin', 'http://localhost:3000')
      .send({ email: 'test@example.test', password: 'test-password', role: 'CARE_SEEKER' });
    expect(result.status).toBe(500);
    expect(result.body).toEqual({ status: 'error', message: 'Internal server error' });
  });
});

