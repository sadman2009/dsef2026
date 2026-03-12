/**
 * Rate Limiting Middleware
 * In-memory rate limiting for API endpoints
 * For production, consider using Redis or similar for distributed rate limiting
 */

import type { NextRequest } from 'next/server';

interface RateLimitRecord {
  count: number;
  resetTime: number;
  blocked: boolean;
}

// Configuration
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // per minute
const BLOCK_DURATION_MS = 60 * 1000; // 1 minute block

// In-memory store (use Redis for production)
const rateLimitMap = new Map<string, RateLimitRecord>();

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  rateLimitMap.forEach((record, key) => {
    if (record.resetTime < now) {
      rateLimitMap.delete(key);
    }
  });
}, WINDOW_MS);

export function checkRateLimit(request: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  const identifier = `rate-limit:${ip}`;
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    // New window
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + WINDOW_MS,
      blocked: false,
    });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetTime: now + WINDOW_MS };
  }

  if (record.blocked) {
    // Still blocked
    return { allowed: false, remaining: 0, resetTime: now + BLOCK_DURATION_MS };
  }

  if (record.count >= MAX_REQUESTS) {
    // Block the IP
    record.blocked = true;
    record.resetTime = now + BLOCK_DURATION_MS;
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  // Increment counter
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS - record.count, resetTime: record.resetTime };
}

export function getRateLimitHeaders(remaining: number, resetTime: number) {
  return {
    'X-RateLimit-Limit': MAX_REQUESTS.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': resetTime.toString(),
  };
}
