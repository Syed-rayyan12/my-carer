"use client";
import { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { useCaregiverDashboard } from '../CaregiverDashboardContext';
import CaregiverModal from '../shared/CaregiverModal';
import type { CaregiverConversation } from './caregiverMessagesData';

export default function CaregiverReplyModal({ conversation, onClose }: { conversation: CaregiverConversation; onClose: () => void }) {
  const { updateConversation, saveReply, busy, setChatOpen } = useCaregiverDashboard();
  const [reply, setReply] = useState(conversation.draft);
  const history = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  useEffect(() => { setChatOpen(true); return () => setChatOpen(false); }, [setChatOpen]);
  useEffect(() => {
    if (history.current) history.current.scrollTop = history.current.scrollHeight;
  }, [conversation.messages?.length]);
  const close = () => { updateConversation({ ...conversation, draft: reply, unread: false }); onClose(); };
  return <CaregiverModal title={`Message ${conversation.name}`} subtitle={conversation.subject} width="large" onClose={close}>
    <form onSubmit={async event => {
      event.preventDefault();
      if (!reply.trim() || busy || sending.current) return;
      sending.current = true;
      try { if (await saveReply(conversation.id, reply.trim())) setReply(''); }
      finally { sending.current = false; }
    }}>
      <div className="px-6 pb-5">
        <div ref={history} role="log" aria-label="Conversation history" aria-live="polite" aria-relevant="additions" className="flex max-h-[38dvh] min-h-40 flex-col gap-3 overflow-y-auto rounded-xl bg-[#f8fafc] p-4">
          {conversation.messages?.length ? conversation.messages.map(message => (
            <div key={message.id} className={`max-w-[85%] ${message.sender === 'you' ? 'self-end' : 'self-start'}`}>
              <p className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${message.sender === 'you' ? 'rounded-br-sm bg-[#ffebf1]' : 'rounded-bl-sm border border-[#eaecf0] bg-white'}`}>{message.body}</p>
              <p className={`mt-1 text-[11px] text-[#667085] ${message.sender === 'you' ? 'text-right' : ''}`}>
                {message.sender === 'you' ? 'You' : conversation.name} · <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
              </p>
            </div>
          )) : <p className="text-sm text-[#667085]">No messages yet. Send a message to start the conversation.</p>}
        </div>
        <label className="mt-5 block text-sm font-semibold">Your message<textarea disabled={busy} required maxLength={4000} autoFocus value={reply} onChange={event => setReply(event.target.value)} placeholder="Write your reply…" className="mt-2 h-28 w-full resize-y rounded-lg border border-[#d0d5dd] p-3 text-sm font-normal outline-none focus:border-[#ff2f68]" /></label>
        <p className="mt-2 text-xs text-[#667085]">Replies appear here automatically while this conversation is open.</p>
      </div>
      <footer className="flex justify-end gap-2 border-t border-[#eaecf0] px-6 py-4">
        <button type="button" onClick={close} className="rounded-lg border border-[#d0d5dd] px-4 py-2.5 text-sm font-semibold">Save Draft & Close</button>
        <button type="submit" disabled={busy || !reply.trim()} className="inline-flex items-center gap-2 rounded-lg bg-[#ff2f68] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><Send size={16} />{busy ? 'Sending…' : 'Send Reply'}</button>
      </footer>
    </form>
  </CaregiverModal>;
}
