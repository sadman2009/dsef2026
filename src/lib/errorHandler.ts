/**
 * Centralized Error Handling
 * Provides consistent error handling across the application
 */

export type ErrorCode = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'DATABASE_ERROR'
  | 'EXTERNAL_API_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'INTERNAL_ERROR';

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  toJSON() {
    return {
      error: this.message,
      code: this.code,
      status: this.status,
      ...(process.env.NODE_ENV === 'development' && { details: this.details }),
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super('DATABASE_ERROR', message, 500, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', public retryAfter?: number) {
    super('RATE_LIMIT_EXCEEDED', message, 429);
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string, details?: unknown) {
    super('EXTERNAL_API_ERROR', message, 502, details);
  }
}

/**
 * Handle unknown errors and convert them to AppError
 */
export function handleError(error: unknown, context: string): AppError {
  if (error instanceof AppError) {
    return error;
  }

  console.error(`[Error in ${context}]:`, error);

  if (error instanceof Error) {
    return new AppError(
      'INTERNAL_ERROR',
      error.message || 'An unexpected error occurred',
      500,
      error
    );
  }

  return new AppError(
    'INTERNAL_ERROR',
    'An unexpected error occurred',
    500,
    error
  );
}

/**
 * Create error response for API endpoints
 */
export function createErrorResponse(error: AppError | Error, includeDetails = false) {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status,
      ...(includeDetails && { details: error.details }),
    };
  }

  return {
    error: error instanceof Error ? error.message : 'Unknown error',
    code: 'INTERNAL_ERROR',
    status: 500,
    ...(includeDetails && { details: error }),
  };
}
