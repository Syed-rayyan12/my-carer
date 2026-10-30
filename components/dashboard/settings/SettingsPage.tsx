"use client";

import { useState } from "react";
import { Save, ShieldCheck } from "lucide-react";
import { usePersistentDashboardState } from "../usePersistentDashboardState";
import { SettingsContentSkeleton } from "../loading/AccountPagesSkeleton";
import { initialAccountSettings, isAccountSettings } from "./settingsData";
import AccountSettingsForm from "./AccountSettingsForm";
import ChangePasswordForm from "./ChangePasswordForm";
import AccountActionModal from "./AccountActionModal";

export default function SettingsPage({ storageKey = "my-carer-account-settings" }: { storageKey?: string }) {
  const { value, setValue, ready, storageError } = usePersistentDashboardState(storageKey, initialAccountSettings, isAccountSettings);
  const [notice, setNotice] = useState("");
  const [action, setAction] = useState<"two-factor" | "delete" | null>(null);

  return <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4"><section className="mb-6 flex min-h-[120px] items-center justify-between gap-5 rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px] max-[600px]:flex-wrap"><div><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Settings</h1><p className="font-nunito text-base text-[#363636]">Manage your account, notifications and privacy.</p></div><button type="submit" form="account-settings-form" disabled={!ready} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-4 py-2.5 font-nunito text-sm font-semibold text-white hover:bg-[#e92359] disabled:opacity-50"><Save size={16} />Save settings</button></section>{storageError && <p role="status" className="mb-4 font-nunito text-sm text-amber-700">Browser storage is unavailable. Settings will only last for this visit.</p>}{notice && <p role="status" className="mb-4 font-nunito text-sm text-[#039855]">{notice}</p>}{!ready ? <SettingsContentSkeleton /> : <><div className="mb-6 grid grid-cols-2 items-stretch gap-6 max-[1000px]:grid-cols-1"><AccountSettingsForm initialValue={value} onSave={settings => { setValue(settings); setNotice("Account preferences saved on this device. Sign-in details have not been changed."); }} /><ChangePasswordForm /></div><section className="mb-6 flex items-start gap-3 rounded-[15px] bg-white px-5 py-4 shadow-[0_8px_18px_#10192915]"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-black" /><div className="max-w-[350px]"><h2 className="font-nunito text-sm text-black">Two-factor authentication</h2><p className="mt-1 font-nunito text-xs leading-relaxed text-[#363636]">Currently off. Recommended for accounts holding client records.</p></div><button type="button" className="ml-4 rounded-lg border border-[#e5e2dc] px-3 py-1.5 font-nunito text-xs text-[#363636] max-[500px]:ml-auto" onClick={() => setAction("two-factor")}>Enable</button></section><section className="rounded-[15px] bg-white px-5 py-7 shadow-[0_8px_18px_#10192915]"><h2 className="font-nunito text-base font-semibold text-black">Delete Account</h2><p className="mt-2 mb-3 font-nunito text-xs text-[#363636]">Once you delete your account, there is no going back. Please be certain.</p><button type="button" className="rounded-md bg-[#e91c23] px-4 py-2.5 font-nunito text-sm text-white hover:bg-red-700" onClick={() => setAction("delete")}>Delete My Account</button></section></>}<AccountActionModal action={action} onClose={() => setAction(null)} /></main>;
}
