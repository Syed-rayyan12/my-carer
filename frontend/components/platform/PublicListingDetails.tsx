"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { accountApi, type AuthSession } from '@/components/auth/auth-client';
import { accountDestination } from '@/config/auth-routing';

export type PublicListing = {
  id: string; photo?: string; firstName?: string; lastName?: string; title?: string;
  location?: string; budgetPence?: number; createdAt?: string;
  professional?: { bio: string; location: string; hourlyRatePence: number; qualifications: string; services: string };
  verifications?: { kind: string }[];
};
type RequestDetails = { description: string; schedule: string; tasks: string; fundingType: string };
const money = (pence: number) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(pence / 100);

export default function PublicListingDetails({ item, caregivers, session, checking, accountError = '', onClose }: {
  item: PublicListing; caregivers: boolean; session: AuthSession | null; checking: boolean; accountError?: string; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [details, setDetails] = useState<RequestDetails | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);
  useEffect(() => {
    if (caregivers || !session) return;
    let active = true;
    accountApi<{ data: RequestDetails[] }>(`platform/requests?id=${encodeURIComponent(item.id)}`)
      .then(result => { if (active) { setDetails(result.data[0] ?? null); setError(''); } })
      .catch(issue => { if (active) setError(issue instanceof Error ? issue.message : 'Unable to load care request details.'); });
    return () => { active = false; };
  }, [caregivers, item.id, session?.user.id]);
  const name = caregivers ? `${item.firstName ?? ''} ${item.lastName ?? ''}`.trim() : item.title;
  const needsProfile = session?.user.role === 'CARE_SEEKER' && !session.user.profileComplete;
  const destination = session ? needsProfile ? accountDestination(session.user)
    : caregivers && session.user.role === 'CARE_SEEKER' ? '/care-seeker-dashboard/find-caregivers'
      : !caregivers && session.user.role === 'CAREGIVER' ? '/caregiver-dashboard/find-care-jobs'
        : accountDestination(session.user) : '/signin';
  const action = !session ? 'Sign in to continue' : needsProfile ? 'Complete your profile'
    : caregivers && session.user.role === 'CARE_SEEKER' ? 'Find caregivers in your dashboard'
      : !caregivers && session.user.role === 'CAREGIVER' ? 'Find jobs in your dashboard' : 'Return to your dashboard';
  return <dialog ref={dialog} aria-labelledby="public-listing-title" onCancel={event => { event.preventDefault(); onClose(); }} className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[760px] overflow-y-auto rounded-2xl border-0 bg-white p-0 font-nunito text-[#344054] shadow-[0_24px_80px_#10182833] backdrop:bg-[#101828]/50">
    <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-[#eaecf0] bg-white px-5 py-5 sm:px-6"><div><p className="mb-1 text-sm text-[#667085]">{caregivers ? 'Caregiver profile' : 'Care request'}</p><h2 id="public-listing-title" className="font-commissioner text-2xl font-bold">{name}</h2></div><button type="button" aria-label="Close listing details" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full border border-[#eaecf0] text-[#667085] hover:bg-[#f9fafb]"><X size={22} /></button></header>
    <div className="space-y-4 bg-[#f8fafb] p-4 sm:p-6">
      <dl className="grid grid-cols-2 gap-5 rounded-xl border border-[#eaecf0] bg-white p-5 max-[450px]:grid-cols-1"><div><dt className="text-sm text-[#667085]">Location</dt><dd className="mt-1.5 break-words text-sm font-semibold text-[#344054]">{item.professional?.location || item.location || 'Not provided'}</dd></div><div><dt className="text-sm text-[#667085]">{caregivers ? 'Hourly rate' : 'Budget per hour'}</dt><dd className="mt-1.5 break-words text-sm font-semibold text-[#344054]">{money(item.professional?.hourlyRatePence ?? item.budgetPence ?? 0)}</dd></div></dl>
      {caregivers ? <>
        <section className="rounded-xl border border-[#eaecf0] bg-white p-5"><h3 className="text-sm font-bold text-[#344054]">About</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{item.professional?.bio || 'No introduction provided.'}</p></section>
        {item.professional?.services && <section className="rounded-xl border border-[#eaecf0] bg-white p-5"><h3 className="font-bold">Care services</h3><p className="mt-2 whitespace-pre-wrap text-sm">{item.professional.services}</p></section>}
        {item.professional?.qualifications && <section className="rounded-xl border border-[#eaecf0] bg-white p-5"><h3 className="font-bold">Qualifications</h3><p className="mt-2 whitespace-pre-wrap text-sm">{item.professional.qualifications}</p></section>}
        {!!item.verifications?.length && <p className="text-sm text-green-700">Approved verification: {item.verifications.map(value => value.kind.replaceAll('_', ' ')).join(', ')}</p>}
      </> : <>
        {item.createdAt && <p className="text-sm text-[#667085]">Posted {new Date(item.createdAt).toLocaleDateString('en-GB')}</p>}
        {details && <>{[['Care needed', details.description], ['Schedule', details.schedule], ['Tasks', details.tasks], ['Funding', details.fundingType]].filter(([, value]) => value).map(([label, value]) => <section key={label} className="rounded-xl border border-[#eaecf0] bg-white p-5"><h3 className="font-bold">{label}</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6">{value}</p></section>)}</>}
        {!details && !error && <p className="text-sm text-[#667085]">{session ? 'Further details are available to eligible accounts.' : 'Sign in to see the care details available to your account.'}</p>}
      </>}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </div>
    <footer className="sticky bottom-0 flex justify-end border-t border-[#eaecf0] bg-white px-5 py-4 sm:px-6">{checking ? <p role="status">Checking account…</p> : accountError && !session ? <p role="status">{accountError}</p> : <Link href={destination} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#ff2f68] px-4 py-3 text-sm font-semibold text-white">{action}</Link>}</footer>
  </dialog>;
}
