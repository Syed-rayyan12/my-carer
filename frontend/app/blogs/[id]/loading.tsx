import WebsitePageShell from '@/components/website/WebsitePageShell';
export default function LoadingArticle() {
  return <WebsitePageShell activePage="blogs"><main role="status" aria-label="Loading article" className="mx-auto max-w-3xl space-y-6 px-5 py-16"><div className="h-12 w-3/4 animate-pulse rounded-lg bg-slate-100 motion-reduce:animate-none" /><div className="aspect-video animate-pulse rounded-xl bg-slate-100 motion-reduce:animate-none" />{[0,1,2,3].map(line => <div key={line} className="h-5 rounded bg-slate-100" />)}</main></WebsitePageShell>;
}
