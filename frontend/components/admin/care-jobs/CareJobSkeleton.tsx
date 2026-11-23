import { Skeleton } from "@/components/dashboard/loading/DashboardSkeleton";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function CareJobSkeleton({ detail = false }: { detail?: boolean }) {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4"><div role="status" aria-busy="true" className="mb-6 rounded-xl border border-[#d9d9d9] bg-white p-5"><span className="sr-only">Loading care job {detail ? "details" : "listings"}</span><div aria-hidden="true"><Skeleton className="mb-4 h-10 w-64 max-w-full" /><Skeleton className="h-4 w-96 max-w-full" />{detail && <div className="mt-8 grid grid-cols-[2fr_1fr] gap-6 max-[900px]:grid-cols-1"><Skeleton className="h-64" /><Skeleton className="h-64" /></div>}</div></div>{!detail && <AdminCaregiversTableSkeleton label="Loading care jobs" />}</main>;
}
