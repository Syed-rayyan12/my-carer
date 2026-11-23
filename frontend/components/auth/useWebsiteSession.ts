"use client";
import { useEffect, useState } from 'react';
import { AuthApiError, getSession, type AuthSession } from './auth-client';
import { accountChannel } from './tab-session';

// Public pages retain the current tab's account without requiring a login.
export function useWebsiteSession() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    let generation = 0;
    const check = async (activity = false) => {
      const current = ++generation;
      try {
        const value = await getSession(activity);
        if (active && current === generation) { setSession(value); setError(''); }
      } catch (issue) {
        if (!active || current !== generation) return;
        if (issue instanceof AuthApiError && [401, 403].includes(issue.statusCode)) { setSession(null); setError(''); }
        else setError('Unable to check your account. Refresh to try again.');
      } finally { if (active && current === generation) setReady(true); }
    };
    void check(true);
    const focus = () => { if (document.visibilityState === 'visible') void check(true); };
    const restored = () => { void check(); };
    const timer = window.setInterval(() => { if (document.visibilityState === 'visible') void check(); }, 60000);
    const channel = new BroadcastChannel(accountChannel());
    channel.onmessage = restored;
    window.addEventListener('focus', focus);
    window.addEventListener('pageshow', restored);
    window.addEventListener('popstate', restored);
    return () => {
      active = false; generation++;
      clearInterval(timer); channel.close();
      window.removeEventListener('focus', focus);
      window.removeEventListener('pageshow', restored);
      window.removeEventListener('popstate', restored);
    };
  }, []);
  return { session, ready, error };
}
