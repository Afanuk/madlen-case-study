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
