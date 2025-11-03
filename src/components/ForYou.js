import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";
import { spotifyAPI } from '../api/spotify-client';

function ForYou({ accessToken }) {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    async function fetchTopTracks() {
      try {
        const data = await spotifyAPI.directRequest('/me/top/tracks?time_range=short_term&limit=50');
        if (data && data.items && data.items.length > 0) {
          setTopTracks(data.items);
        }
      } catch (error) {
        console.error('[ForYou] Error fetching top tracks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopTracks();
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

      <Typography variant="h4" sx={{ fontWeight: 600 }}>For You</Typography>

      {loading && (
        <Typography>Loading your top tracks...</Typography>
      )}

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

      {!loading && topTracks.length === 0 && (
        <Typography>No top tracks found. Start listening to music to see your personalized recommendations!</Typography>
      )}
    </Box>
  );
}

export default ForYou;
