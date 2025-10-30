// API Constants
export const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
export const LOCAL_API_BASE = '/api';

// OAuth Scopes
export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-email',
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-top-read',
  'user-library-read',
  'user-follow-read',
];

// LocalStorage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'spotify_access_token',
  REFRESH_TOKEN: 'spotify_refresh_token',
  TOKEN_EXPIRES_AT: 'spotify_token_expires_at',
  USER_MARKET: 'user_market',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    CALLBACK: '/api/auth/callback',
    REFRESH: '/api/auth/refresh',
  },
  SPOTIFY: {
    SEARCH: '/api/spotify/search',
    RECOMMENDATIONS: '/api/spotify/recommendations',
    BROWSE: '/api/spotify/browse',
    USER: '/api/spotify/user',
    ALBUMS: '/api/spotify/albums',
  },
};
