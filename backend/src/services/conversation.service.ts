import { Conversation, ConversationMeta, Message } from "../types";

export class ConversationService {
  private conversations: Map<string, Conversation> = new Map();

  // Create a new conversation with optional model and initial messages
  createConversation(model: string, initialMessages?: Message): Conversation {
    const id = `conv_${Date.now()}`;
    const createdAt = new Date().toISOString();
    const conversation: Conversation = {
      id,
      meta: {
        id,
        model,
        createdAt,
        lastUpdatedAt: createdAt,
        messageCount: initialMessages ? 1 : 0,
      },
      messages: initialMessages ? [initialMessages] : [],
    };
    this.conversations.set(id, conversation);
    return conversation;
  }

  // Add a message to an existing conversation
  addMessage(conversationId: string, message: Message, model?: string): Conversation {
    const conversation = this.conversations.get(conversationId);
    const now = new Date().toISOString();
    if (!conversation) {
      throw new Error(`Conversation with ID ${conversationId} not found`);
    }
    conversation.messages.push(message);
    conversation.meta.lastUpdatedAt = now;
    conversation.meta.messageCount += 1;
    if (model) {
      conversation.meta.model = model;
    }
    this.conversations.set(conversationId, conversation);
    return conversation;
  }
  
  // Retrieve a conversation by ID
  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  // List conversation metadata
  listConversations(): Array<ConversationMeta> {
    const resultConversations: Array<ConversationMeta> = [];
    this.conversations.forEach((conv) => {
      resultConversations.push(conv.meta);
    });
    // Sort by last updated descending
    return resultConversations.sort((a, b) => +new Date(b.lastUpdatedAt).getTime() - +new Date(a.lastUpdatedAt).getTime());
  }

  // Delete a conversation by ID
  deleteConversation(conversationId: string): boolean {
    return this.conversations.delete(conversationId);
  }

  // Clear all conversations
  clearConversations(): void {
    this.conversations.clear();
  }
}

// Singleton instance
export const conversationService = new ConversationService();
