import { accountApi } from '../auth/auth-client';
import type { LiveMessage } from './workspace.types';

export function mergeMessages(...groups: LiveMessage[][]): LiveMessage[] {
  const messages = new Map(groups.flat().map(message => [message.id, message]));
  return [...messages.values()].sort((a, b) =>
    Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id.localeCompare(b.id),
  );
}

// Read every page so one busy conversation cannot hide another participant.
// Live updates request only messages at or after the last known timestamp.
export async function loadMessages(since?: string): Promise<LiveMessage[]> {
  let messages: LiveMessage[] = [];
  for (let page = 1; ; page++) {
    const query = new URLSearchParams({ page: String(page), limit: '100' });
    if (since) query.set('since', since);
    const response = await accountApi<{
      data: LiveMessage[];
      pagination?: { hasMore: boolean };
    }>(`platform/messages?${query}`);
    messages = mergeMessages(messages, response.data);
    if (!response.pagination?.hasMore) return messages;
  }
}
