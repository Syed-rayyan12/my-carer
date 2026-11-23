"use client";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthBoundary';
import { accountApi } from '@/components/auth/auth-client';
import DashboardNotificationMenu from './DashboardNotificationMenu';
type Notification = { id: string; title: string; kind: string; time: string; href: string; read: boolean; dismissed: boolean };
function useNotificationState() {
  const auth = useAuth()!;
  const [items, setItems] = useState<Notification[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    try { const r = await accountApi<{ data: Notification[] }>('platform/notifications'); setItems(r.data); setError(''); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to load notifications'); }
    finally { setReady(true); }
  }, []);
  useEffect(() => {
    // The initial refresh updates state after the HTTP request settles.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh(); const poll = () => { if (document.visibilityState === 'visible') void refresh(); };
    const timer = window.setInterval(poll, 30000); window.addEventListener('focus', poll);
    return () => { clearInterval(timer); window.removeEventListener('focus', poll); };
  }, [refresh]);
  const update = async (action: 'read' | 'unread' | 'dismiss' | 'restore' | 'read-all', id?: string) => {
    if (busy) return;
    setBusy(true);
    try { await accountApi('platform/notifications', { method: 'PATCH', body: { action, id }, csrfToken: auth.csrfToken }); await refresh(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to update notification'); }
    finally { setBusy(false); }
  };
  const root = auth.user.role === 'ADMIN' ? '/admin-dashboard' : auth.user.role === 'CAREGIVER' ? '/caregiver-dashboard' : '/care-seeker-dashboard';
  return { items, ready, error, busy, update, root, refresh };
}
const Context = createContext<ReturnType<typeof useNotificationState> | null>(null);
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const value = useNotificationState(); return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function NotificationBell({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const { items, ready, update, root } = useContext(Context)!;
  const visible = items.filter(n => !n.dismissed); const unread = visible.filter(n => !n.read).length;
  return <DashboardNotificationMenu open={open} onToggle={onToggle} loading={!ready}
    unreadCount={unread} markAllDisabled={!unread} viewAllHref={`${root}/notifications`}
    items={visible.slice(0, 5).map(n => ({ id: n.id, text: n.title, time: new Date(n.time).toLocaleString('en-GB'), href: n.href, icon: Bell, unread: !n.read }))}
    onMarkAllRead={() => void update('read-all')} onItemClick={id => void update('read', id)} onRemove={id => void update('dismiss', id)} />;
}
export const useNotifications = () => useContext(Context)!;
export { default } from './NotificationsPage';
