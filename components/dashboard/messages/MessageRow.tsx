"use client";

import { Reply, Star } from "lucide-react";
import DashboardAvatar from "../loading/DashboardAvatar";
import type { DirectoryCaregiver } from "../caregivers/caregiverDirectoryData";
import { formatMessageTime, type Conversation } from "./messagesData";

export default function MessageRow({ conversation, caregiver, onReply }: { conversation: Conversation; caregiver: DirectoryCaregiver; onReply: () => void }) {
  const latest = conversation.messages.at(-1);

  return (
    <article className={`flex min-h-[128px] items-center justify-between gap-5 border-b border-[#e5e2dc] px-6 py-6 last:border-b-0 max-[650px]:flex-wrap max-[650px]:px-4 ${conversation.unread ? "bg-[#fffafc]" : "bg-white"}`}>
      <div className="flex min-w-0 flex-1 items-start gap-4">
        <div className="relative shrink-0"><DashboardAvatar src={caregiver.image} name={caregiver.name} initials={caregiver.initials} className="size-14" variant="pink" /><span className={`absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-white ${conversation.online ? "bg-[#12b76a]" : "bg-[#98a2b3]"}`} aria-hidden="true" /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><h2 className="font-jakarta text-base font-semibold text-[#344054]">{caregiver.name}</h2><span className={`flex items-center gap-1.5 font-nunito text-xs ${conversation.online ? "text-[#039855]" : "text-[#667085]"}`}><span className={`size-1.5 rounded-full ${conversation.online ? "bg-[#12b76a]" : "bg-[#98a2b3]"}`} />{conversation.online ? "Online" : "Offline"}</span>{conversation.unread && <span className="rounded-full bg-[#ffebf1] px-2 py-0.5 font-nunito text-[10px] font-semibold text-[#ff2f68]">New</span>}{conversation.starred && <Star size={14} className="fill-[#ff2f68] text-[#ff2f68]" aria-label="Starred conversation" />}</div>
          <p className="mt-1.5 line-clamp-2 max-w-[700px] font-nunito text-[14.4px] leading-relaxed text-[#667085]">{conversation.draft ? <><span className="font-semibold text-[#ff2f68]">Draft: </span>{conversation.draft}</> : latest ? <>{latest.sender === "you" && <span className="font-semibold">You (local): </span>}{latest.body}</> : "Start a conversation with this caregiver."}</p>
          {latest && <time dateTime={latest.createdAt} className="mt-1.5 block font-nunito text-xs text-[#98a2b3]">{formatMessageTime(latest.createdAt)}</time>}
        </div>
      </div>
      <button type="button" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[#d9dde3] bg-transparent px-5 py-2 font-nunito text-[14.4px] font-medium text-black hover:border-[#ff2f68] hover:bg-[#fff5f8] max-[650px]:ml-[72px]" onClick={onReply}><Reply size={17} />Reply</button>
    </article>
  );
}
