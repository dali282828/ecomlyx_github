import { LRUCache } from 'lru-cache';
import type { NextRequest } from 'next/server';

type Options = {
  max: number;
  windowMs: number;
  message?: string;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
};

const tokenCache = new LRUCache({
  max: 500,
  ttl: 15 * 60 * 1000, // 15 minutes
});

export function rateLimit(options: Options) {
  const { max, windowMs } = options;

  return {
    check: async (request: NextRequest): Promise<RateLimitResult> => {
      const ip = getClientIP(request);
      const tokenKey = `rate_limit_${ip}`;
      
      const tokenData = tokenCache.get(tokenKey) as {
        count: number;
        resetTime: number;
      } | undefined;

      const now = Date.now();
      const resetTime = now + windowMs;

      if (!tokenData || now > tokenData.resetTime) {
        // First request or window reset
        tokenCache.set(tokenKey, { count: 1, resetTime });
        return {
          success: true,
          limit: max,
          remaining: max - 1,
          reset: new Date(resetTime),
        };
      }

      if (tokenData.count >= max) {
        // Rate limit exceeded
        return {
          success: false,
          limit: max,
          remaining: 0,
          reset: new Date(tokenData.resetTime),
        };
      }

      // Increment counter
      tokenData.count++;
      tokenCache.set(tokenKey, tokenData);

      return {
        success: true,
        limit: max,
        remaining: max - tokenData.count,
        reset: new Date(tokenData.resetTime),
      };
    },
  };
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
} 