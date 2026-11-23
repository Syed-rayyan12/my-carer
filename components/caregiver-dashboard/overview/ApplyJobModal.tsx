import { accountApi } from "@/components/auth/auth-client";
import { activeJobApplication } from "../caregiverDashboardData";
import { useEffect, useState } from "react";
import { availabilitySummary } from "../preview/availabilityData";
import { CalendarClock, MapPin } from "lucide-react";
import CaregiverModal, { CaregiverModalFooter } from "../shared/CaregiverModal";
import type { RecommendedJob } from "../caregiverDashboardData";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";

export default function ApplyJobModal({
  job,
  onClose,
  onSaved,
}: {
  job: RecommendedJob;
  onClose: () => void;
  onSaved: () => void;
}) {
  const {
    profile,
    addApplication,
    applications,
    appliedJobIds,
    availability: currentAvailability,
  } = useCaregiverDashboard();
  const [message, setMessage] = useState("");
  const [rate, setRate] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [summary, setSummary] = useState<{
    photo: string;
    availability: string;
  } | null>(null);
  useEffect(() => {
    let active = true;
    accountApi<{ data: { photo: string; availability: string } }>(
      "platform/application-profile",
    )
      .then((r) => {
        if (active) setSummary(r.data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  const availability =
    summary?.availability || availabilitySummary(currentAvailability);
  return (
    <CaregiverModal
      title="Apply for This Job"
      subtitle="Your profile is shared with the care seeker along with message."
      onClose={onClose}
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          if (
            !confirmed ||
            !message.trim() ||
            !Number.isFinite(Number(rate)) ||
            Number(rate) <= 0 ||
            appliedJobIds.includes(job.id) ||
            activeJobApplication(applications, job.id)
          )
            return;
          const saved = await addApplication({
            id: crypto.randomUUID(),
            jobId: job.id,
            title: job.title,
            location: job.location,
            applied: "Just now",
            status: "Pending",
            message: message.trim(),
            hourlyRate: Number(rate),
            availability,
            careSeeker: job.name,
            detailTitle: job.detailTitle,
            applicationDate: new Date().toISOString().slice(0, 10),
            local: false,
          });
          if (saved) onSaved();
        }}
      >
        <div className="px-6 pb-5">
          <div className="mb-5 grid grid-cols-2 gap-3 max-[400px]:grid-cols-1">
            <div className="rounded-lg bg-[#f8fafc] p-3.5">
              <p className="text-xs text-[#667085]">Job</p>
              <p className="mt-1 text-sm font-semibold">{job.title}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[#667085]">
                <MapPin size={12} />
                {job.location} · £{job.minimumRate}–£{job.maximumRate} / hour
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-[#f8fafc] p-3.5">
              {summary?.photo || profile.photo ? (
                <img
                  src={summary?.photo || profile.photo}
                  alt="Your profile"
                  className="size-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex size-9 items-center justify-center rounded-full bg-pink-100 text-[#ff2f68]">
                  {profile.personal.firstName[0]}
                </span>
              )}
              <div>
                <p className="text-xs text-[#667085]">Your Profile</p>
                <p className="text-sm font-semibold">
                  {profile.personal.firstName} {profile.personal.lastName}
                </p>
              </div>
            </div>
          </div>
          <label className="block text-sm font-semibold">
            Message to Care Seeker
            <textarea
              required
              maxLength={2000}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={`Hi ${job.name.split(" ")[0]}, I would be happy to support your care requirements…`}
              className="mt-2 h-28 w-full resize-y rounded-lg border border-[#d0d5dd] p-3 text-sm font-normal outline-none placeholder:text-[#98a2b3] focus:border-[#ff2f68]"
            />
          </label>
          <div className="mt-5 grid grid-cols-2 gap-4 max-[400px]:grid-cols-1">
            <div>
              <p className="mb-2 text-sm font-semibold">Availability</p>
              <div className="flex min-h-10 items-center gap-2 rounded-lg border border-[#eaecf0] bg-[#f8fafc] px-3 text-[10px] text-[#475467]">
                <CalendarClock size={14} className="shrink-0 text-[#98a2b3]" />
                {availability}
              </div>
              <p className="mt-1 text-xs text-[#667085]">
                From your current availability
              </p>
            </div>
            <label className="text-sm font-semibold">
              Hourly Rate
              <div className="mt-2 flex h-10 items-center rounded-lg border border-[#d0d5dd] px-3">
                <input
                  required
                  type="number"
                  min="0.01"
                  max="1000"
                  step="0.01"
                  value={rate}
                  onChange={(event) => setRate(event.target.value)}
                  className="w-full min-w-0 bg-transparent font-normal outline-none"
                />
                <span className="shrink-0 text-sm font-normal text-[#667085]">
                  / hour
                </span>
              </div>
              <span className="mt-1 block text-xs font-normal text-[#667085]">
                Advertised £{job.minimumRate}–£{job.maximumRate} / hour
              </span>
            </label>
          </div>
          <label className="mt-5 flex items-start gap-2 text-sm text-[#475467]">
            <input
              required
              type="checkbox"
              checked={confirmed}
              onChange={(event) => setConfirmed(event.target.checked)}
              className="mt-0.5 size-4 accent-[#ff2f68]"
            />
            I confirm that the information provided is accurate.
          </label>
          <p className="mt-3 text-xs leading-5 text-[#667085]">
            Your application and proposed rate will be sent to the care seeker.
          </p>
        </div>
        <CaregiverModalFooter
          onClose={onClose}
          label="Send Application"
          disabled={!confirmed || !message.trim() || !rate}
        />
      </form>
    </CaregiverModal>
  );
}
