"use client";

import { useEffect, useRef, useState } from "react";
import { Archive, ArchiveRestore, CheckCheck, Send, Star, X } from "lucide-react";
import DashboardAvatar from "../loading/DashboardAvatar";
import type { DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";
import { formatMessageTime, type Conversation } from "./messagesData";

export default function ReplyModal({ conversation, caregiver, onClose, onDraftChange, onReply, onStar, onArchive }: { conversation: Conversation | null; caregiver: DirectoryCaregiver | null; onClose: () => void; onDraftChange: (draft: string) => void; onReply: () => void; onStar: () => void; onArchive: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);
  const [savedNotice, setSavedNotice] = useState(false);
  const open = Boolean(conversation && caregiver);

  useEffect(() => {
    if (!open) { dialogRef.current?.close(); return; }
    setSavedNotice(false);
    dialogRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [conversation?.id, conversation?.messages.length]);

  return (
    <dialog ref={dialogRef} className="m-auto w-[calc(100%-32px)] max-w-[680px] overflow-hidden rounded-[20px] border border-[#ececf0] bg-white p-0 text-[#344054] shadow-2xl backdrop:bg-[#101929]/45 backdrop:backdrop-blur-sm" aria-labelledby="reply-modal-title" onCancel={onClose} onClick={event => { if (event.target !== event.currentTarget) return; const bounds = event.currentTarget.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose(); }}>
      <header className="flex items-center justify-between gap-3 border-b border-[#ececf0] px-6 py-5 max-[500px]:px-4">
        <div className="flex min-w-0 items-center gap-3">{caregiver && <DashboardAvatar src={caregiver.image} name={caregiver.name} initials={caregiver.initials} className="size-12" variant="pink" />}<div className="min-w-0"><h2 id="reply-modal-title" className="font-jakarta text-lg font-semibold">{caregiver?.name ?? "Reply to message"}</h2><p className={`mt-1 flex items-center gap-1.5 font-nunito text-xs ${conversation?.online ? "text-[#039855]" : "text-[#667085]"}`}><span className={`size-1.5 rounded-full ${conversation?.online ? "bg-[#12b76a]" : "bg-[#98a2b3]"}`} />{conversation?.online ? "Online" : "Offline"}<span className="text-[#98a2b3]">· Caregiver</span></p></div></div>
        <div className="flex shrink-0 items-center gap-1"><button type="button" className={`rounded-lg p-2 hover:bg-[#fff5f8] ${conversation?.starred ? "text-[#ff2f68]" : "text-[#667085]"}`} aria-label={conversation?.starred ? "Unstar conversation" : "Star conversation"} aria-pressed={conversation?.starred ?? false} onClick={onStar}><Star size={18} fill={conversation?.starred ? "currentColor" : "none"} /></button><button type="button" className="rounded-lg p-2 text-[#667085] hover:bg-[#fff5f8]" aria-label={conversation?.archived ? "Restore conversation" : "Archive conversation"} onClick={onArchive}>{conversation?.archived ? <ArchiveRestore size={18} /> : <Archive size={18} />}</button><button type="button" className="rounded-lg p-2 text-[#667085] hover:bg-gray-100" aria-label="Close reply modal" onClick={onClose}><X size={21} /></button></div>
      </header>
      <div ref={historyRef} className="flex max-h-[38dvh] min-h-40 flex-col gap-4 overflow-y-auto bg-[#fafbfc] px-6 py-5 max-[500px]:px-4" aria-label="Conversation history" role="log" aria-live="polite" aria-relevant="additions">
        {conversation?.messages.map(message => <div key={message.id} className={`max-w-[85%] ${message.sender === "you" ? "self-end" : "self-start"}`}><p className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 font-nunito text-[14px] leading-relaxed ${message.sender === "you" ? "rounded-br-sm bg-[#ffebf1] text-[#344054]" : "rounded-bl-sm border border-[#e9ebef] bg-white text-[#475467]"}`}>{message.body}</p><p className={`mt-1.5 flex flex-wrap items-center gap-1 font-nunito text-[10px] text-[#98a2b3] ${message.sender === "you" ? "justify-end" : "justify-start"}`}><time dateTime={message.createdAt}>{formatMessageTime(message.createdAt)}</time>{message.delivery === "local" && <span>· Saved locally, not sent</span>}</p></div>)}
      </div>
      <form className="border-t border-[#ececf0] px-6 pt-4 pb-5 max-[500px]:px-4" onSubmit={event => { event.preventDefault(); if (!conversation?.draft.trim()) return; onReply(); setSavedNotice(true); }}>
        <label htmlFor="conversation-reply" className="mb-2 block font-nunito text-sm font-semibold">Your reply</label>
        <textarea id="conversation-reply" required maxLength={2000} rows={3} autoFocus value={conversation?.draft ?? ""} onChange={event => { onDraftChange(event.target.value); setSavedNotice(false); }} onKeyDown={event => { if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Write a thoughtful reply..." className="block max-h-40 min-h-24 w-full resize-y rounded-xl border border-[#d9dde3] bg-white px-3.5 py-3 font-nunito text-sm outline-none placeholder:text-[#98a2b3] focus:border-[#ff2f68] focus:ring-2 focus:ring-[#ff2f68]/10" />
        <div className="mt-1.5 flex justify-between gap-3 font-nunito text-[10px] text-[#98a2b3]"><span>Ctrl / ⌘ + Enter to save your reply</span><span>{conversation?.draft.length ?? 0}/2000</span></div>
        {savedNotice && <p role="status" className="mt-3 flex items-center gap-1.5 font-nunito text-xs text-[#039855]"><CheckCheck size={15} />Reply saved on this device. It has not been sent.</p>}
        <div className="mt-4 flex items-center justify-between gap-4 max-[500px]:flex-wrap"><p className="max-w-[320px] font-nunito text-[11px] leading-relaxed text-[#98a2b3]">This preview stores replies locally. Sending requires a connected messaging service.</p><button type="submit" disabled={!conversation?.draft.trim()} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#ff2f68] px-5 py-2.5 font-nunito text-sm font-semibold text-white hover:bg-[#e92359] disabled:cursor-not-allowed disabled:opacity-50"><Send size={16} />Save Reply</button></div>
      </form>
    </dialog>
  );
}
