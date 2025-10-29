import { useState, useEffect } from 'react';

export const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for tokens on mount and in URL hash (after OAuth callback)
  useEffect(() => {
    // Check if tokens are in URL hash (from OAuth callback)
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const access = params.get('access_token');
      const refresh = params.get('refresh_token');
      const expiresIn = params.get('expires_in');

      if (access && refresh) {
        const expirationTime = Date.now() + parseInt(expiresIn) * 1000;

        // Store tokens
        localStorage.setItem('spotify_access_token', access);
        localStorage.setItem('spotify_refresh_token', refresh);
        localStorage.setItem('spotify_token_expires_at', expirationTime.toString());

        setAccessToken(access);
        setRefreshToken(refresh);
        setExpiresAt(expirationTime);
        setIsAuthenticated(true);

        // Clean up URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      // Check localStorage for existing tokens
      const storedAccess = localStorage.getItem('spotify_access_token');
      const storedRefresh = localStorage.getItem('spotify_refresh_token');
      const storedExpiry = localStorage.getItem('spotify_token_expires_at');

      if (storedAccess && storedRefresh && storedExpiry) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setExpiresAt(parseInt(storedExpiry));
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch user profile when authenticated
  useEffect(() => {
    if (accessToken && !user) {
      fetchUserProfile();
    }
  }, [accessToken, user]);

  // Check if token needs refresh before API calls
  useEffect(() => {
    if (isAuthenticated && expiresAt) {
      // Refresh token 5 minutes before expiry
      const timeUntilRefresh = expiresAt - Date.now() - (5 * 60 * 1000);

      if (timeUntilRefresh <= 0) {
        // Token expired or about to expire, refresh immediately
        refreshAccessToken();
      } else {
        // Schedule refresh
        const timer = setTimeout(() => {
          refreshAccessToken();
        }, timeUntilRefresh);

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, expiresAt]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        const newExpiresAt = Date.now() + parseInt(data.expires_in) * 1000;

        // Update tokens
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_token_expires_at', newExpiresAt.toString());

        if (data.refresh_token) {
          localStorage.setItem('spotify_refresh_token', data.refresh_token);
          setRefreshToken(data.refresh_token);
        }

        setAccessToken(data.access_token);
        setExpiresAt(newExpiresAt);
      } else {
        // Refresh failed, log user out
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const login = () => {
    // Redirect to our backend OAuth endpoint
    window.location.href = '/api/auth/login';
  };

  const logout = () => {
    // Clear tokens
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expires_at');

    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    accessToken,
    isAuthenticated,
    user,
    login,
    logout,
    refreshAccessToken
  };
};
