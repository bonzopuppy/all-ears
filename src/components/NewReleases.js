import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import AlbumMedium from "./AlbumMedium";
import { spotifyAPI } from '../api/spotify-client';

function NewReleases({ accessToken }) {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    async function fetchNewReleases() {
      try {
        const data = await spotifyAPI.directRequest('/browse/new-releases?limit=50');
        if (data && data.albums && data.albums.items && data.albums.items.length > 0) {
          setNewReleases(data.albums.items);
        }
      } catch (error) {
        console.error('[NewReleases] Error fetching new releases:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewReleases();
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

      <Typography variant="h4" sx={{ fontWeight: 600 }}>New Releases</Typography>

      {loading && (
        <Typography>Loading new releases...</Typography>
      )}

      {!loading && newReleases.length > 0 && (
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {newReleases.map(album => (
            <AlbumMedium
              key={album.id}
              album={album}
              accessToken={accessToken}
            />
          ))}
        </Box>
      )}

      {!loading && newReleases.length === 0 && (
        <Typography>No new releases found.</Typography>
      )}
    </Box>
  );
}

export default NewReleases;
