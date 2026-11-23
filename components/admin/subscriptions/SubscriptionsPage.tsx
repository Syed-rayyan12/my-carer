"use client";
import { useState } from 'react';
import { useAdminDashboard } from '../AdminDashboardContext';
import { mapSubscriptions, dateLabel } from '../admin-live';
import AdminPage from '../shared/AdminPage';
import AdminTabs from '../shared/AdminTabs';
import AdminModal from '../shared/AdminModal';
import SubscriptionStats from './SubscriptionStats';
import SubscriptionsTable from './SubscriptionsTable';
import SubscriptionsSkeleton from './SubscriptionsSkeleton';
import { filterSubscriptions } from './subscriptionsData';
export default function SubscriptionsPage() {
 const { snapshot, search, ready, mutate, busy } = useAdminDashboard();
 const [dateBounds] = useState(() => { const now = Date.now(); return { min: new Date(now).toISOString().slice(0,10), max: new Date(now+366*86400000).toISOString().slice(0,10) }; });
 const records = mapSubscriptions(snapshot); const [tab,setTab]=useState('All'); const [selectedId,setSelectedId]=useState<string|null>(null); const selected=records.find(item=>item.id===selectedId);
 if(!ready)return <SubscriptionsSkeleton/>;
 return <AdminPage title="Subscriptions" description="Manage memberships and verify manual payments."><SubscriptionStats records={records}/><section className="overflow-hidden rounded-xl border border-[#d9d9d9] bg-white"><AdminTabs tabs={['All','Active','Trial','Pending','Cancelled'].map(status=>({label:status,value:status,count:status==='All'?records.length:records.filter(item=>item.status===status).length}))} active={tab} onChange={setTab}/><SubscriptionsTable records={filterSubscriptions(records,tab,search)} onView={record=>setSelectedId(record.id)}/></section><p className="mt-3 text-xs text-[#61706c]">Membership activation is manual after payment verification. Card charges and refunds are not enabled.</p>{selected&&<AdminModal title="Membership details" onClose={()=>{if(!busy)setSelectedId(null);}}><form onSubmit={async event=>{event.preventDefault();const values=new FormData(event.currentTarget);const saved=await mutate(`platform/admin/memberships/${selected.id}`,{paidThrough:new Date(`${values.get('paidThrough')}T23:59:59Z`).toISOString(),paymentReference:String(values.get('paymentReference'))});if(saved)setSelectedId(null);}}><div className="space-y-4 px-6 pb-6"><h3 className="text-lg font-semibold">{selected.name}</h3><p>{selected.role} · {selected.status}</p><p className="text-sm">Paid through: {selected.paidThrough?dateLabel(selected.paidThrough):'Not activated'}</p><p className="break-all text-sm text-[#61706c]">Payment reference: {selected.transactionId}</p><label className="block text-sm">Payment covers through<input name="paidThrough" type="date" required min={dateBounds.min} max={dateBounds.max} className="mt-2 h-11 w-full rounded-lg border px-3"/></label><label className="block text-sm">Verified payment reference<input name="paymentReference" required maxLength={160} className="mt-2 h-11 w-full rounded-lg border px-3"/></label></div><footer className="flex justify-end gap-3 border-t bg-[#f4f6f5] px-6 py-4"><button type="button" disabled={busy} onClick={()=>setSelectedId(null)} className="rounded-lg border bg-white px-4 py-2">Cancel</button><button disabled={busy} className="rounded-lg bg-[#ff2f68] px-4 py-2 text-white disabled:opacity-50">{busy?'Saving…':'Activate membership'}</button></footer></form></AdminModal>}</AdminPage>;
}
