// Vercel Serverless Function: Get Spotify recommendations with market parameter
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Get query parameters
  const { seed_tracks, seed_artists, seed_genres, limit = '20', market } = req.query;

  if (!seed_tracks && !seed_artists && !seed_genres) {
    return res.status(400).json({
      error: 'At least one seed (track, artist, or genre) is required'
    });
  }

  try {
    // If no market provided, fetch user's market from profile
    let userMarket = market;
    if (!userMarket) {
      const profileResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        userMarket = profile.country;
      } else {
        // Default to US if profile fetch fails
        userMarket = 'US';
      }
    }

    // Build recommendations URL with market parameter
    const params = new URLSearchParams();
    if (seed_tracks) params.append('seed_tracks', seed_tracks);
    if (seed_artists) params.append('seed_artists', seed_artists);
    if (seed_genres) params.append('seed_genres', seed_genres);
    params.append('limit', limit);
    if (userMarket) params.append('market', userMarket);

    const spotifyUrl = `https://api.spotify.com/v1/recommendations?${params.toString()}`;

    const response = await fetch(spotifyUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('[Recommendations] Spotify API error:', error);
      return res.status(response.status).json(error);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('[Recommendations] Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
