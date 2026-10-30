"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { AdminUser } from "./adminData";

export default function AdminRejectionModal({ user, onCancel, onConfirm }: { user: AdminUser; onCancel: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  return (
    <form onSubmit={event => { event.preventDefault(); const explanation = reason.trim(); if (!explanation) { setError("Please add a reason for rejection."); return; } onConfirm(explanation); }}>
      <header className="flex items-start justify-between gap-4 px-6 pt-5">
        <h2 id="admin-rejection-heading" className="font-nunito text-[22px] leading-7 font-extrabold text-[#1b2926]">Reject {user.name}</h2>
        <button type="button" aria-label="Close rejection modal" className="mt-0.5 rounded p-0.5 text-[#64716b] hover:bg-gray-100" onClick={onCancel}><X size={18} /></button>
      </header>
      <div className="px-6 pt-6 pb-7">
        <label htmlFor="admin-rejection-reason" className="mb-1.5 block font-nunito text-[14px] leading-5 text-[#1b2926]">Reason for rejection</label>
        <textarea id="admin-rejection-reason" required maxLength={1000} rows={3} value={reason} onChange={event => { setReason(event.target.value); setError(""); }} placeholder="Add a short, clear explanation..." aria-invalid={Boolean(error)} aria-describedby={error ? "admin-rejection-error" : undefined} className="block min-h-[98px] w-full resize-none rounded-lg border border-[#dfe4e1] bg-white px-3 py-2.5 font-nunito text-[14px] text-[#344054] outline-none placeholder:text-[13px] placeholder:text-[#98a2b3] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" />
        {error && <p id="admin-rejection-error" role="alert" className="mt-2 font-nunito text-xs text-red-600">{error}</p>}
      </div>
      <footer className="flex justify-end gap-2 border-t border-[#e2e6e4] bg-[#f4f6f5] px-6 py-4">
        <button type="button" className="min-h-10 rounded-lg border border-[#dfe4e1] bg-white px-5 py-2 font-nunito text-[14px] text-[#1b2926] hover:bg-gray-50" onClick={onCancel}>Cancel</button>
        <button type="submit" className="min-h-10 rounded-lg bg-[#b91e13] px-5 py-2 font-nunito text-[14px] font-semibold text-white hover:bg-[#a21910]">Reject account</button>
      </footer>
    </form>
  );
}
