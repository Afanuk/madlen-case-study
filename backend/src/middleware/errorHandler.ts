import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log error details
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Don't leak error details in production for non-operational errors
  if (process.env.NODE_ENV === 'production' && !isOperational) {
    message = 'Something went wrong';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Rate limiting errors
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests, please try again later') {
    super(message, 429);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// Not found errors
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404);
  }
}

// OpenRouter API errors
export class OpenRouterError extends AppError {
  constructor(message: string, statusCode: number = 502) {
    super(`OpenRouter API Error: ${message}`, statusCode);
  }
}
