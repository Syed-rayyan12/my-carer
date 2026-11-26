"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { accountApi, AuthApiError, getSession, type AuthSession } from './auth-client';
import { NotificationsProvider } from '@/components/dashboard/Notifications';
import { accountChannel } from './tab-session';
import { accountDestination } from '@/config/auth-routing';
import BillingBoundary from './BillingBoundary';
const AuthContext = createContext<AuthSession | null>(null);
export const useAuth = () => useContext(AuthContext);
export function AuthBoundary({ role, children }: { role: 'ADMIN' | 'CARE_SEEKER' | 'CAREGIVER'; children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null); const [error, setError] = useState('');
  useEffect(() => {
    let active = true; const signin = role === 'ADMIN' ? '/admin/signin' : '/signin';
    const check = async (activity = false) => {
      try { const next = await getSession(activity); if (!active) return; if (next.user.role !== role) { window.location.replace(accountDestination(next.user)); return; } setSession(next); setError(''); }
      catch (issue) { if (!active) return; setSession(null); if (issue instanceof AuthApiError && [401, 403].includes(issue.statusCode)) window.location.replace(signin); else setError('Unable to verify your session. Please refresh to try again.'); }
    };
    void check(true); const focus = () => { void check(true); };
    const pageshow = (event: PageTransitionEvent) => { if (event.persisted) { setSession(null); void check(); } };
    window.addEventListener('focus', focus); window.addEventListener('pageshow', pageshow); const interval = window.setInterval(() => { void check(); }, 60000);
    let lastActivity = Date.now();
    const activity = () => { if (Date.now() - lastActivity > 60000) { lastActivity = Date.now(); void check(true); } };
    window.addEventListener('pointerdown', activity); window.addEventListener('keydown', activity);
    const channel = new BroadcastChannel(accountChannel()); channel.onmessage = () => { setSession(null); window.location.replace(signin); };
    return () => { active = false; window.removeEventListener('pointerdown', activity); window.removeEventListener('keydown', activity); clearInterval(interval); channel.close(); window.removeEventListener('focus', focus); window.removeEventListener('pageshow', pageshow); };
  }, [role]);
  if (!session) return <main className="grid min-h-screen place-items-center bg-[#fff7f9] p-6"><p role="status">{error || 'Checking your session…'}</p></main>;
  return <AuthContext.Provider value={session}><BillingBoundary key={session.user.id} session={session}><NotificationsProvider key={session.user.id}><div>{children}</div></NotificationsProvider></BillingBoundary></AuthContext.Provider>;
}
export function LogoutButton({ className, children = 'Logout' }: { className?: string; children?: ReactNode }) {
  const session = useAuth(); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  return <><button type="button" className={className} disabled={busy} onClick={async () => {
    setBusy(true); setError('');
    try { const current = session ?? await getSession(); await accountApi('auth/logout', { method: 'POST', body: {}, csrfToken: current.csrfToken }); const channel = new BroadcastChannel(accountChannel()); channel.postMessage('logout'); channel.close(); window.location.replace(current.user.role === 'ADMIN' ? '/admin/signin' : '/signin'); }
    catch (issue) { if (issue instanceof AuthApiError && issue.statusCode === 401) { window.location.replace('/signin'); return; } setError('Unable to log out. Please try again.'); setBusy(false); }
  }}>{busy ? 'Signing out…' : children}</button>{error && <p role="alert" className="text-xs text-red-600">{error}</p>}</>;
}
