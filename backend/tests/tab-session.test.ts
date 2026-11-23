import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getAccountContext, setAccountContext, newAccountContext, accountChannel, forgetRememberedContext } from '../../components/auth/tab-session';
import { accountApi } from '../../components/auth/auth-client';
import { selectedSessionCookie, contextualSessionCookie } from '../../config/session-context';

function storage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); } };
}
beforeEach(() => { vi.stubGlobal('sessionStorage', storage()); vi.stubGlobal('localStorage', storage()); });
afterEach(() => vi.unstubAllGlobals());

describe('tab account isolation', () => {
  it('retains a tab selection on reload and gives a new tab a separate context', () => {
    const firstTab = sessionStorage;
    const first = getAccountContext();
    expect(getAccountContext()).toBe(first);
    vi.stubGlobal('sessionStorage', storage());
    const second = getAccountContext();
    expect(second).not.toBe(first);
    setAccountContext(newAccountContext());
    vi.stubGlobal('sessionStorage', firstTab);
    expect(getAccountContext()).toBe(first);
    expect(accountChannel()).toBe(`carer-auth-${first}`);
  });
  it('remembers a default account without changing already-open tabs', () => {
    const firstTab = sessionStorage;
    const first = getAccountContext();
    vi.stubGlobal('sessionStorage', storage());
    const second = newAccountContext();
    setAccountContext(second, true);
    vi.stubGlobal('sessionStorage', firstTab);
    expect(getAccountContext()).toBe(first);
    forgetRememberedContext();
    vi.stubGlobal('sessionStorage', storage());
    expect(getAccountContext()).toBe(second);
    forgetRememberedContext();
    vi.stubGlobal('sessionStorage', storage());
    expect(getAccountContext()).not.toBe(second);
  });
  it('selects only the specified HttpOnly cookie, including production prefixes', () => {
    const a = newAccountContext(); const b = newAccountContext();
    const jar = `carer_session=legacy; carer_session_${a}=a; carer_session_${b}=b`;
    expect(selectedSessionCookie(jar, a)).toBe('carer_session=a');
    expect(selectedSessionCookie(jar, b)).toBe('carer_session=b');
    expect(selectedSessionCookie(jar, newAccountContext())).toBe('');
    expect(selectedSessionCookie(`__Host-carer_session_${a}=secure`, a)).toBe('__Host-carer_session=secure');
    expect(selectedSessionCookie(`carer_session_${a}=a; carer_session_${a}=b`, a)).toBe('');
    expect(contextualSessionCookie('__Host-carer_session=token; Path=/; HttpOnly; Secure; SameSite=Lax', a))
      .toBe(`__Host-carer_session_${a}=token; Path=/; HttpOnly; Secure; SameSite=Lax`);
  });
  it('sends the tab context and switches it only after a successful login', async () => {
    const original = getAccountContext();
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'Wrong password' }), { status: 401 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(accountApi('auth/login', { method: 'POST', body: {} })).rejects.toThrow('Wrong password');
    expect(getAccountContext()).toBe(original);
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ data: {} }), { status: 200 }));
    await accountApi('auth/login', { method: 'POST', body: {} });
    const selected = getAccountContext();
    expect(selected).not.toBe(original);
    await accountApi('auth/me');
    expect(fetchMock.mock.lastCall?.[1].headers['X-Account-Context']).toBe(selected);
    expect(sessionStorage.getItem('carer-account-context')).toBe(selected);
  });
});
