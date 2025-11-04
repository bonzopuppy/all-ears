import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";
import { spotifyAPI } from '../api/spotify-client';
import { useMusicContext } from './MusicContext';

function Genre({ accessToken, genres }) {
  const { playAll, shuffleAll } = useMusicContext();
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
          setLoading(false);
          return;
        }

        console.log('[Genre Page] Fetching tracks for category:', genreId, genre.title);

        // Search for playlists related to this genre
        console.log('[Genre Page] Searching for playlists with query:', genre.title);
        const searchData = await spotifyAPI.search(genre.title, 'playlist', 20);
        console.log('[Genre Page] Search response:', searchData);

        if (searchData.playlists && searchData.playlists.items && searchData.playlists.items.length > 0) {
          // Filter out null playlists
          const validPlaylists = searchData.playlists.items.filter(p => p !== null && p.id);

          if (validPlaylists.length === 0) {
            console.warn('[Genre Page] No valid playlists found in search results');
            setLoading(false);
            return;
          }

          const playlist = validPlaylists[0];
          const playlistId = playlist.id;
          console.log('[Genre Page] Using playlist from search:', playlist.name, 'Playlist ID:', playlistId);

          // Fetch tracks from that playlist
          const tracksData = await spotifyAPI.directRequest(`/playlists/${playlistId}/tracks?limit=50`);

          if (tracksData && tracksData.items) {
            const trackObjects = tracksData.items.map(item => item.track).filter(track => track !== null);
            setTracks(trackObjects);
          }
        } else {
          console.warn('[Genre Page] No playlists found for:', genre.title);
        }
      } catch (error) {
        console.error('[Genre Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGenreTracks();
  }, [accessToken, genreId, genre]);

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

      {/* Title and Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          {genre?.title || 'Genre'}
        </Typography>
        {tracks.length > 0 && (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => playAll(tracks)}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'secondary.main' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Play All
            </Button>
            <Button
              variant="contained"
              startIcon={<ShuffleIcon />}
              onClick={() => shuffleAll(tracks)}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'secondary.main' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Shuffle
            </Button>
          </Box>
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
        <Typography>No tracks found for this genre.</Typography>
      )}
    </Box>
  );
}

export default Genre;
