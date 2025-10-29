// Vercel Serverless Function: Refresh Expired Access Token
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token refresh failed:', errorData);
      return res.status(response.status).json({ error: 'Failed to refresh token', details: errorData });
    }

    const data = await response.json();

    // Return new access token (refresh token stays the same unless Spotify returns a new one)
    res.status(200).json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      // Include new refresh token if provided, otherwise client keeps using old one
      refresh_token: data.refresh_token || refresh_token
    });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Server error during token refresh' });
  }
}
