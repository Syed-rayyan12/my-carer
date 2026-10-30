"use client";

import { Check, X } from "lucide-react";
import type { AdminUser } from "./adminData";

export default function AdminApprovalModal({ user, onCancel, onConfirm }: { user: AdminUser; onCancel: () => void; onConfirm: () => void }) {
  const caregiver = user.type === "Caregiver";

  return (
    <>
      <header className="flex items-start justify-between gap-4 px-6 pt-5">
        <h2 id="admin-approval-heading" className="font-nunito text-[22px] leading-7 font-extrabold text-[#1b2926]">Approve {caregiver ? "Caregiver" : "Care Seeker"}</h2>
        <button type="button" aria-label="Close approval modal" className="mt-0.5 rounded p-0.5 text-[#64716b] hover:bg-gray-100" onClick={onCancel}><X size={18} /></button>
      </header>
      <div className="px-6 pt-5 pb-6">
        <p id="admin-approval-description" className="font-nunito text-[14px] leading-5 text-[#64716b]">Are you sure you want to approve this {caregiver ? "caregiver profile" : "care seeker account"}?</p>
        <div className="mt-4 mb-4 rounded-lg bg-[#f4f6f5] px-4 py-3.5 font-nunito text-[14px]"><span className="text-[#64716b]">Name:</span><span className="ml-1.5 text-[#1b2926]">{user.name}</span></div>
        <h3 className="mb-3 font-nunito text-[14px] font-semibold text-[#1b2926]">After approval</h3>
        <ul className="space-y-2 font-nunito text-[14px] text-[#64716b]">
          <li className="flex items-center gap-2"><Check size={17} className="shrink-0 text-[#ff2f68]" />{caregiver ? "Profile becomes visible" : "Account becomes active"}</li>
          <li className="flex items-center gap-2"><Check size={17} className="shrink-0 text-[#ff2f68]" />{caregiver ? "Users can contact caregiver" : "User can contact caregivers"}</li>
        </ul>
      </div>
      <footer className="flex justify-end gap-2 border-t border-[#e2e6e4] bg-[#f4f6f5] px-6 py-4">
        <button type="button" autoFocus className="min-h-10 rounded-lg border border-[#dfe4e1] bg-white px-5 py-2 font-nunito text-[14px] text-[#1b2926] hover:bg-gray-50" onClick={onCancel}>Cancel</button>
        <button type="button" className="min-h-10 rounded-lg bg-[#ff2f68] px-5 py-2 font-nunito text-[14px] font-semibold text-white hover:bg-[#e92359]" onClick={onConfirm}>Approve</button>
      </footer>
    </>
  );
}
