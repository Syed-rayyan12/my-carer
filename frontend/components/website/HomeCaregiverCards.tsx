"use client";
import { useEffect, useState } from 'react';
import { ArrowRight, Check, MapPin } from 'lucide-react';
import { accountApi, getSession, AuthApiError } from '@/components/auth/auth-client';
import CaregiverProfileModal from './CaregiverProfileModal';
import { listingCaregiverProfile } from '@/components/platform/listing-caregiver-profile';
import type { PublicListing } from '@/components/platform/PublicListingDetails';
import { accountDestination } from '@/config/auth-routing';
export function HomeCaregiverCard({ caregiver, onView }: { caregiver: PublicListing; onView: () => void }) {
  const name = `${caregiver.firstName ?? ''} ${caregiver.lastName ?? ''}`.trim();
  const services = caregiver.professional?.services.split(/[,\n]/).map(value => value.trim()).filter(Boolean) ?? [];
  const rate = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format((caregiver.professional?.hourlyRatePence ?? 0) / 100);
  return <article className="group/card flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#e3e5e8] bg-white p-2 shadow-[0_12px_30px_#10192914] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_#10192920]">
    <div className="relative flex h-[290px] items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#fff0f5] to-[#f3f4f6]">{caregiver.photo ? <img src={caregiver.photo} alt={name} className="h-full w-full object-cover" /> : <span className="grid size-28 place-items-center rounded-full bg-white font-commissioner text-4xl font-bold text-[#ff2f68]">{`${caregiver.firstName?.[0] ?? ''}${caregiver.lastName?.[0] ?? ''}`}</span>}{caregiver.verifications?.some(value => value.kind === 'DBS') && <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#027a48]"><Check size={14} />DBS verified</span>}</div>
    <div className="flex flex-1 flex-col px-2 pb-3 pt-5"><p className="mb-2 text-base font-bold text-[#ff2f68]">{rate} / hour</p><h3 className="mb-2 font-commissioner text-[22px] font-bold text-[#00171f]">{name}</h3><p className="mb-4 flex items-center gap-1.5 text-xs text-[#667085]"><MapPin size={14} className="shrink-0 text-[#ff2f68]" />{caregiver.professional?.location || 'Location not provided'}</p><div className="mb-4 flex flex-wrap gap-1.5">{services.slice(0, 4).map(service => <span key={service} className="rounded-full bg-[#eef0f2] px-3 py-1.5 text-xs text-[#344054]">{service}</span>)}</div>{caregiver.professional?.bio && <p className="mb-5 line-clamp-2 text-sm leading-6 text-[#667085]">{caregiver.professional.bio}</p>}<button type="button" onClick={onView} aria-haspopup="dialog" className="mt-auto inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-4 text-sm font-semibold text-white hover:bg-[#e92359]">View Profile<ArrowRight size={16} /></button></div>
  </article>;
}
export default function HomeCaregiverCards() {
  const [caregivers, setCaregivers] = useState<PublicListing[]>([]);
  const [selected, setSelected] = useState<PublicListing | null>(null);
  const [ready, setReady] = useState(false); const [error, setError] = useState('');
  useEffect(() => {
    let active = true; let generation = 0;
    const load = () => {
      const current = ++generation;
      accountApi<{ data: PublicListing[] }>('platform/directory?order=latest&limit=3')
        .then(result => { if (active && current === generation) { setCaregivers(result.data); setError(''); } })
        .catch(() => { if (active && current === generation) setError('Caregivers could not be loaded. Please refresh to try again.'); })
        .finally(() => { if (active && current === generation) setReady(true); });
    };
    load(); window.addEventListener('focus', load); window.addEventListener('pageshow', load);
    return () => { active = false; window.removeEventListener('focus', load); window.removeEventListener('pageshow', load); };
  }, []);
  return <><div className="mx-auto grid w-[calc(100%-40px)] max-w-[1180px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {!ready && Array.from({ length: 3 }, (_, index) => <div key={index} aria-hidden="true" className="h-[440px] animate-pulse rounded-2xl bg-[#f2f4f7]" />)}
    {error && <p role="alert" className="col-span-full py-8 text-center text-sm text-red-700">{error}</p>}
    {ready && !error && !caregivers.length && <p className="col-span-full py-10 text-center text-sm text-[#667085]">New caregiver profiles will appear here once approved.</p>}
    {caregivers.map(caregiver => <HomeCaregiverCard key={caregiver.id} caregiver={caregiver} onView={() => setSelected(caregiver)} />)}
  </div>{selected && <CaregiverProfileModal open profile={listingCaregiverProfile(selected)} onClose={() => setSelected(null)} onContact={async () => {
    try { const { user } = await getSession(true); window.location.assign(user.role === 'CARE_SEEKER' && user.profileComplete ? '/care-seeker-dashboard/find-caregivers' : accountDestination(user)); }
    catch (issue) { if (issue instanceof AuthApiError && issue.statusCode === 401) window.location.assign('/signin'); else setError(issue instanceof Error ? issue.message : 'Unable to open your account.'); }
  }} />}</>;
}
