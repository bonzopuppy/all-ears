// Vercel Serverless Function: Search Spotify catalog
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const { q, type = 'track,artist,album,playlist', limit = '10' } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  try {
    const params = new URLSearchParams({
      q,
      type,
      limit
    });

    const response = await fetch(`https://api.spotify.com/v1/search?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Search] Spotify API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[Search] Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
