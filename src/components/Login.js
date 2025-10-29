import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';

function Login() {
  const { login } = useSpotifyAuth();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Welcome to All Ears
        </Typography>

        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          Discover and play full songs from Spotify
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Login with your Spotify account to access:
        </Typography>

        <Box sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✓ Play full-length tracks
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✓ Access the real Top 50 global chart
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✓ Browse your playlists
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ✓ Personalized recommendations
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          onClick={login}
          sx={{
            backgroundColor: '#1DB954',
            color: 'white',
            fontWeight: 600,
            fontSize: '1.1rem',
            padding: '12px 48px',
            borderRadius: '50px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#1ed760'
            }
          }}
        >
          Login with Spotify
        </Button>

        <Typography variant="caption" sx={{ mt: 3, color: 'text.secondary' }}>
          Note: Spotify Premium required for full playback
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;
