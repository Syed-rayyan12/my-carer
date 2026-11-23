"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCareRequirements } from "./CareRequirementsContext";
import CareRequirementForm from "./CareRequirementForm";
import { RequirementFormSkeleton } from "../loading/DashboardSkeleton";

export default function CreateRequirementPage({ requirementId }: { requirementId?: string }) {
  const { requirements, ready } = useCareRequirements();
  const requirement = requirementId ? requirements.find(item => item.id === requirementId) : undefined;

  return (
    <main className="mx-auto flex max-w-[1530px] flex-col gap-6 px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]">
        <Link className="mb-2 inline-flex items-center gap-2 font-nunito text-sm text-[#ff2f68] hover:underline" href="/care-seeker-dashboard/care-requirements"><ArrowLeft size={16} />Back to My Care Requirements</Link>
        <h1 className="font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">{requirementId ? "Edit Requirement" : "Create Requirement"}</h1>
      </section>
      {!ready ? <RequirementFormSkeleton /> : requirementId && !requirement ? <section className="rounded-xl border border-[#e5e2dc] bg-white p-8"><h2 className="font-jakarta text-xl font-semibold">Requirement not found</h2><p className="mt-2 font-nunito text-sm text-[#667085]">This requirement is not available in this browser. Return to your care requirements to choose another.</p></section> : <CareRequirementForm key={requirement?.id ?? "new"} requirement={requirement} />}
    </main>
  );
}
