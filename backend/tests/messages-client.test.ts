import { beforeEach, describe, expect, it, vi } from 'vitest';
import { accountApi } from '../../frontend/components/auth/auth-client';
import { loadMessages, mergeMessages } from '../../frontend/components/platform/messages-api';
import type { LiveMessage } from '../../frontend/components/platform/workspace.types';

vi.mock('../../frontend/components/auth/auth-client', () => ({ accountApi: vi.fn() }));
const api = vi.mocked(accountApi);
const message = (id: string, time: number, outgoing = false): LiveMessage => ({
  id,
  body: id,
  senderId: outgoing ? 'seeker' : 'caregiver',
  recipientId: outgoing ? 'caregiver' : 'seeker',
  sender: {
    id: outgoing ? 'seeker' : 'caregiver',
    firstName: 'Test',
    lastName: 'Sender',
    role: outgoing ? 'CARE_SEEKER' : 'CAREGIVER',
  },
  recipient: {
    id: outgoing ? 'caregiver' : 'seeker',
    firstName: 'Test',
    lastName: 'Recipient',
    role: outgoing ? 'CAREGIVER' : 'CARE_SEEKER',
  },
  createdAt: new Date(time * 1000).toISOString(),
});
beforeEach(() => api.mockReset());
describe('conversation synchronisation', () => {
  it('loads all message pages so quieter conversations are retained', async () => {
    api.mockResolvedValueOnce({ data: [message('recent', 3)], pagination: { hasMore: true } });
    api.mockResolvedValueOnce({
      data: [message('older', 1), message('reply', 2, true)],
      pagination: { hasMore: false },
    });
    expect((await loadMessages()).map((row) => row.id)).toEqual(['older', 'reply', 'recent']);
    expect(api.mock.calls.map(([path]) => path)).toEqual([
      'platform/messages?page=1&limit=100',
      'platform/messages?page=2&limit=100',
    ]);
  });
  it('merges incoming replies without losing confirmed outgoing messages', () => {
    const sent = message('sent', 2, true);
    const received = message('received', 3);
    const merged = mergeMessages([sent, message('old', 1)], [sent, received], [received]);
    expect(merged.map((row) => row.id)).toEqual(['old', 'sent', 'received']);
    expect(merged.map((row) => row.senderId)).toEqual(['caregiver', 'seeker', 'caregiver']);
  });
  it('requests updates inclusively and deduplicates equal timestamps', async () => {
    const a = message('a', 3),
      b = message('b', 3, true);
    api.mockResolvedValue({ data: [b, a], pagination: { hasMore: false } });
    expect(mergeMessages([a], await loadMessages(a.createdAt)).map((row) => row.id)).toEqual([
      'a',
      'b',
    ]);
    expect(api).toHaveBeenCalledWith(
      'platform/messages?page=1&limit=100&since=1970-01-01T00%3A00%3A03.000Z',
    );
  });
});
