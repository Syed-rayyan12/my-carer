import { useState } from "react";
import ProfileSection, { ProfileField, SaveProfileButton } from "./ProfileSection";

export default function RatesForm({ hourlyRate, mileageRate, onSave }: {
  hourlyRate?: number;
  mileageRate?: number;
  onSave: (rates: { hourlyRate: number; mileageRate: number }) => void;
}) {
  const [hourly, setHourly] = useState(hourlyRate?.toString() ?? "");
  const [mileage, setMileage] = useState(mileageRate?.toString() ?? "");

  return <ProfileSection id="rates" title="Rates" description="Set your hourly care rate and travel charge per mile.">
    <form className="p-6" onSubmit={event => {
      event.preventDefault();
      const hourlyValue = Number(hourly), mileageValue = Number(mileage);
      if (!hourly.trim() || !mileage.trim() || !Number.isFinite(hourlyValue) || !Number.isFinite(mileageValue) || hourlyValue < 0 || mileageValue < 0) return;
      onSave({ hourlyRate: hourlyValue, mileageRate: mileageValue });
    }}>
      <div className="mb-4 grid grid-cols-2 gap-4 max-[450px]:grid-cols-1">
        <ProfileField label="Hourly Rate (£ per hour)" type="number" inputMode="decimal" min={0} step="0.01" required placeholder="e.g. 20.00" value={hourly} onChange={event => setHourly(event.target.value)} />
        <ProfileField label="Mileage Rate (p per mile)" type="number" inputMode="decimal" min={0} step="0.01" required placeholder="e.g. 45" value={mileage} onChange={event => setMileage(event.target.value)} />
      </div>
      <SaveProfileButton />
    </form>
  </ProfileSection>;
}
