import { Skeleton } from "../loading/DashboardSkeleton";

export function MessageListSkeleton() {
  return <div className="overflow-hidden rounded-xl border border-[#d9d9d9] bg-white" role="status" aria-busy="true"><span className="sr-only">Loading messages</span><div aria-hidden="true"><div className="flex gap-6 border-b border-[#ececf0] px-6 py-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-5 w-20" />)}</div>{Array.from({ length: 4 }, (_, index) => <div key={index} className="flex min-h-32 items-center gap-4 border-b border-[#e5e2dc] px-6 py-6 last:border-b-0"><Skeleton className="size-14 shrink-0 rounded-full" /><div className="flex-1 space-y-2.5"><Skeleton className="h-5 w-44 max-w-full" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-3 w-20" /></div><Skeleton className="h-10 w-28 max-[550px]:hidden" /></div>)}</div></div>;
}

export default function MessagesSkeleton() {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><div aria-hidden="true" className="mb-6 min-h-[120px] rounded-xl border border-[#d9d9d9] bg-white px-5 py-6"><Skeleton className="mb-3 h-10 w-64 max-w-full" /><Skeleton className="h-4 w-3/5" /></div><MessageListSkeleton /></main>;
}
