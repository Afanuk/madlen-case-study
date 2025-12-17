// Message types
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// Chat request/response
export interface ChatRequest {
  message: string;
  model: string;
  conversationId?: string;
}

export interface ChatResponse {
  message: string;
  model: string;
  conversationId: string;
  timestamp: string;
}

// OpenRouter API types
export interface OpenRouterMessage {
  role: string;
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Model information
export interface Model {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

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
  messages: Message[]; // uses existing Message type
}