import { anthropicClient, safeJsonParse, withKvCache } from '../_lib/anthropic.js';
import { sql } from '../_lib/db.js';
import { getClientIp, rateLimit } from '../_lib/rateLimit.js';

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-latest';

function pathwayPrompt({ nodeType, nodeId, nodeName, context }) {
  const history = Array.isArray(context?.previousNodes) ? context.previousNodes : [];
  const historyLine = history.length
    ? `\nPrevious nodes visited (most recent last): ${history.map((n) => n?.name).filter(Boolean).join(' -> ')}`
    : '';

  return `You are a music historian creating an interactive exploration graph for a music discovery app.

Starting point:
- Type: ${nodeType}
- Name: ${nodeName}
- Spotify ID: ${nodeId}
${historyLine}

Generate 3 to 5 pathways from this node. Each pathway should contain 2 to 4 nodes.

CRITICAL: Pay strict attention to chronological direction. An artist active in the 1960s cannot be in the "legacy" pathway of an artist from the 2010s. Verify: for "influences", every node must have been active BEFORE ${nodeName}. For "legacy", every node must have emerged AFTER ${nodeName}.

Allowed pathway types (use these exact strings):
- influences — artists/genres that came BEFORE ${nodeName} and shaped their sound (e.g., for Taylor Swift: Shania Twain, Dolly Parton — NOT the Rolling Stones)
- legacy — artists/genres that emerged AFTER ${nodeName} and were clearly shaped by them (only use this if ${nodeName} is old enough to have actually influenced later artists)
- collaborators — artists who directly worked with or alongside ${nodeName} on recordings or tours
- contemporaries — artists active in the same era/scene as ${nodeName} but not direct collaborators
- genre_connections — related genres or subgenres

For each pathway, include:
- type (one of the allowed strings)
- title (short human title)
- nodes: array of nodes with:
  - nodeType: 'artist' | 'track' | 'genre'
  - nodeId: Spotify ID or a stable identifier for genres
  - nodeName
  - description: exactly 2 sentences explaining the connection
  - representativeTrackTitles: 1-2 track titles (strings) that represent the node

Return STRICT JSON ONLY with this shape:
{
  "pathways": [
    {
      "type": "influences",
      "title": "What influenced this?",
      "nodes": [
        {
          "nodeType": "artist",
          "nodeId": "spotify:artist:...",
          "nodeName": "...",
          "description": "...",
          "representativeTrackTitles": ["...", "..."]
        }
      ]
    }
  ]
}

Do not include markdown. Do not include any keys other than those described.`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const rl = await rateLimit({
    key: `${getClientIp(req)}:ai:generate-pathways`,
    limit: parseInt(process.env.AI_RL_PATHWAYS_PER_MIN || '10', 10),
    windowSec: 60
  });
  res.setHeader('X-RateLimit-Remaining', rl.remaining);
  res.setHeader('X-RateLimit-Reset', rl.reset);
  if (!rl.ok) return res.status(429).json({ error: 'Rate limit exceeded' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { nodeType, nodeId, nodeName, context } = body || {};

  if (!nodeType || !nodeId || !nodeName) {
    return res.status(400).json({ error: 'nodeType, nodeId, and nodeName are required' });
  }

  const cacheKey = `pathways:${nodeType}:${nodeId}`;

  try {
    // L2 cache: Postgres
    const cached = await sql`
      SELECT pathways
      FROM journey_nodes_cache
      WHERE node_type = ${nodeType}
        AND node_id = ${nodeId}
        AND (cache_expires_at IS NULL OR cache_expires_at > NOW())
      LIMIT 1
    `;

    if (cached?.rows?.length) {
      return res.status(200).json(cached.rows[0].pathways);
    }

    // L1 cache: KV (short TTL) to protect against bursts
    const result = await withKvCache(cacheKey, 60 * 60, async () => {
      const prompt = pathwayPrompt({ nodeType, nodeId, nodeName, context });
      const client = anthropicClient();

      const msg = await client.messages.create({
        model: DEFAULT_MODEL,
        max_tokens: 4096,
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = msg?.content?.[0]?.text || '';
      const parsed = safeJsonParse(text);
      if (!parsed.ok) {
        console.error('[generate-pathways] JSON parse failed', { text });
        throw new Error('Claude returned invalid JSON');
      }
      return parsed.value;
    });

    // Store to Postgres with 24h TTL
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await sql`
      INSERT INTO journey_nodes_cache (node_type, node_id, pathways, cache_expires_at)
      VALUES (${nodeType}, ${nodeId}, ${result}, ${expires})
      ON CONFLICT (node_type, node_id)
      DO UPDATE SET
        pathways = EXCLUDED.pathways,
        generated_at = NOW(),
        cache_expires_at = EXCLUDED.cache_expires_at
    `;

    return res.status(200).json(result);
  } catch (err) {
    console.error('[generate-pathways] error', err);
    return res.status(500).json({ error: 'Failed to generate pathways' });
  }
}
