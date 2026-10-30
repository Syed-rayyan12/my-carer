export type MessageTab = "all" | "unread" | "starred" | "archived";

export type ConversationMessage = {
  id: string;
  body: string;
  sender: "caregiver" | "you";
  createdAt: string;
  delivery: "received" | "local";
};

export type Conversation = {
  id: string;
  caregiverId: string;
  online: boolean;
  unread: boolean;
  starred: boolean;
  archived: boolean;
  draft: string;
  messages: ConversationMessage[];
};

export const messageTabs: { id: MessageTab; label: string }[] = [
  { id: "all", label: "All Messages" }, { id: "unread", label: "Unread" },
  { id: "starred", label: "Starred" }, { id: "archived", label: "Archived" },
];

export const initialConversations: Conversation[] = [
  { id: "conversation-sarah", caregiverId: "sarah-mitchell", online: true, unread: true, starred: true, archived: false, draft: "", messages: [
    { id: "sarah-1", body: "Hello! I saw your care requirement for your mum and would love to learn a little more about the support she needs.", sender: "caregiver", createdAt: "2026-10-27T09:15:00", delivery: "received" },
    { id: "sarah-2", body: "I’m available Monday to Friday and have experience supporting people living with dementia. Would you like to arrange a quick chat?", sender: "caregiver", createdAt: "2026-10-27T10:30:00", delivery: "received" },
  ] },
  { id: "conversation-james", caregiverId: "james-wilson", online: false, unread: true, starred: false, archived: false, draft: "", messages: [
    { id: "james-1", body: "Hi, thank you for getting in touch about respite care. I would be happy to help your family.", sender: "caregiver", createdAt: "2026-10-27T08:45:00", delivery: "received" },
    { id: "james-2", body: "I can help with mobility support and daily routines. Please let me know which days work best for you.", sender: "caregiver", createdAt: "2026-10-27T09:45:00", delivery: "received" },
  ] },
  { id: "conversation-amira", caregiverId: "amira-khan", online: true, unread: false, starred: false, archived: false, draft: "", messages: [
    { id: "amira-1", body: "Hello, I offer companionship and personal care in Salford and Manchester. I would be happy to discuss your requirements.", sender: "caregiver", createdAt: "2026-10-26T16:20:00", delivery: "received" },
    { id: "amira-2", body: "Thank you for sharing the details. I’m available this weekend if you would like to meet and talk through the care plan.", sender: "caregiver", createdAt: "2026-10-27T08:20:00", delivery: "received" },
  ] },
  { id: "conversation-priya", caregiverId: "priya-patel", online: false, unread: false, starred: false, archived: false, draft: "", messages: [
    { id: "priya-1", body: "Hi there, I’m a registered nurse and caregiver with experience in personal care and dementia support.", sender: "caregiver", createdAt: "2026-10-26T14:10:00", delivery: "received" },
    { id: "priya-2", body: "I’ve reviewed your care needs and would be happy to answer any questions about my experience and availability.", sender: "caregiver", createdAt: "2026-10-26T15:40:00", delivery: "received" },
  ] },
];

export function filterConversations(conversations: Conversation[], tab: MessageTab) {
  if (tab === "archived") return conversations.filter(conversation => conversation.archived);
  const active = conversations.filter(conversation => !conversation.archived);
  if (tab === "unread") return active.filter(conversation => conversation.unread);
  if (tab === "starred") return active.filter(conversation => conversation.starred);
  return active;
}

export function formatMessageTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-GB", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
}

export function isConversation(value: unknown): value is Conversation {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.caregiverId === "string" && typeof item.online === "boolean" && typeof item.unread === "boolean" && typeof item.starred === "boolean" && typeof item.archived === "boolean" && typeof item.draft === "string" && Array.isArray(item.messages) && item.messages.every(message => message && typeof message === "object" && typeof message.id === "string" && typeof message.body === "string" && typeof message.createdAt === "string" && (message.sender === "caregiver" || message.sender === "you") && (message.delivery === "received" || message.delivery === "local"));
}
