/**
 * Upstash Redis-backed rate limiter.
 * Works across Vercel serverless instances (shared state).
 * Falls back to in-memory when UPSTASH env vars are missing (local dev).
 */

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null

/**
 * Webhook rate limiter: 100 req / 60s per IP
 */
export const webhookRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      prefix: "rl:webhook",
    })
  : null

/**
 * Auth rate limiter: 10 req / 60s per IP (login, register, password reset, OTP)
 */
export const authRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      prefix: "rl:auth",
    })
  : null

/**
 * Contact/newsletter rate limiter: 5 req / hour per IP
 */
export const contactRateLimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "3600 s"),
      prefix: "rl:contact",
    })
  : null

/**
 * Helper to check rate limit with graceful fallback.
 * Returns { allowed: true } if Redis is not configured (dev).
 */
export async function checkRedisRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  if (!limiter) {
    // Fallback: allow everything (local dev without Redis)
    return { allowed: true, remaining: 999, resetAt: Date.now() + 60_000 }
  }

  const result = await limiter.limit(identifier)
  return {
    allowed: result.success,
    remaining: result.remaining,
    resetAt: result.reset,
  }
}
