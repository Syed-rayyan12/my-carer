"use client";

import { useState, type KeyboardEvent } from "react";
import { MessageSquare } from "lucide-react";
import { allDashboardCaregivers } from "../caregivers/caregiverDirectoryData";
import MessageRow from "./MessageRow";
import ReplyModal from "./ReplyModal";
import { MessageListSkeleton } from "./MessagesSkeleton";
import { useMessages } from "./useMessages";
import { filterConversations, messageTabs, type MessageTab } from "./messagesData";

export default function MessagesPage() {
  const { conversations, ready, storageError, updateConversation, toggleStar, saveReply } = useMessages();
  const [tab, setTab] = useState<MessageTab>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const visibleConversations = filterConversations(conversations, tab);
  const selected = conversations.find(conversation => conversation.id === selectedId) ?? null;
  const caregiver = allDashboardCaregivers.find(person => person.id === selected?.caregiverId) ?? null;

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % messageTabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + messageTabs.length) % messageTabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = messageTabs.length - 1;
    else return;
    event.preventDefault();
    setTab(messageTabs[next].id);
    document.getElementById(`message-tab-${messageTabs[next].id}`)?.focus();
  }

  return (
    <main className="mx-auto max-w-[1530px] px-8 pt-2 pb-5 max-[1250px]:px-6 max-[640px]:px-4">
      <section className="mb-6 min-h-[120px] rounded-[11px] border border-[#d9d9d9] bg-white px-5 py-[18px]"><h1 className="mb-1 font-commissioner text-[42px] leading-[1.3] font-bold tracking-tight text-black max-[640px]:text-[32px]">Messages</h1><p className="font-nunito text-base text-[#363636]">Keep in touch with caregivers, discuss your care needs and manage your conversations in one place.</p></section>
      <p className="sr-only" role="status">{notice}</p>
      {storageError && <p className="mb-4 font-nunito text-sm text-amber-700" role="status">Browser storage is unavailable. Messages and drafts will only last for this visit.</p>}
      {!ready ? <MessageListSkeleton /> : <section className="overflow-hidden rounded-[11px] border border-[#d9d9d9] bg-white" aria-label="Your conversations">
        <div role="tablist" aria-label="Filter messages" className="flex gap-7 overflow-x-auto border-b border-[#ececf0] px-6 max-[650px]:gap-4 max-[650px]:px-4">
          {messageTabs.map(({ id, label }, index) => <button id={`message-tab-${id}`} key={id} type="button" role="tab" aria-selected={tab === id} aria-controls="message-tab-panel" tabIndex={tab === id ? 0 : -1} onKeyDown={event => navigateTabs(event, index)} onClick={() => setTab(id)} className={`inline-flex min-h-[54px] shrink-0 items-center gap-2.5 border-b-2 px-1 font-nunito text-[14.4px] font-semibold ${tab === id ? "border-[#ff2f68] text-[#ff2f68]" : "border-transparent text-black hover:text-[#ff2f68]"}`}>{label}<span className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 font-nunito text-[11px] font-medium ${tab === id ? "bg-[#ffebf1] text-[#ff2f68]" : "bg-[#f3f4f6] text-black"}`}>{filterConversations(conversations, id).length}</span></button>)}
        </div>
        <div id="message-tab-panel" role="tabpanel" aria-labelledby={`message-tab-${tab}`} tabIndex={0} className="outline-none">
          {visibleConversations.length ? visibleConversations.map(conversation => {
            const person = allDashboardCaregivers.find(person => person.id === conversation.caregiverId);
            return person ? <MessageRow key={conversation.id} conversation={conversation} caregiver={person} onReply={() => { updateConversation(conversation.id, { unread: false }); setSelectedId(conversation.id); }} /> : null;
          }) : <div className="px-6 py-14 text-center"><MessageSquare size={36} className="mx-auto mb-4 text-[#ff2f68]" /><h2 className="font-jakarta text-lg font-semibold text-[#344054]">{tab === "unread" ? "You’re all caught up" : tab === "starred" ? "No starred conversations yet" : tab === "archived" ? "No archived conversations" : "No messages yet"}</h2><p className="mt-2 font-nunito text-sm text-[#667085]">{tab === "starred" ? "Open a conversation and use the star to keep it handy." : tab === "archived" ? "Conversations you archive will appear here." : "Your caregiver conversations will appear here."}</p></div>}
        </div>
      </section>}
      <ReplyModal conversation={selected} caregiver={caregiver} onClose={() => setSelectedId(null)} onDraftChange={draft => { if (selected) updateConversation(selected.id, { draft }); }} onReply={() => { if (selected) saveReply(selected.id); }} onStar={() => { if (selected) toggleStar(selected.id); }} onArchive={() => { if (!selected) return; updateConversation(selected.id, { archived: !selected.archived }); setNotice(`Conversation ${selected.archived ? "restored" : "archived"}.`); setSelectedId(null); }} />
    </main>
  );
}
