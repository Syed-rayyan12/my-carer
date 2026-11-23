"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, ArrowUpRight } from "lucide-react";
import { accountApi } from "@/components/auth/auth-client";
export default function FeaturedOrganisations() {
  const [agencies, setAgencies] = useState<
    { id: string; name: string; coverage: string; services: string }[]
  >([]);
  useEffect(() => {
    let active = true;
    accountApi<{ data: typeof agencies }>(
      "platform/organisations?featured=true",
    )
      .then((r) => {
        if (active) setAgencies(r.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  if (!agencies.length) return null;
  return (
    <section className="bg-white px-6 py-12">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#c71d50]">
              Care organisations
            </p>
            <h2 className="mt-2 font-commissioner text-3xl font-bold">
              Meet our featured agencies
            </h2>
          </div>
          <Link href="/pricing" className="text-sm text-[#c71d50] underline">
            List your agency
          </Link>
        </div>
        <div className="flex snap-x gap-4 overflow-x-auto pb-4">
          {agencies.map((a) => (
            <article
              key={a.id}
              className="w-72 shrink-0 snap-start rounded-2xl border border-[#f1d6df] bg-[#fff8fa] p-5"
            >
              <Building2 size={25} className="mb-4 text-[#c71d50]" />
              <h3 className="text-lg font-semibold">{a.name}</h3>
              <p className="mt-2 text-xs leading-6 text-[#667085]">
                {a.coverage || "Coverage details available from the agency"}
              </p>
              <Link
                href="/organisations"
                className="mt-4 inline-flex items-center gap-1 text-sm text-[#c71d50]"
              >
                Explore agencies
                <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
