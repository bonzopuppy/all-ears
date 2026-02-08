import { sql } from '../../_lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const result = await sql`
      SELECT id, title, starting_node_type, starting_node_id, starting_node_name,
             nodes_visited, tracks, graph, created_at, updated_at
      FROM journeys
      WHERE share_token = ${token} AND is_public = true
      LIMIT 1
    `;

    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json({ journey: result.rows[0] });
  } catch (err) {
    console.error('[journeys:shared] error', err);
    return res.status(500).json({ error: 'Failed to load shared journey' });
  }
}
