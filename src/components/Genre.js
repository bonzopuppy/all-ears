import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";

function Genre({ accessToken, spotifyAPI, genres }) {
  const { genreId } = useParams();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Find genre info from the genres array
  const genre = genres?.find(g => g.id === genreId);

  useEffect(() => {
    async function fetchGenreTracks() {
      try {
        if (!accessToken || !genreId || !genre) {
          console.warn('[Genre Page] No access token, genre ID, or genre data available');
          return;
        }

        // Instead of recommendations API, let's search for playlists with the genre name
        // This is more reliable than recommendations with genre seeds
        const searchQuery = encodeURIComponent(genre.title);
        const response = await fetch(`${spotifyAPI}/search?q=${searchQuery}&type=playlist&limit=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          console.error('[Genre Page] Failed to search playlists:', response.status);
          return;
        }

        const data = await response.json();

        if (data.playlists && data.playlists.items && data.playlists.items.length > 0) {
          // Get the first playlist
          const playlistId = data.playlists.items[0].id;

          // Fetch tracks from that playlist
          const tracksResponse = await fetch(`${spotifyAPI}/playlists/${playlistId}/tracks?limit=50`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });

          if (!tracksResponse.ok) {
            console.error('[Genre Page] Failed to fetch tracks:', tracksResponse.status);
            return;
          }

          const tracksData = await tracksResponse.json();
          if (tracksData.items) {
            // Extract track objects from the playlist items
            const trackObjects = tracksData.items.map(item => item.track).filter(track => track !== null);
            setTracks(trackObjects);
          }
        }
      } catch (error) {
        console.error('[Genre Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreTracks();
  }, [accessToken, spotifyAPI, genreId, genre]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1296,
        margin: '10px auto',
        padding: '0 30px',
      }}>
        <Typography>Loading {genre?.title || 'genre'} tracks...</Typography>
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
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {genre?.title || 'Genre'}
      </Typography>

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
        <Typography>No tracks found for this genre.</Typography>
      )}
    </Box>
  );
}

export default Genre;
