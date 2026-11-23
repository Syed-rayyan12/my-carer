"use client";
import { useState } from 'react';
import { CheckCheck, Search, SlidersHorizontal } from 'lucide-react';
import { useNotifications } from './Notifications';
import NotificationTable, { notificationCategories, type NotificationItem } from './NotificationTable';
export default function NotificationsPage() {
  const { items, ready, error, busy, update, refresh } = useNotifications();
  const [status, setStatus] = useState('All'); const [category, setCategory] = useState('All types'); const [search, setSearch] = useState('');
  const matches = (n: NotificationItem, tab: string) => tab === 'Dismissed' ? n.dismissed : !n.dismissed && (tab === 'All' || (tab === 'Read' ? n.read : !n.read));
  const results = items.filter(n => matches(n, status) && (category === 'All types' || notificationCategories[n.kind] === category) && n.title.toLowerCase().includes(search.toLowerCase()));
  const unread = items.filter(n => !n.dismissed && !n.read).length;
  return <main className="mx-auto max-w-[1530px] px-8 pb-6 pt-2 font-nunito text-[#344054] max-[1250px]:px-6 max-[640px]:px-4">
    <header className="mb-6 flex min-h-[120px] flex-wrap items-center justify-between gap-4 rounded-xl border border-[#d9d9d9] bg-white px-5 py-[18px]"><div><h1 className="mb-1 font-commissioner text-[42px] font-bold leading-tight tracking-tight text-[#202925] max-[640px]:text-[32px]">Notifications</h1><p className="text-sm leading-6 text-[#667085]">Stay up to date with your messages, care offers and account activity.</p></div><button type="button" disabled={!ready || busy || !unread} onClick={() => void update('read-all')} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#ff2f68] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e92359] disabled:opacity-50"><CheckCheck size={17} />Mark all as read</button></header>
    {error && <p role="alert" className="mb-4 rounded-lg border border-[#fee4e2] bg-[#fff4f3] px-4 py-3 text-sm text-[#b42318]">{error} <button type="button" onClick={() => void refresh()} className="ml-2 font-semibold underline">Retry</button></p>}
    <section aria-label="Notifications" className="overflow-hidden rounded-xl border border-[#eaecf0] bg-white shadow-[0_2px_6px_#10182805]">
      <div className="flex gap-6 overflow-x-auto px-6" role="group" aria-label="Notification status">{['All', 'Unread', 'Read', 'Dismissed'].map(tab => <button type="button" key={tab} aria-pressed={status === tab} onClick={() => setStatus(tab)} className={`inline-flex min-h-[56px] shrink-0 items-center gap-2 border-b-2 px-1 text-sm font-semibold transition ${status === tab ? 'border-[#ff2f68] text-[#ff2f68]' : 'border-transparent text-[#667085] hover:text-[#344054]'}`}>{tab}<span className={`rounded-full px-2 py-0.5 text-xs ${status === tab ? 'bg-[#fff0f5] text-[#ff2f68]' : 'bg-[#f2f4f7] text-[#667085]'}`}>{items.filter(n => matches(n, tab)).length}</span></button>)}</div>
      <div className="flex flex-wrap items-center gap-3 border-t border-[#eaecf0] px-6 py-4"><label className="flex min-h-11 min-w-[200px] flex-1 items-center gap-2.5 rounded-lg border border-[#e4e7ec] bg-white px-3 focus-within:border-[#ff2f68] focus-within:ring-2 focus-within:ring-[#ff2f68]/10"><Search size={17} className="shrink-0 text-[#98a2b3]" /><input aria-label="Search notifications" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notifications..." className="w-full min-w-0 bg-transparent py-2 text-sm outline-none" /></label><label className="flex min-h-11 items-center gap-2 rounded-lg border border-[#e4e7ec] px-3"><SlidersHorizontal size={16} className="text-[#98a2b3]" /><select aria-label="Notification type" value={category} onChange={e => setCategory(e.target.value)} className="max-w-full bg-white py-2 text-sm outline-none">{['All types', ...new Set(items.map(n => notificationCategories[n.kind]).filter(Boolean))].map(c => <option key={c}>{c}</option>)}</select></label></div>
      <NotificationTable items={results} ready={ready} busy={busy} onUpdate={(action, id) => { void update(action, id); }} />
      <footer className="border-t border-[#eaecf0] bg-[#fcfcfd] px-6 py-4 text-xs text-[#667085]">{ready ? `${results.length} notification${results.length === 1 ? '' : 's'} in this view` : 'Loading your updates…'}</footer>
    </section>
  </main>;
}
