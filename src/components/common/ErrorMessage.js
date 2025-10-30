import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { SpotifyAPIError } from '../../api/spotify-client';

function ErrorMessage({ error, onRetry }) {
  const isAPIError = error instanceof SpotifyAPIError;

  let message = 'An error occurred';
  let details = null;

  if (isAPIError) {
    switch (error.status) {
      case 401:
        message = 'Authentication expired. Please log in again.';
        break;
      case 403:
        message = 'Access denied. You may not have permission for this content.';
        break;
      case 404:
        message = 'Content not found.';
        break;
      case 429:
        message = 'Too many requests. Please wait a moment and try again.';
        break;
      default:
        message = error.message || 'API request failed';
        details = error.response;
    }
  } else {
    message = error?.message || error?.toString() || 'An unexpected error occurred';
  }

  return (
    <Box sx={{ maxWidth: 600, margin: '20px auto', padding: 2 }}>
      <Alert severity="error">
        <Typography variant="body1" fontWeight="600">
          {message}
        </Typography>
        {details && (
          <Typography variant="body2" sx={{ marginTop: 1, opacity: 0.8, fontFamily: 'monospace' }}>
            {JSON.stringify(details, null, 2)}
          </Typography>
        )}
      </Alert>
      {onRetry && (
        <Button
          variant="outlined"
          onClick={onRetry}
          sx={{ marginTop: 2 }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
}

export default ErrorMessage;
