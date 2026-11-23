import { Skeleton } from "@/components/dashboard/loading/DashboardSkeleton";

export function AdminRegistrationsSkeleton() {
  return <div className="overflow-hidden rounded-xl border border-[#d9d9d9] bg-white" role="status" aria-busy="true"><span className="sr-only">Loading recent registrations</span><div aria-hidden="true"><div className="border-b border-[#ececf0] px-5 py-4"><Skeleton className="mb-2 h-5 w-56" /><Skeleton className="h-3 w-40" /></div><div className="grid grid-cols-5 gap-4 px-4 py-5">{Array.from({ length: 5 }, (_, i) => <Skeleton className="h-3" key={i} />)}</div>{Array.from({ length: 5 }, (_, i) => <div className="flex gap-4 border-t border-[#ececf0] p-4" key={i}><Skeleton className="size-7 shrink-0 rounded-full" /><Skeleton className="h-6 flex-1" /><Skeleton className="h-6 w-20" /><Skeleton className="h-7 w-32 max-[700px]:hidden" /></div>)}</div></div>;
}

export function AdminActivitySkeleton() {
  return <div className="rounded-xl border border-[#e3e5e8] bg-white p-5" role="status" aria-busy="true"><span className="sr-only">Loading recent admin activity</span><div aria-hidden="true"><Skeleton className="mb-6 h-6 w-40" />{Array.from({ length: 5 }, (_, i) => <div className="mb-5 flex gap-3" key={i}><Skeleton className="size-8 shrink-0 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4" /><Skeleton className="h-3 w-20" /></div></div>)}</div></div>;
}

export default function AdminDashboardSkeleton() {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4"><div aria-hidden="true" className="mb-6 rounded-xl border border-[#d9d9d9] bg-white p-5"><Skeleton className="mb-3 h-12 w-3/5" /><Skeleton className="h-4 w-80 max-w-full" /></div><div aria-hidden="true" className="mb-6 grid grid-cols-5 gap-2 max-[1000px]:grid-cols-3 max-[600px]:grid-cols-2">{Array.from({ length: 5 }, (_, i) => <div key={i} className="rounded-xl border border-[#d9d9d9] bg-white p-3"><Skeleton className="mb-3 h-4 w-4/5" /><Skeleton className="mb-3 h-8 w-20" /><Skeleton className="h-3 w-full" /></div>)}</div><div className="grid grid-cols-[minmax(0,2.08fr)_minmax(290px,1fr)] gap-6 max-[1250px]:grid-cols-1"><AdminRegistrationsSkeleton /><AdminActivitySkeleton /></div></main>;
}
