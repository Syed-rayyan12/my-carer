export default function BlogCardsSkeleton() {
  return <div role="status" aria-label="Loading articles" className="mx-auto grid w-[min(1100px,calc(100%-40px))] gap-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
    {[0, 1, 2].map(item => <div key={item} aria-hidden="true" className="overflow-hidden rounded-xl border bg-white"><div className="h-[230px] animate-pulse bg-slate-100 motion-reduce:animate-none" /><div className="space-y-3 p-5"><div className="h-5 w-3/4 rounded bg-slate-100" /><div className="h-4 rounded bg-slate-100" /><div className="h-4 w-2/3 rounded bg-slate-100" /></div></div>)}
  </div>;
}
