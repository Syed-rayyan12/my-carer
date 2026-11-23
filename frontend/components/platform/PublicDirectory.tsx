"use client";
import { useEffect, useState } from 'react';
import { MapPin, HeartHandshake, Check, Search, CalendarDays } from 'lucide-react';
import { accountApi } from '@/components/auth/auth-client';
import { useWebsiteSession } from '@/components/auth/useWebsiteSession';
import PublicListingDetails, { type PublicListing } from './PublicListingDetails';
import CaregiverProfileModal from '@/components/website/CaregiverProfileModal';
import { listingCaregiverProfile } from './listing-caregiver-profile';
import { accountDestination } from '@/config/auth-routing';
type Listing = PublicListing;
export default function PublicDirectory({caregivers=false}:{caregivers?:boolean}) {
  const account = useWebsiteSession();
  const [selected, setSelected] = useState<Listing | null>(null);
  const [items,setItems]=useState<Listing[]>([]); const [search,setSearch]=useState(''); const [error,setError]=useState('');const [loaded,setLoaded]=useState(false);
  useEffect(()=>{let active=true;const timer=setTimeout(()=>{accountApi<{data:Listing[]}>(`platform/${caregivers?'directory?search='+encodeURIComponent(search):'open-requests?limit=100'}`).then(r=>{if(active){setItems(r.data);setError('');}}).catch(()=>{if(active)setError('Listings could not be loaded. Please refresh.');}).finally(()=>{if(active)setLoaded(true);});},caregivers?250:0);return()=>{active=false;clearTimeout(timer);};},[caregivers,search]);
  const filtered=caregivers?items:items.filter(item=>`${item.title} ${item.location}`.toLowerCase().includes(search.toLowerCase()));
  const money=(pence:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(pence/100);
  return <section className="bg-white py-8"><div className="mx-auto w-[calc(100%-40px)] max-w-[1180px]"><label className="mb-7 flex items-center gap-3 rounded-xl border border-[#e3e5e8] bg-[#fafafa] px-4"><Search className="shrink-0 text-[#ff2f68]" size={20}/><input aria-label={caregivers?'Search caregivers':'Search care requests'} type="search" placeholder={caregivers?'Search by name, postcode, location or service':'Search care requests by title or location'} value={search} onChange={e=>setSearch(e.target.value)} className="min-w-0 flex-1 bg-transparent py-4 outline-none" /></label>
  {error&&<p role="alert" className="mb-5 text-red-700">{error}</p>}{!loaded&&<p role="status">Loading listings </p>}{loaded&&!error&&!filtered.length&&<p className="py-10 text-center text-slate-600">No matching listings yet.</p>}
  <div className={`grid gap-5 ${caregivers?'sm:grid-cols-2 lg:grid-cols-3':'lg:grid-cols-2'}`}>{filtered.map(item=>{
    const name=caregivers?`${item.firstName??''} ${item.lastName??''}`.trim():item.title;
    const services=item.professional?.services.split(/[,\n]/).filter(Boolean)??[];
    return <article key={item.id} className="flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#e3e5e8] bg-white p-2 shadow-[0_12px_30px_rgba(16,25,41,0.08)]">
      {caregivers&&<div className="relative flex h-[230px] items-center justify-center rounded-xl bg-gradient-to-br from-[#fff0f5] to-[#f3f4f6]">{item.photo ? <img src={item.photo} alt={name} className="h-full w-full object-cover"/> : <span className="flex size-28 items-center justify-center rounded-full bg-white font-commissioner text-4xl font-bold text-[#ff2f68]">{`${item.firstName?.[0]??''}${item.lastName?.[0]??''}`}</span>}{!!item.verifications?.length&&<span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-green-700"><Check size={15}/>Verified</span>}</div>}
      <div className="flex flex-1 flex-col p-4"><p className="mb-2 font-bold text-[#ff2f68]">{money(item.professional?.hourlyRatePence??item.budgetPence??0)} / hour</p><h2 className="mb-3 font-commissioner text-[22px] font-bold leading-tight text-[#00171f]">{name}</h2><p className="mb-4 flex items-center gap-2 text-sm text-slate-600"><MapPin size={16} className="shrink-0 text-[#ff2f68]"/>{item.professional?.location||item.location||'Location not provided'}</p>
      {!caregivers&&item.createdAt&&<p className="mb-4 flex items-center gap-2 text-sm text-slate-500"><CalendarDays size={16}/>{new Date(item.createdAt).toLocaleDateString('en-GB')}</p>}
      {!!services.length&&<div className="mb-4 flex flex-wrap gap-2">{services.slice(0,4).map(service=><span key={service} className="rounded-full bg-[#eef0f2] px-3 py-1.5 text-xs">{service.trim()}</span>)}</div>}
      {item.professional?.bio&&<p className="mb-5 line-clamp-3 text-sm leading-6 text-slate-600">{item.professional.bio}</p>}
      <div className="mt-auto border-t border-[#eaecf0] pt-4"><button type="button" onClick={() => setSelected(item)} aria-haspopup="dialog" className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-4 py-3 font-semibold text-white"><HeartHandshake size={18}/>{caregivers?'View caregiver profile':'View care request'}</button></div></div>
    </article>;
  })}</div></div>{selected && (caregivers ? <CaregiverProfileModal open profile={listingCaregiverProfile(selected)} onClose={() => setSelected(null)} onContact={account.ready && !account.error ? () => {
    window.location.assign(account.session ? account.session.user.role === 'CARE_SEEKER' && account.session.user.profileComplete ? '/care-seeker-dashboard/find-caregivers' : accountDestination(account.session.user) : '/signin');
  } : undefined} /> : <PublicListingDetails key={`${selected.id}:${account.session?.user.id ?? 'guest'}`} item={selected} caregivers={false} session={account.session} checking={!account.ready} accountError={account.error} onClose={() => setSelected(null)} />)}</section>;
}
