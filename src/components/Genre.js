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

        // First, fetch all available categories to see what's actually available
        console.log('[Genre Page] Fetching all available Spotify categories...');
        const categoriesResponse = await fetch(`${spotifyAPI}/browse/categories?limit=50&locale=en_US`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          console.log('[Genre Page] Available categories:', categoriesData.categories.items.map(c => ({ id: c.id, name: c.name })));

          // Try to find a matching category
          const matchingCategory = categoriesData.categories.items.find(cat =>
            cat.name.toLowerCase().includes(genre.title.toLowerCase()) ||
            genre.title.toLowerCase().includes(cat.name.toLowerCase())
          );

          if (matchingCategory) {
            console.log('[Genre Page] Found matching category:', matchingCategory.id, matchingCategory.name);
            const categoryId = matchingCategory.id;

            // Fetch playlists for this category
            const playlistsResponse = await fetch(`${spotifyAPI}/browse/categories/${categoryId}/playlists?limit=1`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });

            if (!playlistsResponse.ok) {
              console.error('[Genre Page] Failed to fetch playlists for category:', categoryId, 'Status:', playlistsResponse.status);
              const errorText = await playlistsResponse.text();
              console.error('[Genre Page] Error response:', errorText);
              setLoading(false);
              return;
            }

            const playlistsData = await playlistsResponse.json();
            console.log('[Genre Page] Playlists response:', playlistsData);

            if (playlistsData.playlists && playlistsData.playlists.items && playlistsData.playlists.items.length > 0) {
              // Get the first playlist
              const playlistId = playlistsData.playlists.items[0].id;

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
            } else {
              console.warn('[Genre Page] No playlists found for category:', categoryId);
            }
          } else {
            console.warn('[Genre Page] No matching category found for:', genre.title);
          }
        } else {
          console.error('[Genre Page] Failed to fetch categories:', categoriesResponse.status);
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
