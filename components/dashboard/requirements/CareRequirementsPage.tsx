"use client";

import { useState } from "react";
import DashboardPageHeader from "../DashboardPageHeader";
import CareRequirementCard from "./CareRequirementCard";
import CloseRequirementModal from "./CloseRequirementModal";
import RequirementResponses from "./RequirementResponses";
import { useCareRequirements, type CareRequirement } from "./CareRequirementsContext";
import { RequirementCardsSkeleton } from "../loading/DashboardSkeleton";

export default function CareRequirementsPage() {
  const { requirements, closeRequirement, storageError, ready } = useCareRequirements();
  const [closing, setClosing] = useState<CareRequirement | null>(null);
  const [responsesId, setResponsesId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-4 max-[1250px]:px-6 max-[640px]:px-4">
      <DashboardPageHeader title="My Care Requirements" description="Create and manage the care requirements you've posted on My Carer." />
      {notice && <p className="mb-4 font-nunito text-sm text-[#3c9c68]" role="status">{notice}</p>}
      {storageError && <p className="mb-4 font-nunito text-sm text-amber-700" role="status">Browser storage is unavailable. Changes will only last for this session.</p>}
      {!ready ? <RequirementCardsSkeleton /> : (
        <div className="flex flex-col gap-4">
          {requirements.map(requirement => (
            <div key={requirement.id}>
              <CareRequirementCard requirement={requirement} responsesExpanded={responsesId === requirement.id} onClose={() => setClosing(requirement)} onResponses={() => setResponsesId(current => current === requirement.id ? null : requirement.id)} />
              {responsesId === requirement.id && <RequirementResponses requirement={requirement} onHide={() => setResponsesId(null)} />}
            </div>
          ))}
        </div>
      )}
      <CloseRequirementModal requirement={closing} onCancel={() => setClosing(null)} onConfirm={() => { if (!closing) return; closeRequirement(closing.id); setNotice(`"${closing.title}" has been closed.`); setClosing(null); }} />
    </main>
  );
}
