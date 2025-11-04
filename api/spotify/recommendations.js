// Vercel Serverless Function: Get track recommendations using Related Artists
// NOTE: Spotify deprecated the /recommendations endpoint in Nov 2024
// This implementation uses Related Artists + Top Tracks as an alternative
export default async function handler(req, res) {
  console.log('[Recommendations] Handler called, method:', req.method, 'query:', req.query);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  console.log('[Recommendations] Auth header present:', !!authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[Recommendations] No valid authorization header');
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }

  const token = authHeader.split(' ')[1];

  // Get query parameters
  const { seed_tracks, seed_artists, limit = '20', market } = req.query;

  if (!seed_tracks && !seed_artists) {
    return res.status(400).json({
      error: 'Either seed_tracks or seed_artists is required'
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
        userMarket = 'US';
      }
    }

    let artistId = seed_artists;

    // If seed is a track, get the artist ID from the track
    if (seed_tracks && !seed_artists) {
      const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${seed_tracks}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!trackResponse.ok) {
        return res.status(trackResponse.status).json({ error: 'Failed to fetch track info' });
      }

      const trackData = await trackResponse.json();
      artistId = trackData.artists[0].id;
      console.log('[Recommendations] Got artist ID from track:', artistId);
    }

    // Get related artists
    console.log('[Recommendations] Fetching related artists for:', artistId);
    const relatedResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    console.log('[Recommendations] Related artists response status:', relatedResponse.status);

    if (!relatedResponse.ok) {
      const errorText = await relatedResponse.text();
      console.error('[Recommendations] Related artists error:', errorText);
      return res.status(relatedResponse.status).json({ error: 'Failed to fetch related artists', details: errorText });
    }

    const relatedData = await relatedResponse.json();
    const relatedArtists = relatedData.artists.slice(0, 10); // Get up to 10 related artists

    console.log('[Recommendations] Found', relatedArtists.length, 'related artists');

    // Get top tracks from each related artist
    const trackPromises = relatedArtists.map(artist =>
      fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=${userMarket}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json())
    );

    const topTracksResults = await Promise.all(trackPromises);

    // Collect all tracks and shuffle them
    const allTracks = [];
    topTracksResults.forEach(result => {
      if (result.tracks) {
        // Take 2-3 tracks from each artist to ensure variety
        allTracks.push(...result.tracks.slice(0, 3));
      }
    });

    // Shuffle the tracks
    for (let i = allTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTracks[i], allTracks[j]] = [allTracks[j], allTracks[i]];
    }

    // Return in the same format as the old recommendations endpoint
    const limitNum = parseInt(limit);
    const tracks = allTracks.slice(0, limitNum);

    console.log('[Recommendations] Returning', tracks.length, 'tracks');

    res.status(200).json({
      tracks: tracks,
      seeds: [{ id: artistId, type: 'artist' }]
    });

  } catch (error) {
    console.error('[Recommendations] Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
