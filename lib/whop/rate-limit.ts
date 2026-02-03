/**
 * Rate limiting utility for webhook endpoints
 * Simple in-memory rate limiter with configurable limits
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

/**
 * Rate limit configuration
 */
export const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // Max 100 requests per minute per IP
};

/**
 * Check if request should be rate limited
 * @param identifier - Unique identifier (IP address, API key, etc.)
 * @param maxRequests - Maximum requests allowed in window
 * @param windowMs - Time window in milliseconds
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = RATE_LIMIT_CONFIG.maxRequests,
  windowMs: number = RATE_LIMIT_CONFIG.windowMs
): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const record = store[identifier];

  // If no record exists or window has expired, create new record
  if (!record || now > record.resetAt) {
    store[identifier] = {
      count: 1,
      resetAt: now + windowMs,
    };

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt: now + windowMs,
    };
  }

  // Increment count
  record.count++;

  // Check if limit exceeded
  if (record.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Clean up expired records (run periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetAt < now) {
      delete store[key];
    }
  });
}

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}
