import { sql } from '../_lib/db.js';
import { getBearerToken, fetchSpotifyMe } from '../_lib/spotifyAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: 'Unauthorized - No token provided' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const { journeyId, title, description, trackUris } = body || {};

  let me;
  try {
    me = await fetchSpotifyMe(token);
  } catch (e) {
    return res.status(e.status || 401).json({ error: e.message });
  }

  let finalTitle = title;
  let finalDescription = description;
  let uris = Array.isArray(trackUris) ? trackUris : null;

  if (journeyId) {
    try {
      const j = await sql`
        SELECT title, tracks
        FROM journeys
        WHERE id = ${journeyId} AND user_id = ${me.id}
        LIMIT 1
      `;
      if (!j.rows.length) return res.status(404).json({ error: 'Journey not found' });

      finalTitle = finalTitle || j.rows[0].title || 'My Musical Journey';
      finalDescription =
        finalDescription ||
        'Created from a Musical Journey on All Ears';

      const tracks = j.rows[0].tracks || [];
      uris = tracks
        .map((t) => t?.uri || t?.spotifyUri || t?.id)
        .filter((u) => typeof u === 'string' && u.startsWith('spotify:track:'));
    } catch (err) {
      console.error('[create-playlist] load journey error', err);
      return res.status(500).json({ error: 'Failed to load journey' });
    }
  }

  if (!finalTitle) return res.status(400).json({ error: 'title is required (or provide journeyId)' });
  if (!uris || !uris.length) return res.status(400).json({ error: 'No track URIs to add' });

  try {
    // 1) Create playlist
    const createResp = await fetch(`https://api.spotify.com/v1/users/${me.id}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: finalTitle,
        description: finalDescription,
        public: false
      })
    });

    if (!createResp.ok) {
      const err = await createResp.json().catch(() => ({}));
      console.error('[create-playlist] spotify create error', err);
      return res.status(createResp.status).json({ error: 'Spotify playlist create failed', details: err });
    }

    const playlist = await createResp.json();

    // 2) Add tracks in batches of 100
    for (let i = 0; i < uris.length; i += 100) {
      const batch = uris.slice(i, i + 100);
      const addResp = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uris: batch })
      });

      if (!addResp.ok) {
        const err = await addResp.json().catch(() => ({}));
        console.error('[create-playlist] spotify add tracks error', err);
        return res.status(addResp.status).json({ error: 'Spotify add tracks failed', details: err });
      }
    }

    return res.status(200).json({ playlist });
  } catch (err) {
    console.error('[create-playlist] server error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
