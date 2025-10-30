import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";

function ForYou({ accessToken, spotifyAPI }) {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopTracks() {
      try {
        if (!accessToken) {
          console.warn('[For You Page] No access token available');
          return;
        }

        const response = await fetch(`${spotifyAPI}/me/top/tracks?time_range=short_term&limit=50`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          console.error('[For You Page] Failed to fetch top tracks:', response.status);
          return;
        }

        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setTopTracks(data.items);
        }
      } catch (error) {
        console.error('[For You Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopTracks();
  }, [accessToken, spotifyAPI]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 1296,
      margin: '10px auto',
      padding: '0 30px',
      gap: '30px'
    }}>
      {/* Back to Home link */}
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
      <Typography variant="h4" sx={{ fontWeight: 600 }}>For You</Typography>

      {/* Loading state */}
      {loading && (
        <Typography>Loading your top tracks...</Typography>
      )}

      {/* Tracks Grid */}
      {!loading && topTracks.length > 0 && (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {topTracks.map(track => (
            <SongMedium
              key={track.id}
              song={track}
            />
          ))}
        </Box>
      )}

      {/* Empty state */}
      {!loading && topTracks.length === 0 && (
        <Typography>No top tracks found. Start listening to music to see your personalized recommendations!</Typography>
      )}
    </Box>
  );
}

export default ForYou;
