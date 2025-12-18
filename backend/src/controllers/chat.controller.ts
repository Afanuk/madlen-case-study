import { Request, Response, NextFunction } from 'express';
import { OpenRouterService } from '../services/openrouter.service';
import { conversationService } from '../services/conversation.service';
import { ChatResponse } from '../types/chat';
import { Message } from '../types/message';
import { NotFoundError } from '../middleware/errorHandler';

let openRouterService: OpenRouterService;

// Initialize service lazily
const getOpenRouterService = () => {
  if (!openRouterService) {
    openRouterService = new OpenRouterService();
  }
  return openRouterService;
};

/**
 * Send a chat message and get AI response
 */
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, model, conversationId } = req.body;
    const imageFile = req.file;

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
    const conversationHistory = conversation.messages.map((msg) => {
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
    const assistantText =
      openRouterResponse.choices[0]?.message?.content || 'No response';

    // Build assistant message and add to conversation
    const assistantMessage: Message = {
      role: 'assistant',
      content: assistantText,
      timestamp: new Date().toISOString(),
    };

    conversationService.addMessage(
      conversation.id,
      assistantMessage,
      openRouterResponse.model
    );

    // Create response
    const response: ChatResponse = {
      message: assistantText,
      model: openRouterResponse.model,
      conversationId: conversation.id,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get list of available models
 */
export const getModels = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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
    next(error);
  }
};

/**
 * List all conversations
 */
export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversationList = conversationService.listConversations();
    // Include full conversation data with messages for better titles
    const fullConversations = conversationList
      .map((meta) => {
        const conv = conversationService.getConversation(meta.id);
        return conv;
      })
      .filter((conv) => conv !== null);

    res.json({ conversations: fullConversations });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific conversation by ID
 */
export const getConversationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const conversationId = req.params.id;
    const conversation = conversationService.getConversation(conversationId);

    if (!conversation) {
      throw new NotFoundError('Conversation');
    }

    res.json({ conversation });
  } catch (error) {
    next(error);
  }
};
