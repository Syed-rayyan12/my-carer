import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as repository from '../src/modules/messages/messages.repository.js';
import { getMessages, postMessages } from '../src/modules/messages/messages.service.js';
import type { OperationInput } from '../src/modules/shared/operation.types.js';

vi.mock('../src/modules/messages/messages.repository.js', () => ({
  findManyMessage: vi.fn(),
  findUniqueUser: vi.fn(),
  createMessage: vi.fn(),
}));
vi.mock('../src/modules/membership/plans.js', () => ({ requireFeature: vi.fn() }));
const seeker = '00000000-0000-4000-8000-000000000001';
const caregiver = '00000000-0000-4000-8000-000000000002';
const context = (id = seeker, query = {}): OperationInput => ({
  user: { id, role: id === seeker ? 'CARE_SEEKER' : 'CAREGIVER', status: 'ACTIVE' } as NonNullable<
    OperationInput['user']
  >,
  body: {},
  query,
  params: {},
});
const message = (id: number) => ({
  id: String(id),
  senderId: seeker,
  recipientId: caregiver,
  body: `Message ${id}`,
  createdAt: new Date(2026, 10, 23, 12, 0, id),
});
beforeEach(() => vi.resetAllMocks());

describe('message delivery regression', () => {
  it('keeps the newest message when a lookahead row exists', async () => {
    vi.mocked(repository.findManyMessage).mockResolvedValue([message(3), message(2), message(1)]);
    const result = await getMessages(context(seeker, { limit: '2' }));
    expect(result.body.data.map((row) => row.id)).toEqual(['2', '3']);
    expect(result.body.pagination).toEqual({ page: 1, limit: 2, hasMore: true });
  });
  it('returns the older page without dropping or repeating a message', async () => {
    vi.mocked(repository.findManyMessage).mockResolvedValue([message(1)]);
    const result = await getMessages(context(seeker, { page: '2', limit: '2' }));
    expect(result.body.data.map((row) => row.id)).toEqual(['1']);
    expect(result.body.pagination.hasMore).toBe(false);
    expect(repository.findManyMessage).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 2, take: 3 }),
    );
  });
  it.each([seeker, caregiver])('restricts updates to the signed-in participant %s', async (id) => {
    vi.mocked(repository.findManyMessage).mockResolvedValue([]);
    await getMessages(context(id, { since: '2026-11-23T12:00:00.000Z' }));
    expect(repository.findManyMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ senderId: id }, { recipientId: id }],
          createdAt: { gte: new Date('2026-11-23T12:00:00.000Z') },
        },
      }),
    );
  });
  it.each([
    [seeker, caregiver],
    [caregiver, seeker],
  ])('sends to the selected recipient in either direction', async (senderId, recipientId) => {
    vi.mocked(repository.findUniqueUser).mockResolvedValue({
      id: recipientId,
      role: recipientId === seeker ? 'CARE_SEEKER' : 'CAREGIVER',
      status: 'ACTIVE',
    } as never);
    vi.mocked(repository.createMessage).mockResolvedValue(message(1));
    const input = context(senderId);
    input.body = { recipientId, body: 'Hello from the other account' };
    const result = await postMessages(input);
    expect(result.statusCode).toBe(201);
    expect(repository.createMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { senderId, recipientId, body: 'Hello from the other account' },
        include: expect.objectContaining({
          sender: expect.any(Object),
          recipient: expect.any(Object),
        }),
      }),
    );
  });
  it('rejects an invalid update timestamp', async () => {
    await expect(getMessages(context(seeker, { since: 'invalid' }))).rejects.toThrow();
    expect(repository.findManyMessage).not.toHaveBeenCalled();
  });
});
