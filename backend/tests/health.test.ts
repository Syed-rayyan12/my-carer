import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { app } from '../src/app.js';
import { checkDatabase } from '../src/config/db.js';

vi.mock('../src/config/db.js', () => ({ checkDatabase: vi.fn() }));

describe('Health routes', () => {
  it('reports liveness without querying the database', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', uptime: expect.any(Number) });
    expect(response.body.uptime).toBeGreaterThanOrEqual(0);
    expect(response.headers['x-request-id']).toEqual(expect.any(String));
    expect(checkDatabase).not.toHaveBeenCalled();
  });

  it('reports readiness when the database probe succeeds', async () => {
    vi.mocked(checkDatabase).mockResolvedValueOnce(undefined);

    const response = await request(app).get('/api/v1/health/ready');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
    expect(checkDatabase).toHaveBeenCalledOnce();
  });

  it('returns 503 without exposing database errors when the probe fails', async () => {
    vi.mocked(checkDatabase).mockRejectedValueOnce(new Error('Private database details'));

    const response = await request(app).get('/api/v1/health/ready');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'error', message: 'Database unavailable' });
  });

  it('returns consistent JSON for unknown routes', async () => {
    const response = await request(app).get('/api/v1/missing');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ status: 'error', message: 'Route not found' });
  });
});
