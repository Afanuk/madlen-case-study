import { Router, Request, Response } from 'express';
import { OpenRouterService } from '../services/openrouter.service';
import { conversationService } from '../services/conversation.service';
import { ChatRequest, ChatResponse, Message } from '../types';
import { upload } from '../middleware/upload';

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
 * Send a message and get AI response (with optional image)
 */
router.post('/chat', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { message, model, conversationId } = req.body;
    const imageFile = req.file;

    // Validate request
    if ((!message || message.trim() === '') && !imageFile) {
      return res.status(400).json({ error: 'Message or image is required' });
    }
    if (!model) {
      return res.status(400).json({ error: 'Model is required' });
    }

    // If conversationId is provided, add message to existing conversation
    let conversation;
    const userMessage: Message = {
      role: 'user',
      content: message || '[Image]',
      timestamp: new Date().toISOString(),
    };

    if (conversationId) {
      conversation = conversationService.addMessage(conversationId, userMessage, model);
    } else {
      // Create new conversation
      conversation = conversationService.createConversation(model, userMessage);
    }
    
    // Prepare conversation history for OpenRouter
    const conversationHistory = conversation.messages.map(msg => {
      // For now, only send text content in history (images only in current message)
      return {
        role: msg.role,
        content: msg.content,
      };
    });
    
    // If image is present, modify the last user message to include image
    if (imageFile) {
      // Convert image to base64
      const base64Image = imageFile.buffer.toString('base64');
      const mimeType = imageFile.mimetype;
      
      // Update last message to include image in OpenRouter format
      conversationHistory[conversationHistory.length - 1] = {
        role: 'user',
        content: [
          {
            type: 'text',
            text: message || 'What is in this image?',
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ] as any,
      };
    }
    
    // Call OpenRouter API with full conversation history
    const openRouterResponse = await getOpenRouterService().sendChatCompletion({
      model,
      messages: conversationHistory,
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
      message: assistantText,
      model: openRouterResponse.model,
      conversationId: conversation.id,
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
    // Include full conversation data with messages for better titles
    const fullConversations = conversationList.map(meta => {
      const conv = conversationService.getConversation(meta.id);
      return conv;
    }).filter(conv => conv !== null);
    res.json({ conversations: fullConversations });
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
