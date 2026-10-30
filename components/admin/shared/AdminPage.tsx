import type { ReactNode } from "react";

export default function AdminPage({ title, description, action, children }: { title?: string; description?: string; action?: ReactNode; children: ReactNode }) {
  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 font-nunito text-[#182522] max-[1250px]:px-6 max-[640px]:px-4">{title && <header className="mb-6 flex min-h-[120px] flex-wrap items-center justify-between gap-4 rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><div><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-[#ff2f68] max-[640px]:text-[32px]">{title}</h1><p className="text-base text-[#363636]">{description}</p></div>{action}</header>}{children}</main>;
}
