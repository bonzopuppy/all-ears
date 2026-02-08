import crypto from 'crypto';
import { sql } from '../_lib/db';
import { getBearerToken, fetchSpotifyMe } from '../_lib/spotifyAuth';

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
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing id' });

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT *
        FROM journeys
        WHERE id = ${id} AND user_id = ${userId}
        LIMIT 1
      `;
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ journey: result.rows[0] });
    } catch (err) {
      console.error('[journeys:id] get error', err);
      return res.status(500).json({ error: 'Failed to load journey' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const {
      title,
      nodesVisited,
      tracks,
      graph,
      isPublic,
      rotateShareToken
    } = body || {};

    try {
      // Load current to know current share token/public flag
      const current = await sql`
        SELECT is_public, share_token
        FROM journeys
        WHERE id = ${id} AND user_id = ${userId}
        LIMIT 1
      `;
      if (!current.rows.length) return res.status(404).json({ error: 'Not found' });

      const willBePublic = typeof isPublic === 'boolean' ? isPublic : current.rows[0].is_public;
      const newShareToken = willBePublic
        ? (rotateShareToken ? randomShareToken() : current.rows[0].share_token || randomShareToken())
        : null;

      const result = await sql`
        UPDATE journeys
        SET
          title = COALESCE(${title ?? null}, title),
          nodes_visited = COALESCE(${nodesVisited ?? null}, nodes_visited),
          tracks = COALESCE(${tracks ?? null}, tracks),
          graph = COALESCE(${graph ?? null}, graph),
          is_public = ${willBePublic},
          share_token = ${newShareToken}
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id, is_public, share_token, updated_at
      `;

      return res.status(200).json({ journey: result.rows[0] });
    } catch (err) {
      console.error('[journeys:id] update error', err);
      return res.status(500).json({ error: 'Failed to update journey' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const result = await sql`
        DELETE FROM journeys
        WHERE id = ${id} AND user_id = ${userId}
        RETURNING id
      `;
      if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error('[journeys:id] delete error', err);
      return res.status(500).json({ error: 'Failed to delete journey' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
