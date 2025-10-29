// Vercel Serverless Function: Handle OAuth Callback and Exchange Code for Tokens
export default async function handler(req, res) {
  const { code, state, error } = req.query;

  // Handle authorization errors
  if (error) {
    return res.redirect(`/?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.REDIRECT_URI;

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
      console.error('Token exchange failed:', errorData);
      return res.redirect(`/?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Redirect to frontend with tokens in URL hash (will be stored in localStorage)
    // Using hash instead of query params for better security
    const frontendUrl = new URL('/', process.env.FRONTEND_URL || req.headers.origin);
    frontendUrl.hash = `access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token}&expires_in=${tokenData.expires_in}`;

    res.redirect(frontendUrl.toString());
  } catch (error) {
    console.error('Callback error:', error);
    res.redirect(`/?error=server_error`);
  }
}
