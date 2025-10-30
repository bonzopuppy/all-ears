// Vercel Serverless Function: Get album or playlist tracks
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const { type, id, limit = '50' } = req.query;

  if (!type || !id || !['album', 'playlist'].includes(type)) {
    return res.status(400).json({
      error: 'Valid type (album/playlist) and id required'
    });
  }

  try {
    const url = `https://api.spotify.com/v1/${type}s/${id}/tracks?limit=${limit}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Albums] Spotify API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[Albums] Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
