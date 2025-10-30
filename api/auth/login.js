// Vercel Serverless Function: Initiate Spotify OAuth flow
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error('[Login] Missing environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const scopes = [
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-email',
    'user-read-private',
    'playlist-read-private',
    'playlist-read-collaborative',
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

  res.redirect(302, authUrl.toString());
}
