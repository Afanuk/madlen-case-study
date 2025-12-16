import axios, { AxiosInstance } from 'axios';
import { OpenRouterRequest, OpenRouterResponse, Model } from '../types';

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
    try {
      const response = await this.client.post<OpenRouterResponse>(
        '/chat/completions',
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          `OpenRouter API Error: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw error;
    }
  }

  /**
   * Get available models from OpenRouter
   */
  async getAvailableModels(): Promise<Model[]> {
    try {
      const response = await this.client.get('/models');
      const models = response.data.data || [];
      
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
      if (axios.isAxiosError(error)) {
        throw new Error(
          `Failed to fetch models: ${error.response?.data?.error?.message || error.message}`
        );
      }
      throw error;
    }
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
