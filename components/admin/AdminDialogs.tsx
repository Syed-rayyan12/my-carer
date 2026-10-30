"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useAdminDashboard } from "./AdminDashboardContext";
import { adminSectionPreviews, adminSectionTitles, filterAdminUsers } from "./adminData";
import AdminRegistrationsTable, { AdminStatusBadge } from "./AdminRegistrationsTable";
import AdminApprovalModal from "./AdminApprovalModal";
import AdminRejectionModal from "./AdminRejectionModal";
import { getAdminCaregivers } from "./caregivers/adminCaregiverData";
import AdminCaregiverBadge from "./caregivers/AdminCaregiverBadge";
import { getAdminCareSeekers } from "./care-seekers/adminCareSeekerData";

export default function AdminDialogs() {
  const { dialog, setDialog, data, search, setUserStatus } = useAdminDashboard();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = dialog !== null;
  const caregivers = getAdminCaregivers(data);
  const user = dialog && "userId" in dialog ? dialog.type === "caregiver" ? caregivers.find(item => item.id === dialog.userId) : data.users.find(item => item.id === dialog.userId) ?? caregivers.find(item => item.id === dialog.userId) ?? getAdminCareSeekers(data).find(item => item.id === dialog.userId) : undefined;
  const section = dialog?.type === "section" ? dialog.section : undefined;
  const userSection = section && ["all-users", "caregivers", "care-seekers", "verification"].includes(section);
  const decision = dialog?.type === "approve" || dialog?.type === "reject";
  const headingId = dialog?.type === "approve" ? "admin-approval-heading" : dialog?.type === "reject" ? "admin-rejection-heading" : "admin-dialog-heading";

  useEffect(() => {
    if (!open) { dialogRef.current?.close(); return; }
    dialogRef.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={`m-auto max-h-[85dvh] w-[calc(100%-32px)] overflow-y-auto bg-white text-[#344054] shadow-2xl backdrop:bg-black/40 backdrop:backdrop-blur-sm ${decision ? "max-w-[448px] rounded-[10px] border-0 p-0" : userSection ? "max-w-[900px] rounded-2xl border border-[#ececf0] p-6" : "max-w-[480px] rounded-2xl border border-[#ececf0] p-6"}`}
      aria-labelledby={headingId}
      aria-describedby={dialog?.type === "approve" ? "admin-approval-description" : undefined}
      onCancel={() => setDialog(null)}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setDialog(null);
      }}
    >
      {dialog?.type === "approve" && user && <AdminApprovalModal key={`approve-${user.id}`} user={user} onCancel={() => setDialog(null)} onConfirm={() => { setUserStatus(user.id, "Active"); setDialog(null); }} />}
      {dialog?.type === "reject" && user && <AdminRejectionModal key={`reject-${user.id}`} user={user} onCancel={() => setDialog(null)} onConfirm={reason => { setUserStatus(user.id, "Rejected", reason); setDialog(null); }} />}
      {!decision && (
        <>
          <header className="mb-5 flex items-center justify-between gap-3">
            <h2 id="admin-dialog-heading" className="font-jakarta text-xl font-semibold">{dialog?.type === "caregiver" ? "Caregiver Details" : dialog?.type === "user" ? "Registration Details" : section ? adminSectionTitles[section] : "Admin"}</h2>
            <button type="button" aria-label="Close admin dialog" className="rounded p-1 text-[#667085] hover:bg-gray-100" onClick={() => setDialog(null)}><X size={22} /></button>
          </header>
          {(dialog?.type === "user" || dialog?.type === "caregiver") && user && (
            <>
              <div className="mb-5 flex items-center gap-3">
                <span className={`flex size-12 items-center justify-center rounded-full font-nunito text-sm font-bold text-white ${user.type === "Caregiver" ? "bg-[#ff2f68]" : "bg-[#101929]"}`}>{user.initials}</span>
                <div><h3 className="font-jakarta text-base font-semibold">{user.name}</h3><p className="mt-1 font-nunito text-sm text-[#667085]">{user.type}</p></div>
              </div>
              <dl>
                {[{ title: "Email", value: user.email }, { title: "Location", value: user.location }, { title: "Registered", value: user.date }].map(item => <div className="flex justify-between gap-3 border-t border-[#ececf0] py-3 font-nunito text-sm" key={item.title}><dt className="text-[#667085]">{item.title}</dt><dd className="break-all text-right">{item.value}</dd></div>)}
                <div className="flex justify-between border-t border-[#ececf0] py-3 font-nunito text-sm"><dt className="text-[#667085]">Status</dt><dd><AdminStatusBadge status={user.status} /></dd></div>
                {dialog.type === "caregiver" && <div className="flex justify-between border-t border-[#ececf0] py-3 font-nunito text-sm"><dt className="text-[#667085]">Verification</dt><dd><AdminCaregiverBadge value={caregivers.find(item => item.id === user.id)?.verification ?? "Pending"} /></dd></div>}
                {user.rejectionReason && <div className="border-t border-[#ececf0] py-3 font-nunito text-sm"><dt className="mb-1 text-[#667085]">Reason for rejection</dt><dd className="whitespace-pre-wrap break-words text-[#344054]">{user.rejectionReason}</dd></div>}
              </dl>
              <p className="mt-3 font-nunito text-xs text-[#98a2b3]">Example registration. Admin changes are saved on this device.</p>
              {dialog.type === "caregiver" && <div className="mt-5 flex justify-end gap-2"><button type="button" disabled={user.status === "Active"} className="rounded-lg bg-[#ff2f68] px-4 py-2 font-nunito text-sm text-white disabled:opacity-45" onClick={() => setDialog({ type: "approve", userId: user.id })}>Approve</button><button type="button" disabled={user.status === "Rejected"} className="rounded-lg border border-[#b91e13] px-4 py-2 font-nunito text-sm text-[#b91e13] disabled:opacity-45" onClick={() => setDialog({ type: "reject", userId: user.id })}>Reject</button></div>}
            </>
          )}
          {section && (userSection ? (
            <><p className="mb-4 font-nunito text-sm text-[#667085]">Recent registration records matching this section and the header search.</p><AdminRegistrationsTable users={filterAdminUsers(data.users, search, section)} showHeader={false} /></>
          ) : (
            <><p className="mb-4 font-nunito text-xs text-[#98a2b3]">Admin overview preview</p><div className="space-y-3">{(adminSectionPreviews[section] ?? []).map(item => <article key={item.title} className="rounded-lg border border-[#e5e7eb] p-4"><h3 className="font-nunito text-sm font-bold">{item.title}</h3><p className="mt-1 font-nunito text-sm leading-relaxed text-[#667085]">{item.detail}</p></article>)}</div></>
          ))}
        </>
      )}
    </dialog>
  );
}
