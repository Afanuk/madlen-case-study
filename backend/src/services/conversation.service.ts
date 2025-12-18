import { trace, SpanStatusCode } from '@opentelemetry/api';
import { Conversation, ConversationMeta } from "../types/conversation";
import { Message } from '../types/message';

const tracer = trace.getTracer('conversation-service');

export class ConversationService {
  private conversations: Map<string, Conversation> = new Map();

  // Create a new conversation with optional model and initial messages
  createConversation(model: string, initialMessages?: Message): Conversation {
    return tracer.startActiveSpan('conversation.create', (span) => {
      try {
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
        
        span.setAttribute('conversation.id', id);
        span.setAttribute('conversation.model', model);
        span.setAttribute('conversation.initial_message_count', initialMessages ? 1 : 0);
        span.setStatus({ code: SpanStatusCode.OK });
        
        return conversation;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // Add a message to an existing conversation
  addMessage(conversationId: string, message: Message, model?: string): Conversation {
    return tracer.startActiveSpan('conversation.add_message', (span) => {
      try {
        const conversation = this.conversations.get(conversationId);
        const now = new Date().toISOString();
        
        span.setAttribute('conversation.id', conversationId);
        span.setAttribute('message.role', message.role);
        
        if (!conversation) {
          const error = new Error(`Conversation with ID ${conversationId} not found`);
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
          throw error;
        }
        
        conversation.messages.push(message);
        conversation.meta.lastUpdatedAt = now;
        conversation.meta.messageCount += 1;
        if (model) {
          conversation.meta.model = model;
        }
        this.conversations.set(conversationId, conversation);
        
        span.setAttribute('conversation.message_count', conversation.meta.messageCount);
        span.setStatus({ code: SpanStatusCode.OK });
        
        return conversation;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
  }
  
  // Retrieve a conversation by ID
  getConversation(conversationId: string): Conversation | null {
    return tracer.startActiveSpan('conversation.get', (span) => {
      try {
        span.setAttribute('conversation.id', conversationId);
        const conversation = this.conversations.get(conversationId) || null;
        
        if (conversation) {
          span.setAttribute('conversation.found', true);
          span.setAttribute('conversation.message_count', conversation.messages.length);
          span.setStatus({ code: SpanStatusCode.OK });
        } else {
          span.setAttribute('conversation.found', false);
          span.setStatus({ code: SpanStatusCode.OK });
        }
        
        return conversation;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
  }

  // List conversation metadata
  listConversations(): Array<ConversationMeta> {
    return tracer.startActiveSpan('conversation.list', (span) => {
      try {
        const resultConversations: Array<ConversationMeta> = [];
        this.conversations.forEach((conv) => {
          resultConversations.push(conv.meta);
        });
        
        span.setAttribute('conversation.total_count', resultConversations.length);
        span.setStatus({ code: SpanStatusCode.OK });
        
        // Sort by last updated descending
        return resultConversations.sort((a, b) => +new Date(b.lastUpdatedAt).getTime() - +new Date(a.lastUpdatedAt).getTime());
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ code: SpanStatusCode.ERROR });
        throw error;
      } finally {
        span.end();
      }
    });
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
