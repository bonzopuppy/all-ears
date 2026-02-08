import { kv } from './kv';

/**
 * Very small rate limiter using KV.
 *
 * Strategy: sliding window counter (good enough for MVP).
 *
 * @param {object} opts
 * @param {string} opts.key - Unique key (e.g. ip + route)
 * @param {number} opts.limit - Max requests per window
 * @param {number} opts.windowSec - Window size in seconds
 * @returns {Promise<{ok: boolean, remaining: number, reset: number}>}
 */
export async function rateLimit({ key, limit, windowSec }) {
  const now = Date.now();
  const windowId = Math.floor(now / (windowSec * 1000));
  const redisKey = `rl:${key}:${windowId}`;

  // If KV isn't configured, allow by default.
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return { ok: true, remaining: limit, reset: now + windowSec * 1000 };
  }

  const count = await kv.incr(redisKey);
  if (count === 1) {
    await kv.expire(redisKey, windowSec);
  }

  return {
    ok: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: (windowId + 1) * windowSec * 1000
  };
}

export function getClientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}
