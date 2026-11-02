"use client";

import { useState } from "react";
import { useCaregiverDashboard } from "../CaregiverDashboardContext";
import WeeklySchedule from "./WeeklySchedule";
import UpcomingTimeOff from "./UpcomingTimeOff";
import EditAvailabilityModal from "./EditAvailabilityModal";
import AddTimeOffModal from "./AddTimeOffModal";
import SavedModal from "../shared/SavedModal";
import CaregiverAvailabilitySkeleton from "./CaregiverAvailabilitySkeleton";

export default function CaregiverAvailabilityPage() { const { availability, timeOff, removeTimeOff, ready, storageError } = useCaregiverDashboard(); const [dialog, setDialog] = useState<"edit" | "time-off" | "saved" | null>(null); const [removed, setRemoved] = useState(false); if (!ready) return <CaregiverAvailabilitySkeleton />; return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 font-nunito text-[#101828] max-[1250px]:px-6 max-[640px]:px-4"><header className="mb-6 rounded-xl border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] font-bold leading-[1.3] tracking-tight text-black max-[640px]:text-[30px]">My Availability</h1><p className="text-base text-[#363636]">Let care seekers know when you're available.</p></header>{storageError && <p role="status" className="mb-4 text-sm text-amber-700">Browser storage is unavailable or full. Changes may only last for this visit.</p>}{removed && <p role="status" className="mb-4 text-sm text-[#027a48]">Time off removed.</p>}<div className="grid grid-cols-[minmax(0,2.05fr)_minmax(310px,1fr)] items-stretch gap-6 max-[1100px]:grid-cols-1"><WeeklySchedule availability={availability} onEdit={() => setDialog("edit")} /><UpcomingTimeOff records={timeOff} onAdd={() => setDialog("time-off")} onRemove={id => { removeTimeOff(id); setRemoved(true); }} /></div><p className="mt-3 text-[10px] text-[#98a2b3]">Your schedule and time off save on this device.</p>{dialog === "edit" && <EditAvailabilityModal onClose={() => setDialog(null)} onSaved={() => setDialog("saved")} />}{dialog === "time-off" && <AddTimeOffModal onClose={() => setDialog(null)} onSaved={() => { setRemoved(false); setDialog("saved"); }} />}{dialog === "saved" && <SavedModal title="Availability Saved" message="Your availability has been updated on this device." onClose={() => setDialog(null)} />}</main>; }
