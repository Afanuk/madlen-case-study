import { Message } from './message';

// Conversation types
export interface ConversationMeta {
  id: string;
  model: string;
  createdAt: string;
  lastUpdatedAt: string;
  messageCount: number;
}

export interface Conversation {
  id: string;
  meta: ConversationMeta;
  messages: Message[];
}
