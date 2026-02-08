/**
 * Helpers for serverless functions that need the Spotify user.
 */

export function getBearerToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
}

export async function fetchSpotifyMe(token) {
  const resp = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    const message = err?.error?.message || `Spotify /me failed (${resp.status})`;
    const e = new Error(message);
    e.status = resp.status;
    e.details = err;
    throw e;
  }
  return resp.json();
}
