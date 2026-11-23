import type { ReactNode } from "react";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-md bg-[#e9ebef] motion-reduce:animate-none ${className}`} />;
}

function LoadingRegion({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <div role="status" aria-busy="true" className={className}><span className="sr-only">{label}</span><div aria-hidden="true">{children}</div></div>;
}

function HeaderSkeleton({ showAction = true }: { showAction?: boolean }) {
  return <div className="mb-6 flex min-h-[120px] items-center justify-between gap-6 rounded-xl border border-[#d9d9d9] bg-white p-5"><div className="min-w-0 flex-1 space-y-3"><Skeleton className="h-10 w-3/5 max-w-96" /><Skeleton className="h-4 w-4/5 max-w-[560px]" /></div>{showAction && <Skeleton className="h-11 w-52 shrink-0 max-[700px]:hidden" />}</div>;
}

export function SavedCaregiverGridSkeleton() {
  return <LoadingRegion label="Loading saved caregivers"><div className="grid grid-cols-3 gap-4 max-[1350px]:grid-cols-2 max-[750px]:grid-cols-1">{Array.from({ length: 8 }, (_, index) => <CaregiverCardSkeleton key={index} />)}</div></LoadingRegion>;
}

export function CaregiverCardSkeleton() {
  return <div className="flex min-h-[340px] flex-col rounded-[18px] border border-[#e5e2dc] bg-white p-5"><div className="flex gap-4"><Skeleton className="size-[62px] shrink-0 rounded-full" /><div className="flex-1 space-y-2.5 pt-1"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-24" /></div></div><div className="mt-6 flex justify-between gap-4"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-24" /></div><div className="mt-5 flex flex-wrap gap-2"><Skeleton className="h-6 w-28 rounded-full" /><Skeleton className="h-6 w-24 rounded-full" /><Skeleton className="h-6 w-28 rounded-full" /></div><Skeleton className="mt-5 h-4 w-28" /><div className="mt-auto grid grid-cols-2 gap-2 pt-5"><Skeleton className="h-10" /><Skeleton className="h-10" /></div></div>;
}

export function RequirementCardsSkeleton() {
  return <LoadingRegion label="Loading your care requirements" className="space-y-4">{Array.from({ length: 3 }, (_, index) => <div key={index} className="mb-4 rounded-[18px] border border-[#e5e2dc] bg-white p-6"><div className="flex justify-between gap-4"><div className="flex-1 space-y-2"><Skeleton className="h-6 w-3/5 max-w-80" /><Skeleton className="h-4 w-36" /></div><Skeleton className="h-6 w-16 rounded-full" /></div><div className="my-7 grid grid-cols-4 gap-4 max-[700px]:grid-cols-2">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-4" />)}</div><div className="flex items-center justify-between gap-5 border-t border-[#e5e2dc] pt-5"><Skeleton className="h-5 w-28" /><div className="flex gap-2"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-16 max-[500px]:hidden" /><Skeleton className="h-10 w-32 max-[700px]:hidden" /></div></div></div>)}</LoadingRegion>;
}

export function ProfileFormSkeleton() {
  return <LoadingRegion label="Loading your profile information"><div className="rounded-xl border border-[#d9d9d9] bg-white px-4 pt-6">{[5, 2, 1, 3].map((count, index) => <div key={index} className="grid grid-cols-[27%_minmax(0,1fr)] gap-5 border-t border-[#e5e2dc] py-8 max-[800px]:grid-cols-1"><div className="space-y-3"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-4/5" /><Skeleton className="h-4 w-3/5" /></div><div className="grid grid-cols-2 gap-x-5 gap-y-5 max-[550px]:grid-cols-1">{Array.from({ length: count }, (_, i) => <div key={i} className={`space-y-2 ${index === 2 ? "col-span-2 max-[550px]:col-span-1" : ""}`}><Skeleton className="h-4 w-28" /><Skeleton className={index === 2 ? "h-28 w-full" : "h-11 w-full"} /></div>)}</div></div>)}<div className="flex justify-end border-t border-[#e5e2dc] py-6"><Skeleton className="h-11 w-40" /></div></div></LoadingRegion>;
}

export function RequirementFormSkeleton() {
  return <LoadingRegion label="Loading care requirement form"><div className="rounded-xl border border-[#d9d9d9] bg-white p-5"><div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">{Array.from({ length: 8 }, (_, index) => <div key={index} className="space-y-2"><Skeleton className="h-4 w-44" /><Skeleton className="h-11 w-full" /></div>)}</div><div className="mt-6 space-y-3"><Skeleton className="h-4 w-64" /><Skeleton className="h-28" /></div><div className="my-7 grid grid-cols-3 gap-4 max-[700px]:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-5" />)}</div><div className="flex justify-end border-t border-[#e5e2dc] pt-5"><Skeleton className="h-11 w-52" /></div></div></LoadingRegion>;
}

function CaregiverDirectorySkeleton() {
  return <><div className="mb-6 rounded-xl border border-[#d9d9d9] bg-white p-4"><Skeleton className="h-10 w-full" /></div><div className="grid grid-cols-[260px_minmax(0,1fr)] gap-5 max-[1100px]:grid-cols-1"><div className="space-y-5 rounded-xl border border-[#d9d9d9] bg-white p-4 max-[1100px]:hidden"><Skeleton className="h-6 w-24" />{Array.from({ length: 7 }, (_, i) => <Skeleton key={i} className="h-5 w-4/5" />)}{Array.from({ length: 4 }, (_, i) => <div className="space-y-3 border-t border-[#e5e2dc] pt-6" key={i}><Skeleton className="h-6 w-32" /><Skeleton className="h-10" /></div>)}</div><div><Skeleton className="mb-4 h-9 w-72 max-w-full" /><div className="grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">{Array.from({ length: 4 }, (_, i) => <CaregiverCardSkeleton key={i} />)}</div></div></div></>;
}

function OverviewSkeleton() {
  return <><div className="mb-6 rounded-xl border border-[#ececf0] bg-white p-7"><Skeleton className="mb-3 h-7 w-72 max-w-full" /><Skeleton className="h-4 w-3/5" /></div><div className="mb-6 grid grid-cols-4 gap-4 max-[850px]:grid-cols-2">{Array.from({ length: 4 }, (_, i) => <div key={i} className="rounded-xl border border-[#ececf0] bg-white p-5"><Skeleton className="mb-4 h-4 w-4/5" /><Skeleton className="mb-4 h-9 w-12" /><Skeleton className="h-3 w-3/4" /></div>)}</div><div className="grid grid-cols-[1.85fr_1fr] gap-6 max-[1250px]:grid-cols-1"><div className="rounded-xl border border-[#ececf0] bg-white p-5"><Skeleton className="mb-5 h-6 w-3/4" /><div className="grid grid-cols-2 gap-4 max-[850px]:grid-cols-1"><CaregiverCardSkeleton /><CaregiverCardSkeleton /></div></div><div className="rounded-xl border border-[#ececf0] bg-white p-5"><Skeleton className="mb-5 h-6 w-36" />{Array.from({ length: 4 }, (_, i) => <div key={i} className="mb-5 flex gap-3"><Skeleton className="size-8 shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-24" /></div></div>)}</div></div></>;
}

export default function DashboardSkeleton({ variant = "overview" }: { variant?: "overview" | "caregivers" | "requirements" | "profile" | "requirement-form" | "saved-caregivers" }) {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><LoadingRegion label="Loading dashboard page"><HeaderSkeleton showAction={variant !== "saved-caregivers"} />{variant === "overview" ? <OverviewSkeleton /> : variant === "caregivers" ? <CaregiverDirectorySkeleton /> : variant === "saved-caregivers" ? <SavedCaregiverGridSkeleton /> : variant === "requirements" ? <RequirementCardsSkeleton /> : variant === "requirement-form" ? <RequirementFormSkeleton /> : <><div className="mb-6 rounded-xl border border-[#ffd1de] bg-[#ffebf1] px-9 py-6"><Skeleton className="mb-3 h-5 w-64 max-w-full" /><Skeleton className="mb-3 h-2 w-4/5 max-w-[448px] rounded-full" /><Skeleton className="h-4 w-3/5" /></div><ProfileFormSkeleton /></>}</LoadingRegion></main>;
}
