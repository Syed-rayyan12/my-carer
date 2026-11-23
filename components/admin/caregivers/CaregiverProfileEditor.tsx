"use client";
import { useState, type ReactNode } from 'react';
import { CalendarDays, Plus, Trash2, UserRound, BriefcaseBusiness, Award } from 'lucide-react';
import { getAdminCaregiverProfile, type AdminCaregiver } from './adminCaregiverData';
import WeeklyScheduleEditor from '@/components/shared/WeeklyScheduleEditor';
import { availabilitySchedule, weeklyAvailability, availabilitySummary, validateWeeklySchedule } from '@/components/caregiver-dashboard/preview/availabilityData';
import { careServiceCatalog } from '@/components/caregiver-dashboard/services/careServicesData';
function Group({ title, description, icon, children }: { title: string; description: string; icon: ReactNode; children: ReactNode }) {
  return <section className="rounded-xl border border-[#eaecf0] bg-white p-4 sm:p-5"><div className="mb-5 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#fff0f5] text-[#ff2f68]">{icon}</span><div><h3 className="text-sm font-bold text-[#344054]">{title}</h3><p className="mt-1 text-xs leading-5 text-[#98a2b3]">{description}</p></div></div>{children}</section>;
}
export default function CaregiverProfileEditor({ caregiver, onCancel, onSave }: { caregiver: AdminCaregiver; onCancel: () => void; onSave: (caregiver: AdminCaregiver) => void | Promise<void> }) {
  const profile = getAdminCaregiverProfile(caregiver);
  const [draft, setDraft] = useState({ name: caregiver.name, phone: profile.phone, location: caregiver.location, rate: String(profile.hourlyRate) });
  const [weekly, setWeekly] = useState(() => availabilitySchedule(profile.availabilitySchedule ?? { days: [], start: '09:00', end: '18:00' }));
  const [hasSchedule, setHasSchedule] = useState(!!profile.availabilitySchedule);
  const [minimumVisit, setMinimumVisit] = useState(profile.availabilitySchedule?.minimumVisitMinutes ?? 30);
  const [careTypes, setCareTypes] = useState(profile.careTypes);
  const [service, setService] = useState('');
  const [qualifications, setQualifications] = useState(profile.qualifications);
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const input = 'mt-1.5 h-11 w-full rounded-lg border border-[#e4e7ec] bg-white px-3 text-sm font-normal text-[#344054] outline-none transition focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10';
  const label = 'block text-xs font-semibold text-[#475467]';
  const addService = () => { const value = service.trim(); if (value && !careTypes.includes(value)) setCareTypes([...careTypes, value]); setService(''); };
  return <form onSubmit={async event => {
    event.preventDefault(); if (busy) return;
    if (!draft.name.trim() || !draft.location.trim()) { setError('Please complete the name and location.'); return; }
    if (!careTypes.length) { setError('Add at least one care service.'); return; }
    if (hasSchedule) { const issue = validateWeeklySchedule(weekly); if (issue) { setError(issue); return; } }
    const schedule = { ...weeklyAvailability(weekly), minimumVisitMinutes: minimumVisit };
    setError(''); setBusy(true);
    try { await onSave({ ...caregiver, name: draft.name.trim(), initials: draft.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('').toUpperCase(), location: draft.location.trim(), profile: { ...profile, phone: draft.phone.trim(), hourlyRate: Number(draft.rate), careTypes, qualifications: [...new Set(qualifications.map(value => value.trim()).filter(Boolean))], availability: hasSchedule ? availabilitySummary(schedule) : profile.availability, ...(hasSchedule ? { availabilitySchedule: schedule } : {}) } }); }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'Unable to save this profile.'); }
    finally { setBusy(false); }
  }}>
    <div className="space-y-5 bg-[#f8fafb] p-4 sm:p-6">
      <Group title="Account & contact" description="The caregiver’s identity and contact information." icon={<UserRound size={18} />}><div className="grid gap-4 sm:grid-cols-2"><label className={label}>Full name<input required maxLength={160} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className={input} /></label><label className={label}>Phone number<input type="tel" required value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} className={input} /></label><label className={label}>Town / city<input required maxLength={120} value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} className={input} /></label><div><p className={label}>Sign-in email</p><p className="mt-1.5 flex min-h-11 items-center break-all rounded-lg bg-[#f2f4f7] px-3 text-sm text-[#667085]">{caregiver.email}</p></div></div></Group>
      <Group title="Professional details" description="Rates and the care services shown on this profile." icon={<BriefcaseBusiness size={18} />}><div className="mb-5 grid grid-cols-2 gap-4"><label className={label}>Hourly rate (£)<input type="number" required min={0} max={1000} step="0.01" value={draft.rate} onChange={e => setDraft({ ...draft, rate: e.target.value })} className={input} /></label><div><p className={label}>Experience</p><p className="mt-1.5 flex min-h-11 items-center rounded-lg bg-[#f2f4f7] px-3 text-sm text-[#667085]">{profile.experience} years</p></div></div><p className={`${label} mb-2`}>Care services</p><div className="mb-3 flex flex-wrap gap-2">{careTypes.map(type => <span key={type} className="inline-flex items-center gap-2 rounded-full bg-[#fff0f5] py-1.5 pl-3 pr-2 text-xs font-medium text-[#d92358]">{type}<button type="button" aria-label={`Remove ${type}`} onClick={() => setCareTypes(careTypes.filter(value => value !== type))} className="rounded-full p-0.5 hover:bg-[#ffdbe6]"><Trash2 size={12} /></button></span>)}</div><div className="flex gap-2"><input aria-label="Add care service" list="admin-care-service-options" placeholder="Choose or enter a care service" maxLength={100} value={service} onChange={e => setService(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addService(); } }} className={`${input} mt-0!`} /><datalist id="admin-care-service-options">{careServiceCatalog.map(item => <option key={item.id} value={item.name} />)}</datalist><button type="button" onClick={addService} disabled={!service.trim()} className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-lg border border-[#ffc1d4] px-3 text-xs font-semibold text-[#ff2f68] disabled:opacity-50"><Plus size={15} />Add</button></div></Group>
      <Group title="Weekly availability" description="Choose available days and set up to two time slots per day." icon={<CalendarDays size={18} />}>
        {!hasSchedule && profile.availability && <p className="mb-4 rounded-lg bg-[#f2f4f7] p-3 text-xs leading-6 text-[#667085]"><strong className="font-semibold">Current availability:</strong> {profile.availability}</p>}
        <WeeklyScheduleEditor value={weekly} onChange={value => { setWeekly(value); setHasSchedule(true); }} />
        <label className={`${label} mt-4 max-w-[240px]`}>Minimum visit duration<select value={minimumVisit} onChange={e => { setMinimumVisit(Number(e.target.value)); setHasSchedule(true); }} className={input}>{[...new Set([30, 45, 60, 90, 120, 180, 240, 480, 1440, minimumVisit])].sort((a, b) => a - b).map(value => <option key={value} value={value}>{value < 60 ? `${value} minutes` : `${value / 60} hour${value === 60 ? '' : 's'}`}</option>)}</select></label>
      </Group>
      <Group title="Qualifications" description="Add each qualification as a separate entry." icon={<Award size={18} />}><div className="space-y-3">{qualifications.map((value, index) => <div key={index} className="flex items-center gap-2"><input aria-label={`Qualification ${index + 1}`} value={value} maxLength={250} placeholder="e.g. NVQ Level 3 Health & Social Care" onChange={e => setQualifications(qualifications.map((item, i) => i === index ? e.target.value : item))} className={`${input} mt-0!`} /><button type="button" aria-label={`Remove qualification ${index + 1}`} onClick={() => setQualifications(qualifications.filter((_, i) => i !== index))} className="grid size-10 shrink-0 place-items-center rounded-lg text-[#98a2b3] hover:bg-[#fff1f0] hover:text-red-600"><Trash2 size={16} /></button></div>)}</div><button type="button" onClick={() => setQualifications([...qualifications, ''])} className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff2f68]"><Plus size={15} />Add qualification</button></Group>
      {error && <p role="alert" className="rounded-lg border border-[#fee4e2] bg-[#fff4f3] p-3 text-sm text-[#b42318]">{error}</p>}
    </div>
    <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-[#eaecf0] bg-white px-6 py-4"><button type="button" disabled={busy} onClick={onCancel} className="min-h-11 rounded-lg border border-[#e4e7ec] px-5 text-sm font-semibold text-[#475467] hover:bg-[#f9fafb] disabled:opacity-50">Cancel</button><button type="submit" disabled={busy} className="min-h-11 rounded-lg bg-[#ff2f68] px-5 text-sm font-semibold text-white hover:bg-[#e92359] disabled:opacity-50">{busy ? 'Saving…' : 'Save changes'}</button></footer>
  </form>;
}
