import { Router, Request, Response } from 'express';
import { OpenRouterService } from '../services/openrouter.service';
import { ChatRequest, ChatResponse } from '../types';

const router = Router();
let openRouterService: OpenRouterService;

// Initialize service lazily
const getOpenRouterService = () => {
  if (!openRouterService) {
    openRouterService = new OpenRouterService();
  }
  return openRouterService;
};

/**
 * POST /api/chat
 * Send a message and get AI response
 */
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, model, conversationId } = req.body as ChatRequest;

    // Validate request
    if (!message || !model) {
      return res.status(400).json({
        error: 'Missing required fields: message and model',
      });
    }

    // Call OpenRouter API
    const openRouterResponse = await getOpenRouterService().sendChatCompletion({
      model,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    });

    // Extract response
    const assistantMessage = openRouterResponse.choices[0]?.message?.content || 'No response';

    // Create response
    const response: ChatResponse = {
      response: assistantMessage,
      model: openRouterResponse.model,
      conversationId: conversationId || `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to process chat request',
    });
  }
});

/**
 * GET /api/models
 * Get list of available models
 */
router.get('/models', async (req: Request, res: Response) => {
  try {
    // Try to fetch from OpenRouter, fallback to free models list
    let models;
    try {
      models = await getOpenRouterService().getAvailableModels();
    } catch (error) {
      console.warn('Failed to fetch models from OpenRouter, using fallback list');
      models = getOpenRouterService().getFreeModels();
    }

    res.json({ models });
  } catch (error) {
    console.error('Models fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch models',
    });
  }
});

export default router;
