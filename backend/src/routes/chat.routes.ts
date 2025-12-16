import { Router, Request, Response } from 'express';
import { OpenRouterService } from '../services/openrouter.service';
import { conversationService } from '../services/conversation.service';
import { ChatRequest, ChatResponse, Message } from '../types';

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
      return res.status(400).json({ error: 'Missing required fields: message and model' });
    }

    // If conversationId is provided, add message to existing conversation
    let conversation;
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    if (conversationId) {
      conversation = conversationService.addMessage(conversationId, userMessage, model);
    } else {
      // Create new conversation
      conversation = conversationService.createConversation(model, userMessage);
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
    const assistantText = openRouterResponse.choices[0]?.message?.content || 'No response';

    // Build assistant message and add to conversation
    const assistantMessage: Message = {
      role: 'assistant',
      content: assistantText,
      timestamp: new Date().toISOString(),
    };
    
    conversationService.addMessage(conversation.id, assistantMessage, openRouterResponse.model);

    // Create response
    const response: ChatResponse = {
      response: assistantText,
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

/**
 * GET /api/conversations
 * List conversation metadata
 */
router.get('/conversations', async (req: Request, res: Response) => {
  try {
    const conversationList = conversationService.listConversations();
    res.json({ conversations: conversationList });
  } catch (error) {
    console.error('Conversation list fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

/**
 * GET /api/conversations/:id
 * Get a specific conversation by ID
 */
router.get('/conversations/:id', async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id;
    const conversation = conversationService.getConversation(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ conversation });
  } catch (error) {
    console.error('Conversation fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

export default router;
