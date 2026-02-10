/**
 * Custom error types for the DeFi Router backend
 */

export class AppError extends Error {
  public readonly timestamp: string;

  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    this.timestamp = new Date().toISOString();
    // Maintain prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        details: this.details,
        timestamp: this.timestamp,
        ...(process.env.NODE_ENV !== 'production' && { stack: this.stack })
      }
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details);
    this.name = 'ValidationError';
  }
}

export class RPCError extends AppError {
  constructor(message: string, details?: any) {
    super('RPC_ERROR', message, 503, details);
    this.name = 'RPCError';
  }
}

export class ContractError extends AppError {
  constructor(message: string, details?: any) {
    super('CONTRACT_ERROR', message, 500, details);
    this.name = 'ContractError';
  }
}

export class ExternalAPIError extends AppError {
  constructor(service: string, message: string, details?: any) {
    super('EXTERNAL_API_ERROR', `${service} error: ${message}`, 503, details);
    this.name = 'ExternalAPIError';
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, details?: any) {
    super('CONFIGURATION_ERROR', message, 500, details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    shouldRetry?: (error: any) => boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    shouldRetry = () => true
  } = options;

  let lastError: any;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt or if shouldRetry returns false
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Exponential backoff with cap
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Add timeout to a promise
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new AppError('TIMEOUT', errorMessage, 504)), timeoutMs)
    )
  ]);
}

/**
 * Check if error is retryable (network issues, rate limits, etc.)
 */
export function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return true;
  }

  // HTTP status codes that are retryable
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
  if (error.response?.status && retryableStatusCodes.includes(error.response.status)) {
    return true;
  }

  // Ethers.js specific errors
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
    return true;
  }

  return false;
}

export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if recovered
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private resetTimeout: number;
  private failureThreshold: number;
  private successThreshold: number;

  constructor(
    options: {
      failureThreshold?: number;
      resetTimeout?: number;
      successThreshold?: number;
    } = {}
  ) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000;
    this.successThreshold = options.successThreshold || 2;
  }

  public async call<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.transitionTo(CircuitState.HALF_OPEN);
      } else {
        throw new AppError('CIRCUIT_OPEN', 'Circuit breaker is OPEN', 503);
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.transitionTo(CircuitState.CLOSED);
      }
    }
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.transitionTo(CircuitState.OPEN);
    }
  }

  private transitionTo(newState: CircuitState) {
    this.state = newState;
    const timestamp = new Date().toISOString();
    if (newState === CircuitState.OPEN) {
      console.warn(`[${timestamp}] [CircuitBreaker] State changed to OPEN. All requests blocked for ${this.resetTimeout}ms`);
    } else if (newState === CircuitState.HALF_OPEN) {
      console.log(`[${timestamp}] [CircuitBreaker] State changed to HALF_OPEN. Testing availability...`);
      this.successCount = 0;
    } else {
      console.log(`[${timestamp}] [CircuitBreaker] State changed to CLOSED. Normal operation resumed.`);
      this.failureCount = 0;
      this.successCount = 0;
    }
  }
}
