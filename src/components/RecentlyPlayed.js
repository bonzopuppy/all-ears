import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";
import { spotifyAPI } from '../api/spotify-client';

function RecentlyPlayed({ accessToken }) {
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    async function fetchRecentlyPlayed() {
      try {
        const data = await spotifyAPI.directRequest('/me/player/recently-played?limit=50');
        if (data && data.items && data.items.length > 0) {
          // Extract tracks from the recently-played items
          const tracks = data.items.map(item => item.track);
          setRecentTracks(tracks);
        }
      } catch (error) {
        console.error('[RecentlyPlayed] Error fetching recently played tracks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentlyPlayed();
  }, [accessToken]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      maxWidth: 1296,
      margin: '10px auto',
      padding: '0 30px',
      gap: '30px'
    }}>
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

      <Typography variant="h4" sx={{ fontWeight: 600 }}>Recent Selections</Typography>

      {loading && (
        <Typography>Loading your recently played tracks...</Typography>
      )}

      {!loading && recentTracks.length > 0 && (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {recentTracks.map((track, index) => (
            <SongMedium
              key={`${track.id}-${index}`}
              song={track}
            />
          ))}
        </Box>
      )}

      {!loading && recentTracks.length === 0 && (
        <Typography>No recently played tracks found. Start listening to music to see your listening history!</Typography>
      )}
    </Box>
  );
}

export default RecentlyPlayed;
