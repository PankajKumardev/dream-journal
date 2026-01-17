/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-based rate limiting
 */

import { RATE_LIMITS } from "./constants";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
      if (entry.resetAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000); // Cleanup every minute
}

export interface RateLimitConfig {
  requests: number; // Max requests
  window: number; // Time window in seconds
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (usually IP or userId)
 * @param action - The action being rate limited (e.g., "dreams_create")
 * @param config - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  action: keyof typeof RATE_LIMITS = "DEFAULT",
  config?: RateLimitConfig
): RateLimitResult {
  const limitConfig = config || RATE_LIMITS[action];
  const key = `${action}:${identifier}`;
  const now = Date.now();
  const windowMs = limitConfig.window * 1000;

  let entry = rateLimitStore.get(key);

  // Reset if window has passed
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
  }

  entry.count++;
  rateLimitStore.set(key, entry);

  const remaining = Math.max(0, limitConfig.requests - entry.count);
  const success = entry.count <= limitConfig.requests;

  return {
    success,
    remaining,
    resetAt: entry.resetAt,
  };
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult, config: RateLimitConfig) {
  return {
    "X-RateLimit-Limit": config.requests.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
  };
}

/**
 * Helper to get client IP from request
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "unknown";
}
