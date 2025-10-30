// Vercel Serverless Function: Browse Spotify content (new releases, featured playlists, categories)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const { endpoint, limit = '20', country = 'US' } = req.query;

  // Valid endpoints: new-releases, featured-playlists, categories
  const validEndpoints = ['new-releases', 'featured-playlists', 'categories'];
  if (!endpoint || !validEndpoints.includes(endpoint)) {
    return res.status(400).json({
      error: 'Valid endpoint required',
      validEndpoints: validEndpoints
    });
  }

  try {
    const params = new URLSearchParams({ limit, country });
    const url = `https://api.spotify.com/v1/browse/${endpoint}?${params}`;

    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Browse] Spotify API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[Browse] Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
