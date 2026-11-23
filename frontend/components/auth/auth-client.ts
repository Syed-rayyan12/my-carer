import { getAccountContext, newAccountContext, setAccountContext, forgetRememberedContext } from './tab-session';
export type AuthUser = { id: string; firstName: string; lastName: string; email: string; role: 'CARE_SEEKER' | 'ADMIN' | 'CAREGIVER'; status: 'ACTIVE'; profileComplete: boolean; accountCategory?:string|null };
export type AuthSession = { user: AuthUser; csrfToken: string };
export class AuthApiError extends Error { constructor(message: string, public statusCode: number) { super(message); } }
export async function accountApi<T>(path: string, options: { method?: 'POST' | 'PATCH' | 'DELETE'; body?: unknown; csrfToken?: string; activity?: boolean; accountContext?: string } = {}): Promise<T> {
  const context = options.accountContext ?? (['auth/login', 'auth/signup'].includes(path) ? newAccountContext() : getAccountContext());
  const result = await fetch(`/api/${path}`, { method: options.method ?? 'GET', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-Account-Context': context, ...(options.activity ? { 'X-Session-Activity': '1' } : {}), ...(options.csrfToken ? { 'X-CSRF-Token': options.csrfToken } : {}) }, body: options.body === undefined ? undefined : JSON.stringify(options.body) });
  const payload = await result.json();
  if (!result.ok) throw new AuthApiError(payload.message ?? 'Request failed. Please try again.', result.status);
  if (path === 'auth/login') setAccountContext(context, (options.body as { remember?: boolean })?.remember === true);
  if (['auth/logout', 'auth/password'].includes(path)) forgetRememberedContext();
  return payload as T;
}
export const getSession = async (activity = false) => (await accountApi<{ data: AuthSession }>('auth/me', { activity })).data;
