// Custom hook for Spotify OAuth authentication
import { useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { API_ENDPOINTS } from '../utils/constants';

export const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Check for tokens on mount
  useEffect(() => {
    // Check URL hash for OAuth callback
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const access = params.get('access_token');
      const refresh = params.get('refresh_token');
      const expiresIn = params.get('expires_in');
      const errorParam = params.get('error');

      if (errorParam) {
        setError(errorParam);
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }

      if (access && refresh) {
        const expirationTime = Date.now() + parseInt(expiresIn) * 1000;

        storage.setAccessToken(access);
        storage.setRefreshToken(refresh);
        storage.setTokenExpiresAt(expirationTime);

        setAccessToken(access);
        setRefreshToken(refresh);
        setExpiresAt(expirationTime);
        setIsAuthenticated(true);

        // Clean up URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    } else {
      // Check localStorage for existing tokens
      const storedAccess = storage.getAccessToken();
      const storedRefresh = storage.getRefreshToken();
      const storedExpiry = storage.getTokenExpiresAt();

      if (storedAccess && storedRefresh && storedExpiry) {
        setAccessToken(storedAccess);
        setRefreshToken(storedRefresh);
        setExpiresAt(storedExpiry);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        // Cache market
        if (userData.country) {
          storage.setUserMarket(userData.country);
        }
      } else {
        console.error('[useSpotifyAuth] Failed to fetch user profile');
      }
    } catch (error) {
      console.error('[useSpotifyAuth] Error fetching user profile:', error);
    }
  }, [accessToken]);

  const logout = useCallback(() => {
    storage.clearAll();

    setAccessToken(null);
    setRefreshToken(null);
    setExpiresAt(null);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return false;

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        const newExpiresAt = Date.now() + parseInt(data.expires_in) * 1000;

        storage.setAccessToken(data.access_token);
        storage.setTokenExpiresAt(newExpiresAt);

        if (data.refresh_token) {
          storage.setRefreshToken(data.refresh_token);
          setRefreshToken(data.refresh_token);
        }

        setAccessToken(data.access_token);
        setExpiresAt(newExpiresAt);
        return true;
      } else {
        console.error('[useSpotifyAuth] Token refresh failed');
        logout();
        return false;
      }
    } catch (error) {
      console.error('[useSpotifyAuth] Error refreshing token:', error);
      logout();
      return false;
    }
  }, [refreshToken, logout]);

  // Fetch user profile when authenticated
  useEffect(() => {
    if (accessToken && !user) {
      fetchUserProfile();
    }
  }, [accessToken, user, fetchUserProfile]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (isAuthenticated && expiresAt) {
      const timeUntilRefresh = expiresAt - Date.now() - (5 * 60 * 1000);

      if (timeUntilRefresh <= 0) {
        refreshAccessToken();
      } else {
        const timer = setTimeout(() => {
          refreshAccessToken();
        }, timeUntilRefresh);

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, expiresAt, refreshAccessToken]);

  const login = useCallback(() => {
    // Use replace to avoid browser extension interference
    window.location.replace(API_ENDPOINTS.AUTH.LOGIN);
  }, []);

  return {
    accessToken,
    isAuthenticated,
    user,
    error,
    login,
    logout,
    refreshAccessToken
  };
};
