import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './errorHandler';

// Validate chat message
export const validateChatMessage = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, model } = req.body;

  if (!message || typeof message !== 'string') {
    throw new ValidationError('Message is required and must be a string');
  }

  if (message.trim().length === 0 && !req.file) {
    throw new ValidationError('Message cannot be empty');
  }

  if (message.length > 10000) {
    throw new ValidationError('Message is too long (max 10000 characters)');
  }

  if (model && typeof model !== 'string') {
    throw new ValidationError('Model must be a string');
  }

  // Validate image if present
  if (req.file) {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(req.file.mimetype)) {
      throw new ValidationError('Invalid image format. Allowed: JPEG, PNG, GIF, WEBP');
    }

    if (req.file.size > 5 * 1024 * 1024) {
      throw new ValidationError('Image size must be less than 5MB');
    }
  }

  next();
};

// Validate conversation ID
export const validateConversationId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw new ValidationError('Invalid conversation ID');
  }

  if (!id.startsWith('conv_')) {
    throw new ValidationError('Invalid conversation ID format');
  }

  next();
};

