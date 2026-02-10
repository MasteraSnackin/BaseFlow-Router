import { type Request, type Response, type NextFunction } from 'express';
import { type ZodSchema, ZodError } from 'zod';
import { AppError, ValidationError } from './errors.js';

/**
 * Validation middleware factory
 * Validates request body against a Zod schema
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new ValidationError(
          'Invalid request data',
          error.issues.map((e: any) => ({
            path: e.path.join('.'),
            message: e.message
          }))
        );
        return res.status(validationError.statusCode).json(validationError.toJSON());
      }
      next(error);
    }
  };
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.headers['x-request-id'] || `req-${Date.now()}`;
  const timestamp = new Date().toISOString();

  // Log strict JSON for production observability
  console.error(JSON.stringify({
    level: 'ERROR',
    timestamp,
    requestId,
    path: req.path,
    method: req.method,
    errorMessage: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    body: req.body
  }));

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      ...err.toJSON(),
      requestId
    });
  }

  // Handle SyntaxError (JSON parse error) from Express body-parser
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_JSON',
        message: 'Invalid JSON payload received',
        timestamp,
        requestId
      }
    });
  }

  // Default internal server error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message,
      timestamp,
      requestId
    }
  });
}

/**
 * Async route handler wrapper
 * Catches async errors and passes them to error handler
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
