"use client";
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import CaregiverProfileBody from './CaregiverProfileBody';
import type { CaregiverProfile } from '@/components/website/CaregiverProfileModal';
import type { PublicCaregiverProfile } from '@/config/caregiver-public-profile';
import { accountApi } from '@/components/auth/auth-client';

type Props = { open?: boolean; inline?: boolean; onClose: () => void; profile?: CaregiverProfile;
  onContact?: (profile: CaregiverProfile) => void;
  onFavouriteChange?: (saved: boolean, profile: CaregiverProfile) => void; saved?: boolean };
export default function FullCaregiverProfileModal(props: Props) {
  return props.open && props.profile ? <ProfileDialog key={props.profile.id ?? props.profile.name} {...props} profile={props.profile} /> : null;
}
function ProfileDialog({ profile, onClose, onContact, onFavouriteChange, saved = false, inline = false }: Props & { profile: CaregiverProfile }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [data, setData] = useState<PublicCaregiverProfile | null>(null);
  const remote = !!profile.id && /^[a-f0-9-]{36}$/.test(profile.id);
  const [loading, setLoading] = useState(remote);
  const [error, setError] = useState('');
  useEffect(() => {
    if (inline) return;
    ref.current?.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [inline]);
  useEffect(() => {
    if (!remote) return;
    let active = true;
    accountApi<{ data: PublicCaregiverProfile }>(`platform/directory/${profile.id}`)
      .then(result => { if (active) setData(result.data); })
      .catch(issue => { if (active) setError(issue instanceof Error ? issue.message : 'Unable to load profile.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [profile.id, remote]);
  const content = <>
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#eaecf0] bg-white px-5 py-4 sm:px-6"><div><p className="mb-0.5 text-xs font-medium text-[#98a2b3]">Profile details</p><h2 id="caregiver-profile-title" className="font-commissioner text-xl font-bold text-[#202925]">Caregiver profile</h2></div>{!inline && <button type="button" aria-label="Close caregiver profile" onClick={onClose} className="grid size-9 shrink-0 place-items-center rounded-full border border-[#eaecf0] text-[#667085] transition hover:bg-[#f9fafb]"><X size={19} /></button>}</header>
    {loading ? <div role="status" className="space-y-4 bg-[#f8fafb] p-6"><div className="h-28 animate-pulse rounded-xl bg-[#eaecf0]" /><div className="h-48 animate-pulse rounded-xl bg-[#eaecf0]" /><p className="text-sm text-[#667085]">Loading full caregiver profile?</p></div> : error ? <p role="alert" className="m-6 rounded-xl border border-[#fee4e2] bg-[#fff4f3] p-4 text-sm text-[#b42318]">{error}</p> : <CaregiverProfileBody data={data} profile={profile} saved={saved} onContact={onContact} onFavouriteChange={onFavouriteChange} />}
  </>;
  return inline ? <div className="overflow-hidden rounded-xl border border-[#eaecf0] bg-white text-[#101929]">{content}</div> : <dialog ref={ref} aria-labelledby="caregiver-profile-title" onCancel={event => { event.preventDefault(); onClose(); }} className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[960px] overflow-y-auto rounded-2xl border-0 bg-white p-0 font-nunito text-[#101929] shadow-[0_24px_80px_#10182833] backdrop:bg-[#101828]/50">{content}</dialog>;
}
