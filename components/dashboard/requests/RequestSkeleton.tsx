import { Skeleton } from "../loading/DashboardSkeleton";

export function RequestListSkeleton() {
  return <div className="overflow-hidden rounded-[11px] border border-[#d9d9d9] bg-white" role="status" aria-busy="true"><span className="sr-only">Loading your requests</span><div aria-hidden="true"><div className="flex gap-6 border-b border-[#ececf0] px-5 py-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-5 w-20" />)}</div>{Array.from({ length: 3 }, (_, index) => <div className="flex min-h-[125px] items-center justify-between gap-6 border-b border-[#e5e2dc] px-5 py-6 last:border-0" key={index}><div className="flex-1 space-y-2.5"><Skeleton className="h-6 w-3/5 max-w-72" /><Skeleton className="h-3 w-36" /><Skeleton className="h-4 w-4/5 max-w-96" /></div><Skeleton className="h-4 w-40 max-[900px]:hidden" /><Skeleton className="h-10 w-40 max-[550px]:w-24" /></div>)}</div></div>;
}

export function ResponseListSkeleton() {
  return <div className="overflow-hidden rounded-2xl border border-[#e5e2dc] bg-white" role="status" aria-busy="true"><span className="sr-only">Loading caregiver responses</span><div aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex min-h-28 items-center gap-4 border-b border-[#e5e2dc] px-5 py-6 last:border-0"><Skeleton className="size-14 shrink-0 rounded-full" /><div className="flex-1 space-y-2.5"><Skeleton className="h-5 w-40 max-w-full" /><Skeleton className="h-4 w-56 max-w-full" /><Skeleton className="h-4 w-44 max-w-full" /></div><div className="flex gap-2 max-[800px]:hidden"><Skeleton className="h-10 w-28" /><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div></div>)}</div></div>;
}

export default function RequestSkeleton({ responses = false }: { responses?: boolean }) {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><div className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-6" aria-hidden="true"><Skeleton className="mb-3 h-10 w-96 max-w-full" /><Skeleton className="h-4 w-3/5" /></div>{responses ? <ResponseListSkeleton /> : <RequestListSkeleton />}</main>;
}
