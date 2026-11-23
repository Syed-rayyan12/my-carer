import AdminPage from "../shared/AdminPage";
import { Skeleton } from "@/components/dashboard/loading/DashboardSkeleton";
import { AdminCaregiversTableSkeleton } from "../caregivers/AdminCaregiversSkeleton";

export default function SubscriptionsSkeleton() { return <AdminPage title="Subscriptions" description="Revenue, plans and individual transactions."><div aria-hidden="true" className="mb-6 grid grid-cols-4 overflow-hidden rounded-xl border border-[#d9d9d9] bg-white max-[1000px]:grid-cols-2">{Array.from({ length: 4 }, (_, index) => <div key={index} className="space-y-3 p-5"><Skeleton className="h-4 w-28 max-w-full" /><Skeleton className="h-8 w-28 max-w-full" /><Skeleton className="h-3 w-32 max-w-full" /></div>)}</div><AdminCaregiversTableSkeleton label="Loading subscriptions" /></AdminPage>; }
