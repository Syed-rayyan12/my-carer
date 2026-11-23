import { useState } from "react";
import { Clock3, Check } from "lucide-react";

export default function MinimumVisitTime({ minutes, onSave }: { minutes?: number; onSave: (minutes: number) => Promise<boolean> }) {
  const [value, setValue] = useState(String(Math.max(30, minutes ?? 30)));
  const [saved, setSaved] = useState(false);
  const presets = [{ minutes: 30, label: "30 min" }, { minutes: 45, label: "45 min" }, { minutes: 60, label: "1 hour" }, { minutes: 90, label: "1.5 hours" }, { minutes: 120, label: "2 hours" }];
  function change(next: string) { setValue(next); setSaved(false); }

  return <section className="mb-6 overflow-hidden rounded-xl border border-[#eaecf0] bg-white" aria-labelledby="minimum-visit-title">
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eaecf0] px-6 py-5">
      <div className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0f5] text-[#ff2f68]"><Clock3 size={22} /></span><div><h2 id="minimum-visit-title" className="font-jakarta text-base font-bold">Minimum Visit Time</h2><p className="mt-1 text-sm text-[#667085]">Care visits start from a minimum of 30 minutes.</p></div></div>
      <span className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[#475467]">{minutes ? `${minutes} minute minimum` : "30 minute minimum"}</span>
    </div>
    <form className="px-6 py-5" onSubmit={async event => { event.preventDefault(); const next = Number(value); if (!value.trim() || !Number.isInteger(next) || next < 30 || next > 1440) return; if (await onSave(next)) setSaved(true); }}>
      <fieldset><legend className="mb-3 text-sm font-semibold">Choose a visit length</legend><div className="flex flex-wrap gap-2">{presets.map(preset => <button key={preset.minutes} type="button" aria-pressed={Number(value) === preset.minutes} onClick={() => change(String(preset.minutes))} className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff2f68] ${Number(value) === preset.minutes ? "border-[#ff2f68] bg-[#fff0f5] text-[#ff2f68]" : "border-[#d0d5dd] text-[#475467] hover:border-[#ffb5cd] hover:bg-[#fff5f8]"}`}>{preset.label}</button>)}</div></fieldset>
      <div className="mt-5 flex flex-wrap items-end gap-3"><label className="block text-sm font-semibold" htmlFor="minimum-visit-minutes">Visit duration<div className="mt-2 flex h-11 w-48 items-center overflow-hidden rounded-lg border border-[#d0d5dd] focus-within:border-[#ff2f68]"><input id="minimum-visit-minutes" required type="number" min={30} max={1440} step={1} inputMode="numeric" value={value} onChange={event => change(event.target.value)} placeholder="e.g. 60" aria-describedby="minimum-visit-help" className="h-full w-full min-w-0 px-3 font-normal outline-none" /><span className="pr-3 text-xs font-normal text-[#667085]">minutes</span></div></label><button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-4 text-sm font-semibold text-white hover:bg-[#e9295e]">Save Minimum Time</button>{saved && <p role="status" className="inline-flex h-11 items-center gap-1.5 text-sm text-[#027a48]"><Check size={16} />Saved</p>}</div>
      <p id="minimum-visit-help" className="mt-3 text-xs text-[#667085]">Choose a suggested duration or enter your own, from 30 to 1,440 minutes.</p>
    </form>
  </section>;
}
