// Centralized Spotify API Client
import { storage } from '../utils/storage';
import { API_ENDPOINTS, SPOTIFY_API_BASE } from '../utils/constants';

// Custom error class for Spotify API errors
export class SpotifyAPIError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'SpotifyAPIError';
    this.status = status;
    this.response = response;
  }
}

class SpotifyAPIClient {
  constructor() {
    this.baseURL = '/api/spotify';
    this.retryAttempts = 2;
    this.retryDelay = 1000;
  }

  // Main request method with automatic token refresh
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      headers = {},
      body = null,
      params = {},
      retry = this.retryAttempts
    } = options;

    // Get token from storage
    const token = storage.getAccessToken();
    if (!token) {
      throw new SpotifyAPIError('No access token available', 401, null);
    }

    // Build URL with query params
    const url = new URL(endpoint, window.location.origin);
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers
        },
        body: body ? JSON.stringify(body) : null
      });

      // Handle 401 - token expired, try refresh
      if (response.status === 401 && retry > 0) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          return this.request(endpoint, { ...options, retry: retry - 1 });
        }
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SpotifyAPIError(
          errorData.error?.message || `API request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SpotifyAPIError) {
        throw error;
      }
      throw new SpotifyAPIError('Network error', 0, error);
    }
  }

  // Refresh access token
  async refreshToken() {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (response.ok) {
        const data = await response.json();
        const expiresAt = Date.now() + parseInt(data.expires_in) * 1000;

        storage.setAccessToken(data.access_token);
        storage.setTokenExpiresAt(expiresAt);

        if (data.refresh_token) {
          storage.setRefreshToken(data.refresh_token);
        }

        return true;
      }
    } catch (error) {
      console.error('[SpotifyAPI] Token refresh failed:', error);
    }

    return false;
  }

  // Convenience method for search
  async search(query, type = 'track,artist,album,playlist', limit = 10) {
    return this.request(API_ENDPOINTS.SPOTIFY.SEARCH, {
      params: { q: query, type, limit }
    });
  }

  // Convenience method for recommendations
  async getRecommendations({ seedTracks, seedArtists, seedGenres, limit = 20, market }) {
    const params = { limit };
    if (seedTracks) params.seed_tracks = seedTracks;
    if (seedArtists) params.seed_artists = seedArtists;
    if (seedGenres) params.seed_genres = seedGenres;
    if (market) params.market = market;

    return this.request(API_ENDPOINTS.SPOTIFY.RECOMMENDATIONS, { params });
  }

  // Convenience method for browse content
  async getBrowseContent(endpoint, limit = 20, country = 'US') {
    return this.request(API_ENDPOINTS.SPOTIFY.BROWSE, {
      params: { endpoint, limit, country }
    });
  }

  // Convenience method for user data
  async getUserData(endpoint, options = {}) {
    return this.request(API_ENDPOINTS.SPOTIFY.USER, {
      params: { endpoint, ...options }
    });
  }

  // Convenience method for album/playlist tracks
  async getAlbumOrPlaylistTracks(type, id, limit = 50) {
    return this.request(API_ENDPOINTS.SPOTIFY.ALBUMS, {
      params: { type, id, limit }
    });
  }

  // Direct Spotify API calls (for endpoints we don't proxy)
  async directRequest(spotifyEndpoint, options = {}) {
    const token = storage.getAccessToken();
    if (!token) {
      throw new SpotifyAPIError('No access token available', 401, null);
    }

    const url = `${SPOTIFY_API_BASE}${spotifyEndpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      // Handle 401 - token expired
      if (response.status === 401) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry with new token
          const newToken = storage.getAccessToken();
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              'Authorization': `Bearer ${newToken}`,
              'Content-Type': 'application/json',
              ...options.headers
            }
          });

          if (!retryResponse.ok) {
            const error = await retryResponse.json().catch(() => ({}));
            throw new SpotifyAPIError(
              error.error?.message || 'API request failed',
              retryResponse.status,
              error
            );
          }

          return await retryResponse.json();
        }
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new SpotifyAPIError(
          error.error?.message || 'API request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SpotifyAPIError) {
        throw error;
      }
      throw new SpotifyAPIError('Network error', 0, error);
    }
  }
}

// Singleton instance
export const spotifyAPI = new SpotifyAPIClient();
