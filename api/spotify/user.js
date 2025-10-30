// Vercel Serverless Function: Get user data (profile, top tracks, top artists)
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const { endpoint, time_range = 'short_term', limit = '20' } = req.query;

  // Valid endpoints: profile, top-tracks, top-artists
  const endpointMap = {
    'profile': 'https://api.spotify.com/v1/me',
    'top-tracks': `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`,
    'top-artists': `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=${limit}`,
  };

  const url = endpointMap[endpoint];
  if (!url) {
    return res.status(400).json({
      error: 'Valid endpoint required',
      validEndpoints: Object.keys(endpointMap)
    });
  }

  try {
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[User] Spotify API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[User] Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
