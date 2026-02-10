// Vercel Serverless Function: Initiate Spotify OAuth flow
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  console.log('[Login] Environment check:', {
    hasClientId: !!clientId,
    hasRedirectUri: !!redirectUri,
    clientId: clientId ? `${clientId.substring(0, 8)}...` : 'MISSING',
    redirectUri: redirectUri || 'MISSING'
  });

  if (!clientId || !redirectUri) {
    console.error('[Login] Missing environment variables');
    console.error('[Login] Available env vars:', Object.keys(process.env).filter(k => k.includes('SPOTIFY')));
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const scopes = [
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-email',
    'user-read-private',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'user-top-read',
    'user-library-read',
    'user-follow-read',
  ].join(' ');

  const state = Math.random().toString(36).substring(7);

  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('show_dialog', 'false');

  const finalUrl = authUrl.toString();
  console.log('[Login] Redirecting to:', finalUrl);
  console.log('[Login] Redirect URI in request:', redirectUri);

  res.redirect(302, finalUrl);
}
