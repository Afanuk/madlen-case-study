import axios, { AxiosInstance } from 'axios';
import { trace, context, SpanStatusCode } from '@opentelemetry/api';
import { OpenRouterRequest, OpenRouterResponse } from '../types/openrouter';
import { Model } from '../types/model';

const tracer = trace.getTracer('openrouter-service');

export class OpenRouterService {
  private client: AxiosInstance;
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }

    this.client = axios.create({
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // Optional: for OpenRouter rankings
        'X-Title': 'Madlen Chat Interface', // Optional: for OpenRouter rankings
      },
    });
  }

  /**
   * Send a chat completion request to OpenRouter
   */
  async sendChatCompletion(request: OpenRouterRequest): Promise<OpenRouterResponse> {
    return tracer.startActiveSpan('openrouter.chat_completion', async (span) => {
      try {
        // Add span attributes for observability
        span.setAttribute('openrouter.model', request.model);
        span.setAttribute('openrouter.message_count', request.messages.length);
        
        const startTime = Date.now();
        const response = await this.client.post<OpenRouterResponse>(
          '/chat/completions',
          request
        );
        const duration = Date.now() - startTime;
        
        // Record successful completion
        span.setAttribute('openrouter.response_model', response.data.model);
        span.setAttribute('openrouter.duration_ms', duration);
        span.setStatus({ code: SpanStatusCode.OK });
        
        return response.data;
      } catch (error) {
        // Record error in span
        span.recordException(error as Error);
        span.setStatus({ 
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        
        if (axios.isAxiosError(error)) {
          span.setAttribute('openrouter.error_status', error.response?.status || 0);
          throw new Error(
            `OpenRouter API Error: ${error.response?.data?.error?.message || error.message}`
          );
        }
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get available models from OpenRouter
   */
  async getAvailableModels(): Promise<Model[]> {
    return tracer.startActiveSpan('openrouter.get_models', async (span) => {
      try {
        const response = await this.client.get('/models');
        const models = response.data.data || [];
        
        span.setAttribute('openrouter.models_count', models.length);
        span.setStatus({ code: SpanStatusCode.OK });
        
        // Return formatted models with essential info
        return models.map((model: any) => ({
          id: model.id,
          name: model.name || model.id,
          description: model.description,
          pricing: model.pricing ? {
            prompt: model.pricing.prompt,
            completion: model.pricing.completion,
          } : undefined,
        }));
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({ 
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Failed to fetch models'
        });
        
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to fetch models: ${error.response?.data?.error?.message || error.message}`
          );
        }
        throw error;
      } finally {
        span.end();
      }
    });
  }

  /**
   * Get a list of popular free models (fallback if API call fails)
   */
  getFreeModels(): Model[] {
    return [
      {
        id: 'openai/gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient OpenAI model',
      },
      {
        id: 'meta-llama/llama-3.2-3b-instruct:free',
        name: 'Llama 3.2 3B Instruct (Free)',
        description: 'Free Meta Llama model',
      },
      {
        id: 'google/gemini-flash-1.5',
        name: 'Gemini Flash 1.5',
        description: 'Fast Google Gemini model',
      },
      {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B Instruct (Free)',
        description: 'Free Mistral model',
      },
    ];
  }
}
