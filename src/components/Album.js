import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Link as RouterLink } from 'react-router-dom';
import SongMedium from "./SongMedium";
import { useMusicContext } from './MusicContext';
import { spotifyAPI } from '../api/spotify-client';

function Album({ accessToken }) {
  const { albumId } = useParams();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useMusicContext();

  useEffect(() => {
    if (!accessToken || !albumId) return;

    async function fetchAlbum() {
      try {
        const data = await spotifyAPI.directRequest(`/albums/${albumId}`);
        setAlbum(data);
        setTracks(data.tracks.items);
      } catch (error) {
        console.error('[Album] Error fetching album:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbum();
  }, [accessToken, albumId]);

  const handlePlayAlbum = () => {
    if (tracks.length > 0 && playTrack) {
      playTrack(tracks[0]);
    }
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 1296, margin: '10px auto', padding: '0 30px' }}>
        <Typography>Loading album...</Typography>
      </Box>
    );
  }

  if (!album) {
    return (
      <Box sx={{ maxWidth: 1296, margin: '10px auto', padding: '0 30px' }}>
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

      <Box sx={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        <Box
          component="img"
          src={album.images[0]?.url}
          alt={album.name}
          sx={{
            width: 240,
            height: 240,
            borderRadius: '8px',
            objectFit: 'cover'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 1 }}>
            {album.name}
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', marginBottom: 2 }}>
            {album.artists.map(artist => artist.name).join(', ')}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: 2 }}>
            {album.release_date?.substring(0, 4)} • {tracks.length} tracks
          </Typography>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={handlePlayAlbum}
            sx={{
              backgroundColor: 'secondary.main',
              '&:hover': {
                backgroundColor: '#ff8534'
              }
            }}
          >
            Play Album
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {tracks.map((track, index) => (
          <SongMedium
            key={track.id || index}
            song={track}
          />
        ))}
      </Box>
    </Box>
  );
}

export default Album;
