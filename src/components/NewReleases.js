import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import AlbumMedium from "./AlbumMedium";

function NewReleases({ accessToken, spotifyAPI }) {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewReleases() {
      try {
        if (!accessToken) {
          console.warn('[New Releases Page] No access token available');
          return;
        }

        const response = await fetch(`${spotifyAPI}/browse/new-releases?limit=50`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          console.error('[New Releases Page] Failed to fetch new releases:', response.status);
          return;
        }

        const data = await response.json();
        if (data.albums && data.albums.items && data.albums.items.length > 0) {
          setNewReleases(data.albums.items);
        }
      } catch (error) {
        console.error('[New Releases Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNewReleases();
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
      <Typography variant="h4" sx={{ fontWeight: 600 }}>New Releases</Typography>

      {/* Loading state */}
      {loading && (
        <Typography>Loading new releases...</Typography>
      )}

      {/* Albums Grid */}
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
            />
          ))}
        </Box>
      )}

      {/* Empty state */}
      {!loading && newReleases.length === 0 && (
        <Typography>No new releases found.</Typography>
      )}
    </Box>
  );
}

export default NewReleases;
