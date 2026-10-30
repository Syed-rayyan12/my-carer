import { Skeleton } from "@/components/dashboard/loading/DashboardSkeleton";

export function AdminCaregiversTableSkeleton({ label = "Loading caregiver accounts" }: { label?: string } = {}) {
  return <div className="overflow-hidden rounded-xl border border-[#d9d9d9] bg-white" role="status" aria-busy="true"><span className="sr-only">{label}</span><div aria-hidden="true"><div className="grid grid-cols-5 gap-5 border-b border-[#e3e5e7] px-4 py-5">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-4" />)}</div>{Array.from({ length: 8 }, (_, index) => <div className="flex min-h-[65px] items-center gap-4 border-b border-[#e3e5e7] px-4 py-3 last:border-b-0" key={index}><Skeleton className="size-9 shrink-0 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-36 max-w-full" /><Skeleton className="h-3 w-48 max-w-full" /></div><Skeleton className="h-4 w-20 max-[700px]:hidden" /><Skeleton className="h-5 w-20 rounded-full" /><Skeleton className="h-5 w-20 rounded-full max-[500px]:hidden" /><Skeleton className="h-4 w-10" /></div>)}</div></div>;
}

export default function AdminCaregiversSkeleton({ label = "Loading caregiver accounts" }: { label?: string } = {}) {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><div className="mb-6 min-h-[120px] rounded-xl border border-[#d9d9d9] bg-white p-5" aria-hidden="true"><Skeleton className="mb-3 h-12 w-64 max-w-full" /><Skeleton className="h-4 w-80 max-w-full" /></div><div className="mb-6 rounded-xl border border-[#d9d9d9] bg-white p-4" aria-hidden="true"><Skeleton className="h-10 w-full" /></div><AdminCaregiversTableSkeleton label={label} /></main>;
}
