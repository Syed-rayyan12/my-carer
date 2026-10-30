"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { validatePasswordChange } from "./settingsData";

export default function ChangePasswordForm() {
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const fields: { name: keyof typeof passwords; label: string; autoComplete: string }[] = [{ name: "current", label: "Current password", autoComplete: "current-password" }, { name: "next", label: "New password", autoComplete: "new-password" }, { name: "confirm", label: "Confirm new password", autoComplete: "new-password" }];

  return <section className="overflow-hidden rounded-[18px] border border-[#e5e2dc] bg-white shadow-[0_8px_18px_#10192915]"><h2 className="border-b border-[#e5e2dc] px-5 py-4 font-nunito text-base font-bold text-[#202925]">Change password</h2><form className="space-y-4 p-5" onSubmit={event => { event.preventDefault(); const issue = validatePasswordChange(passwords.current, passwords.next, passwords.confirm); setError(issue); setNotice(""); if (!issue) { setNotice("Your new password meets the requirements. Connect an authentication service to apply this change."); setPasswords({ current: "", next: "", confirm: "" }); } }}>{fields.map(field => <div key={field.name}><label htmlFor={`password-${field.name}`} className="block font-nunito text-[13px] text-[#475950]">{field.label}</label><div className="relative mt-1.5"><input id={`password-${field.name}`} required type={visible ? "text" : "password"} autoComplete={field.autoComplete} placeholder="••••••••••" value={passwords[field.name]} onChange={event => { setPasswords({ ...passwords, [field.name]: event.target.value }); setError(""); setNotice(""); }} aria-describedby={field.name === "next" ? "password-requirements" : undefined} className="h-[38px] w-full rounded-lg border border-[#e5e2dc] bg-white pr-10 pl-3 font-nunito text-sm text-[#344054] outline-none placeholder:text-[#98a2b3] focus:border-[#ff2f68]" />{field.name === "current" && <button type="button" className="absolute inset-y-0 right-2 text-[#98a2b3]" aria-label={visible ? "Hide passwords" : "Show passwords"} aria-pressed={visible} onClick={() => setVisible(current => !current)}>{visible ? <EyeOff size={16} /> : <Eye size={16} />}</button>}</div>{field.name === "next" && <p id="password-requirements" className="mt-1.5 font-nunito text-xs text-[#8d9692]">At least 10 characters with a number and symbol.</p>}</div>)}{error && <p role="alert" className="font-nunito text-xs text-red-600">{error}</p>}{notice && <p role="status" className="font-nunito text-xs text-[#667085]">{notice}</p>}<button type="submit" className="min-h-10 rounded-lg border border-[#e5e2dc] bg-white px-5 py-2 font-nunito text-sm text-[#202925] hover:bg-gray-50">Update password</button></form></section>;
}
