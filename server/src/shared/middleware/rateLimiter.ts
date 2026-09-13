import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

const windowMs = 60 * 1000; // 1 minute
const maxRequests = 100; // 100 requests per minute per IP
const ipRecords = new Map<string, RateLimitRecord>();

// Periodic cleanup of stale IPs every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRecords.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < windowMs);
    if (record.timestamps.length === 0) {
      ipRecords.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

/**
 * Lightweight Zero-Dependency In-Memory Rate Limiter
 * Protects free-tier Gemini API and MongoDB Atlas instances from DoS/spamming.
 */
export const rateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  // Extract client IP
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  const now = Date.now();
  let record = ipRecords.get(clientIp);

  if (!record) {
    record = { timestamps: [] };
    ipRecords.set(clientIp, record);
  }

  // Filter timestamps within current window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);

  const remaining = Math.max(0, maxRequests - record.timestamps.length);

  res.setHeader('X-RateLimit-Limit', maxRequests);
  res.setHeader('X-RateLimit-Remaining', remaining);

  if (record.timestamps.length >= maxRequests) {
    res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
    res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down to preserve pilgrimage quota.'
    });
    return;
  }

  record.timestamps.push(now);
  next();
};
