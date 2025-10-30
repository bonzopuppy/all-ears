import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";
import { useMusicContext } from './MusicContext';

function Album({ accessToken, spotifyAPI }) {
  const { albumId } = useParams();
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useMusicContext();

  useEffect(() => {
    async function fetchAlbum() {
      try {
        if (!accessToken || !albumId) {
          console.warn('[Album Page] No access token or album ID available');
          return;
        }

        // Fetch album details
        const response = await fetch(`${spotifyAPI}/albums/${albumId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          console.error('[Album Page] Failed to fetch album:', response.status);
          return;
        }

        const data = await response.json();
        setAlbum(data);
        setTracks(data.tracks.items);
      } catch (error) {
        console.error('[Album Page] Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbum();
  }, [accessToken, spotifyAPI, albumId]);

  const handlePlayAlbum = () => {
    if (album && tracks.length > 0) {
      // Play the entire album using context
      const firstTrack = tracks[0];
      const trackWithAlbum = {
        ...firstTrack,
        album: {
          images: album.images,
          name: album.name
        }
      };
      playTrack(trackWithAlbum, album.uri);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1296,
        margin: '10px auto',
        padding: '0 30px',
      }}>
        <Typography>Loading album...</Typography>
      </Box>
    );
  }

  if (!album) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 1296,
        margin: '10px auto',
        padding: '0 30px',
      }}>
        <Typography>Album not found.</Typography>
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

      {/* Album Header */}
      <Box sx={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Album Cover */}
        <Box
          component="img"
          src={album.images[0]?.url}
          alt={album.name}
          sx={{
            width: 250,
            height: 250,
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: '0 4px 60px rgba(0,0,0,0.5)'
          }}
        />

        {/* Album Info */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            Album
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {album.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {album.artists[0].name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              • {album.release_date ? new Date(album.release_date).getFullYear() : ''} • {album.total_tracks} songs
            </Typography>
          </Box>

          {/* Play Button */}
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handlePlayAlbum}
            sx={{
              width: 'fit-content',
              mt: 2,
              borderRadius: 8,
              textTransform: 'none',
              fontSize: '16px',
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            Play Album
          </Button>
        </Box>
      </Box>

      {/* Track List */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>Tracks</Typography>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {tracks.map((track, index) => {
            const trackWithAlbum = {
              ...track,
              album: {
                images: album.images,
                name: album.name
              }
            };
            return (
              <SongMedium
                key={track.id}
                song={trackWithAlbum}
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

export default Album;
