import crypto from 'crypto';
import { sql } from '../_lib/db.js';
import { getBearerToken, fetchSpotifyMe } from '../_lib/spotifyAuth.js';

function randomShareToken() {
  return crypto.randomBytes(18).toString('base64url');
}

export default async function handler(req, res) {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized - No token provided' });

  let me;
  try {
    me = await fetchSpotifyMe(token);
  } catch (e) {
    return res.status(e.status || 401).json({ error: e.message });
  }

  const userId = me.id;

  if (req.method === 'GET') {
    const limit = Math.min(parseInt(req.query.limit || '25', 10), 100);
    const offset = Math.max(parseInt(req.query.offset || '0', 10), 0);

    try {
      const result = await sql`
        SELECT id, title, starting_node_type, starting_node_name, created_at, updated_at, is_public, share_token
        FROM journeys
        WHERE user_id = ${userId}
        ORDER BY updated_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return res.status(200).json({ journeys: result.rows });
    } catch (err) {
      console.error('[journeys:index] list error', err);
      return res.status(500).json({ error: 'Failed to list journeys' });
    }
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      title,
      startingNodeType,
      startingNodeId,
      startingNodeName,
      nodesVisited = [],
      tracks = [],
      graph = {},
      isPublic = false
    } = body || {};

    if (!startingNodeType || !startingNodeId || !startingNodeName) {
      return res.status(400).json({
        error: 'startingNodeType, startingNodeId, startingNodeName are required'
      });
    }

    const shareToken = isPublic ? randomShareToken() : null;

    try {
      const result = await sql`
        INSERT INTO journeys (
          user_id,
          title,
          starting_node_type,
          starting_node_id,
          starting_node_name,
          nodes_visited,
          tracks,
          graph,
          is_public,
          share_token
        )
        VALUES (
          ${userId},
          ${title || null},
          ${startingNodeType},
          ${startingNodeId},
          ${startingNodeName},
          ${nodesVisited},
          ${tracks},
          ${graph},
          ${isPublic},
          ${shareToken}
        )
        RETURNING id, share_token
      `;

      return res.status(201).json({
        id: result.rows[0].id,
        shareToken: result.rows[0].share_token
      });
    } catch (err) {
      console.error('[journeys:index] create error', err);
      return res.status(500).json({ error: 'Failed to create journey' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
