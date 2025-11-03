import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";
import { spotifyAPI } from '../api/spotify-client';

function Radio({ accessToken, market }) {
  const { trackId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedTrack, setSeedTrack] = useState(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        if (!accessToken || !trackId) {
          console.warn('[Radio Page] No access token or track ID available');
          return;
        }

        // First, fetch the seed track info
        const trackData = await spotifyAPI.directRequest(`/tracks/${trackId}`);

        if (trackData) {
          setSeedTrack(trackData);
          console.log('[Radio Page] Seed track:', trackData.name, 'by', trackData.artists[0].name);
        }

        // Fetch recommendations based on this track (market parameter will be auto-added by proxy)
        console.log('[Radio Page] Fetching recommendations for track:', trackId);

        try {
          const recommendationsData = await spotifyAPI.getRecommendations({
            seedTracks: trackId,
            limit: 50,
            market: market
          });

          console.log('[Radio Page] Recommendations response:', recommendationsData);

          if (recommendationsData && recommendationsData.tracks && recommendationsData.tracks.length > 0) {
            setTracks(recommendationsData.tracks);
          } else {
            console.warn('[Radio Page] No recommendations found');
          }
        } catch (recommendError) {
          console.error('[Radio Page] Failed to fetch recommendations:', recommendError);

          // Try fallback: use artist seed instead
          if (trackData && trackData.artists && trackData.artists.length > 0) {
            console.log('[Radio Page] Trying fallback with artist seed...');
            const artistId = trackData.artists[0].id;

            try {
              const fallbackData = await spotifyAPI.getRecommendations({
                seedArtists: artistId,
                limit: 50,
                market: market
              });

              console.log('[Radio Page] Fallback recommendations response:', fallbackData);
              if (fallbackData && fallbackData.tracks && fallbackData.tracks.length > 0) {
                setTracks(fallbackData.tracks);
              }
            } catch (fallbackError) {
              console.error('[Radio Page] Fallback also failed:', fallbackError);
            }
          }
        }
      } catch (error) {
        console.error('[Radio Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [accessToken, trackId, market]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1296,
        margin: '10px auto',
        padding: '0 30px',
      }}>
        <Typography>Loading recommendations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 1296,
      margin: '10px auto',
      padding: '0 30px',
      gap: '30px'
    }}>
      {/* Back button */}
      <Link
        component={RouterLink}
        to="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          textDecoration: 'none',
          color: 'primary.main',
          fontWeight: '500',
          fontSize: '14px',
          '&:hover': {
            color: 'secondary.main'
          }
        }}
      >
        <ArrowBackIcon sx={{ fontSize: '20px' }} />
        Back to Home
      </Link>

      {/* Title */}
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Radio
        </Typography>
        {seedTrack && (
          <Typography variant="subtitle1" sx={{ color: 'text.secondary', marginTop: 1 }}>
            Based on "{seedTrack.name}" by {seedTrack.artists[0].name}
          </Typography>
        )}
      </Box>

      {/* Tracks Grid */}
      {tracks.length > 0 && (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {tracks.map(track => (
            <SongMedium
              key={track.id}
              song={track}
            />
          ))}
        </Box>
      )}

      {/* Empty state */}
      {tracks.length === 0 && !loading && (
        <Typography>No recommendations found.</Typography>
      )}
    </Box>
  );
}

export default Radio;
