import { beforeEach, describe, expect, it, vi } from 'vitest';
import { accountApi } from '../../components/auth/auth-client';
import { loadWorkspacePage } from '../../components/platform/workspace-api';
import { loadAdminPage } from '../../components/admin/admin-api';
vi.mock('@/components/auth/auth-client', () => ({ accountApi: vi.fn() }));
const api = vi.mocked(accountApi);
const paths = () => api.mock.calls.map(([p]) => p);
beforeEach(() => {
  api.mockReset();
  api.mockImplementation(async (path) => {
    if (path === 'platform/account')
      return {
        data: {
          membership: {
            planId: 'FAMILY_FREE',
            plan: { id: 'FAMILY_FREE', category: 'CARE_SEEKER', title: 'Free' },
          },
          access: { active: true, trial: false, entitlements: {} },
        },
      };
    if (path === 'platform/overview')
      return {
        data: {
          stats: { openRequests: 4 },
          activity: [],
          requests: [],
          caregivers: [],
          saved: [],
          reviews: [],
        },
      };
    if (path === 'platform/admin/overview')
      return {
        data: {
          counts: { caregivers: 1, seekers: 1, openRequests: 1, pendingVerifications: 0 },
          users: [],
          history: [],
        },
      };
    if (path === 'care-seekers/me' || path === 'platform/profile')
      return { data: { firstName: 'Aisha', phone: '+447700900123', profileComplete: true } };
    if (path === 'platform/membership')
      return {
        data: {
          membership: { planId: 'FAMILY_FREE' },
          plan: {
            id: 'FAMILY_FREE',
            category: 'CARE_SEEKER',
            title: 'Free',
            features: ['Find care'],
          },
        },
      };
    if (path.startsWith('platform/professional'))
      return { data: { services: 'Support', details: { services: [] } } };
    return { data: [], pagination: { page: 2, limit: 25, hasMore: true } };
  });
});
describe('Frontend resource loading by dashboard page', () => {
  it('loads only overview plus small shared shell resources on home', async () => {
    const r = await loadWorkspacePage('/care-seeker-dashboard', 1);
    expect(paths().sort()).toEqual(
      ['platform/account', 'platform/notifications', 'platform/overview'].sort(),
    );
    expect(r.snapshot).not.toHaveProperty('applications');
    expect(r.snapshot).not.toHaveProperty('messages');
  });
  it('loads requirements without fetching applications or directory', async () => {
    await loadWorkspacePage('/care-seeker-dashboard/care-requirements', 2);
    expect(paths()).toContain('platform/requests?page=2&limit=25');
    expect(paths().some((p) => p.includes('/applications') || p.includes('/caregivers'))).toBe(
      false,
    );
  });
  it('loads responses scoped to the selected request', async () => {
    await loadWorkspacePage('/care-seeker-dashboard/my-requests/request-123/responses', 1);
    expect(paths()).toContain('platform/requests?id=request-123&page=1&limit=25');
    expect(paths()).toContain('platform/applications?requestId=request-123&page=1&limit=25');
    expect(paths()).not.toContain('platform/caregivers');
  });
  it('does not fetch requirements while showing the create form', async () => {
    await loadWorkspacePage('/care-seeker-dashboard/care-requirements/create', 1);
    expect(paths().some((p) => p.startsWith('platform/requests'))).toBe(false);
  });
  it('fetches the services projection without unrelated profile sections', async () => {
    await loadWorkspacePage('/caregiver-dashboard/care-services', 1);
    expect(paths()).toContain('platform/professional?section=services');
    expect(
      paths().some(
        (p) => p.includes('applications') || p.includes('/messages') || p.includes('/requests'),
      ),
    ).toBe(false);
  });
  it('loads paginated messages without a bulk workspace request', async () => {
    const r = await loadWorkspacePage('/caregiver-dashboard/messages', 2);
    expect(paths()).toContain('platform/messages?page=2&limit=25');
    expect(r.pagination).toEqual({ page: 2, limit: 25, hasMore: true });
    expect(paths().some((p) => p.includes('/workspace'))).toBe(false);
  });
  it('keeps full selected plan details on membership page', async () => {
    const r = await loadWorkspacePage('/care-seeker-dashboard/membership', 1);
    expect(r.snapshot.membership?.plan?.features).toEqual(['Find care']);
    expect(paths()).toContain('platform/membership');
  });
  it('filters read-only profile flags out of account settings writes', async () => {
    const r = await loadWorkspacePage('/care-seeker-dashboard/settings', 1);
    expect(r.snapshot.account).toEqual({ firstName: 'Aisha', phone: '+447700900123' });
  });
  it('loads admin reviews without users, requests or verifications', async () => {
    await loadAdminPage('/admin-dashboard/reviews', 2);
    expect(paths().sort()).toEqual(
      ['platform/admin/reviews?page=2&limit=25', 'platform/notifications'].sort(),
    );
  });
  it('loads only admin overview sections and small notifications', async () => {
    await loadAdminPage('/admin-dashboard', 1);
    expect(paths().sort()).toEqual(['platform/admin/overview', 'platform/notifications'].sort());
  });
});
