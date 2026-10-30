"use client";

import { useEffect, useState } from "react";
import { initialConversations, isConversation, type Conversation } from "./messagesData";

const storageKey = "my-carer-conversations";

export function useMessages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(isConversation)) setConversations(parsed);
      }
    } catch { setStorageError(true); }
    finally { setReady(true); }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(storageKey, JSON.stringify(conversations)); }
    catch { setStorageError(true); }
  }, [conversations, ready]);

  function updateConversation(id: string, update: Partial<Conversation>) {
    setConversations(current => current.map(conversation => conversation.id === id ? { ...conversation, ...update } : conversation));
  }

  function toggleStar(id: string) {
    setConversations(current => current.map(conversation => conversation.id === id ? { ...conversation, starred: !conversation.starred } : conversation));
  }

  function saveReply(id: string) {
    setConversations(current => current.map(conversation => {
      if (conversation.id !== id || !conversation.draft.trim()) return conversation;
      return { ...conversation, unread: false, archived: false, draft: "", messages: [...conversation.messages, { id: crypto.randomUUID(), body: conversation.draft.trim(), sender: "you", createdAt: new Date().toISOString(), delivery: "local" }] };
    }));
  }

  return { conversations, ready, storageError, updateConversation, toggleStar, saveReply };
}
