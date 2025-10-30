import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";

function Radio({ accessToken, spotifyAPI }) {
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
        const trackResponse = await fetch(`${spotifyAPI}/tracks/${trackId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (trackResponse.ok) {
          const trackData = await trackResponse.json();
          setSeedTrack(trackData);
          console.log('[Radio Page] Seed track:', trackData.name, 'by', trackData.artists[0].name);
        }

        // Fetch recommendations based on this track
        console.log('[Radio Page] Fetching recommendations for track:', trackId);
        const recommendationsResponse = await fetch(
          `${spotifyAPI}/recommendations?seed_tracks=${trackId}&limit=50`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );

        if (!recommendationsResponse.ok) {
          console.error('[Radio Page] Failed to fetch recommendations:', recommendationsResponse.status);
          const errorText = await recommendationsResponse.text();
          console.error('[Radio Page] Error response:', errorText);
          setLoading(false);
          return;
        }

        const recommendationsData = await recommendationsResponse.json();
        console.log('[Radio Page] Recommendations response:', recommendationsData);

        if (recommendationsData.tracks && recommendationsData.tracks.length > 0) {
          setTracks(recommendationsData.tracks);
        } else {
          console.warn('[Radio Page] No recommendations found');
        }
      } catch (error) {
        console.error('[Radio Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [accessToken, spotifyAPI, trackId]);

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
        to="/all-ears"
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
