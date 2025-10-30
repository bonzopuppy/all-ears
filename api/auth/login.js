// Vercel Serverless Function: Initiate Spotify OAuth Flow
export default function handler(req, res) {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.REDIRECT_URI;

  // Required scopes for full functionality
  const scopes = [
    'streaming',                      // Play full tracks
    'user-read-playback-state',      // Read playback state
    'user-modify-playback-state',    // Control playback
    'user-read-email',               // User email
    'user-read-private',             // User profile
    'playlist-read-private',         // Access private playlists
    'playlist-read-collaborative',   // Access collaborative playlists
    'user-top-read',                 // User's top tracks
  ].join(' ');

  // Generate random state for security
  const state = Math.random().toString(36).substring(7);

  // Build Spotify authorization URL
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', clientId);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', redirectUri);
  authUrl.searchParams.append('scope', scopes);
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('show_dialog', 'true'); // Force login dialog

  // Redirect user to Spotify authorization page
  res.redirect(authUrl.toString());
}
