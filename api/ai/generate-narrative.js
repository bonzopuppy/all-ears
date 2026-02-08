import { anthropicClient, safeJsonParse, withKvCache } from '../_lib/anthropic';
import { getClientIp, rateLimit } from '../_lib/rateLimit';

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';

function narrativePrompt({ fromNode, toNode, connectionType }) {
  return `You are a music historian and storyteller.

Explain the musical connection between:
FROM: ${fromNode?.name || fromNode?.nodeName} (${fromNode?.type || fromNode?.nodeType})
TO: ${toNode?.name || toNode?.nodeName} (${toNode?.type || toNode?.nodeType})
CONNECTION TYPE: ${connectionType}

Write a compelling narrative (150-200 words) in an accessible tone (like public radio music journalism).

Return STRICT JSON ONLY with this shape:
{
  "narrative": "...",
  "keyPoints": ["...", "..."],
  "year": 1979,
  "sources": ["..."]
}

Rules:
- If you are unsure about dates, omit the year (set it to null) rather than guessing.
- Sources can be general references (e.g. "Wikipedia", "AllMusic", "Band interview") and may be empty.
- No markdown.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rl = await rateLimit({
    key: `${getClientIp(req)}:ai:generate-narrative`,
    limit: parseInt(process.env.AI_RL_NARRATIVE_PER_MIN || '20', 10),
    windowSec: 60
  });
  res.setHeader('X-RateLimit-Remaining', rl.remaining);
  res.setHeader('X-RateLimit-Reset', rl.reset);
  if (!rl.ok) return res.status(429).json({ error: 'Rate limit exceeded' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { fromNode, toNode, connectionType = 'related' } = body || {};

  if (!fromNode || !toNode) {
    return res.status(400).json({ error: 'fromNode and toNode are required' });
  }

  const cacheKey = `narrative:${fromNode?.id || fromNode?.nodeId}:${toNode?.id || toNode?.nodeId}:${connectionType}`;

  try {
    const result = await withKvCache(cacheKey, 60 * 60 * 24, async () => {
      const prompt = narrativePrompt({ fromNode, toNode, connectionType });
      const client = anthropicClient();
      const msg = await client.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 700,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = msg?.content?.[0]?.text || '';
      const parsed = safeJsonParse(text);
      if (!parsed.ok) {
        console.error('[generate-narrative] JSON parse failed', { text });
        throw new Error('Claude returned invalid JSON');
      }
      return parsed.value;
    });

    return res.status(200).json(result);
  } catch (err) {
    console.error('[generate-narrative] error', err);
    return res.status(500).json({ error: 'Failed to generate narrative' });
  }
}
