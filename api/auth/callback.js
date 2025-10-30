// Vercel Serverless Function: Handle OAuth callback and exchange code for tokens
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error } = req.query;

  // Handle authorization errors
  if (error) {
    return res.redirect(`/?error=${error}`);
  }

  if (!code) {
    return res.redirect('/?error=no_code');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    console.error('[Callback] Missing environment variables');
    return res.redirect('/?error=server_configuration');
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('[Callback] Token exchange failed:', errorData);
      return res.redirect('/?error=token_exchange_failed');
    }

    const tokenData = await tokenResponse.json();

    // Redirect to frontend with tokens in URL hash
    const frontendUrl = process.env.FRONTEND_URL || req.headers.origin || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/#access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}&expires_in=${tokenData.expires_in}`;

    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error('[Callback] Error:', error);
    res.redirect('/?error=server_error');
  }
}
