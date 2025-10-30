// Custom hook for Spotify API calls with loading and error states
import { useState, useCallback } from 'react';
import { spotifyAPI, SpotifyAPIError } from '../api/spotify-client';

export const useSpotifyAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => setError(null), []);

  const apiCall = useCallback(async (apiMethod, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiMethod(...args);
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      setError(err);

      // Log error for debugging
      if (err instanceof SpotifyAPIError) {
        console.error(`[SpotifyAPI] Error (${err.status}):`, err.message, err.response);
      } else {
        console.error('[SpotifyAPI] Unexpected error:', err);
      }

      return null;
    }
  }, []);

  return {
    loading,
    error,
    clearError,
    apiCall,
    // Expose API instance
    api: spotifyAPI
  };
};
