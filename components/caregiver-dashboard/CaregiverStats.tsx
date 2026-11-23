import { ShieldCheck } from "lucide-react";
import { isCaregiverVerified } from "./verification/verificationData";
import { useCaregiverDashboard } from "./CaregiverDashboardContext";

export default function CaregiverStats() {
  const { snapshot, documents } = useCaregiverDashboard();
  const verified = snapshot.stats?.verified ?? isCaregiverVerified(documents);
  const stats = [
    {
      title: "Profile Views",
      value: "?",
      caption: "View tracking is not enabled",
    },
    {
      title: "New Care Jobs",
      value: String(snapshot.stats?.jobCount ?? 0),
      caption: "Open care requirements",
    },
    {
      title: "Applications",
      value: String(snapshot.stats?.applicationCount ?? 0).padStart(2, "0"),
      caption: `${snapshot.stats?.pendingApplications ?? 0} awaiting response`,
    },
    {
      title: "Messages",
      value: String(snapshot.stats?.conversationCount ?? 0).padStart(2, "0"),
      caption: "Your conversations",
    },
  ];
  return (
    <section
      className="mb-6 grid grid-cols-[repeat(4,minmax(0,1fr))_minmax(240px,1.55fr)] gap-1.5 max-[1300px]:grid-cols-3 max-[850px]:grid-cols-2 max-[480px]:grid-cols-1"
      aria-label="Caregiver statistics"
    >
      {stats.map((stat) => (
        <article
          key={stat.title}
          className="min-h-[120px] rounded-xl border border-[#d9d9d9] bg-white p-3"
        >
          <h2 className="text-[13px] text-black">{stat.title}</h2>
          <strong className="mt-2 mb-1 block font-commissioner text-[27px] font-bold tracking-tight text-[#202925]">
            {stat.value}
          </strong>
          <p className="text-[13px] text-[#ff2f68]">{stat.caption}</p>
        </article>
      ))}
      <article className="min-h-[120px] rounded-xl bg-[#ff2f68] p-3 text-white">
        <h2 className="text-[13px]">Verification</h2>
        <strong className="mt-2 mb-1 flex items-center gap-1 font-commissioner text-[27px] font-bold">
          {verified ? "Verified" : "Pending"}
          <ShieldCheck size={19} />
        </strong>
        <p className="text-[13px]">
          {verified
            ? "All Required Documents Approved"
            : "Documents Awaiting Approval"}
        </p>
      </article>
    </section>
  );
}
