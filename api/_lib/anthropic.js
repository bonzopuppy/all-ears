import Anthropic from '@anthropic-ai/sdk';
import { kv } from './kv';

let _client;

export function anthropicClient() {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

/**
 * Small helper for caching AI results.
 *
 * @param {string} key
 * @param {number} ttlSec
 * @param {() => Promise<any>} fn
 */
export async function withKvCache(key, ttlSec, fn) {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return fn();
  }

  const cached = await kv.get(key);
  if (cached) return cached;

  const value = await fn();
  await kv.set(key, value, { ex: ttlSec });
  return value;
}

export function safeJsonParse(str) {
  try {
    return { ok: true, value: JSON.parse(str) };
  } catch (e) {
    return { ok: false, error: e };
  }
}
