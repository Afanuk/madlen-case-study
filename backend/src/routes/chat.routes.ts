import { Router } from 'express';
import { upload } from '../middleware/upload';
import { validateChatMessage, validateConversationId } from '../middleware/validation';
import * as chatController from '../controllers/chat.controller';

const router = Router();

/**
 * POST /api/chat
 * Send a message and get AI response (with optional image)
 */
router.post(
  '/chat',
  upload.single('image'),
  validateChatMessage,
  chatController.sendMessage
);

/**
 * GET /api/models
 * Get list of available models
 */
router.get(
  '/models', 
  chatController.getModels
);

/**
 * GET /api/conversations
 * List conversation metadata
 */
router.get(
  '/conversations', 
  chatController.getConversations
);

/**
 * GET /api/conversations/:id
 * Get a specific conversation by ID
 */
router.get(
  '/conversations/:id',
  validateConversationId,
  chatController.getConversationById
);

export default router;
