// LocalStorage utility functions
import { STORAGE_KEYS } from './constants';

export const storage = {
  // Access Token
  getAccessToken: () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token),
  removeAccessToken: () => localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN),

  // Refresh Token
  getRefreshToken: () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),
  removeRefreshToken: () => localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),

  // Token Expiration
  getTokenExpiresAt: () => {
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRES_AT);
    return expiry ? parseInt(expiry, 10) : null;
  },
  setTokenExpiresAt: (timestamp) => localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRES_AT, timestamp.toString()),
  removeTokenExpiresAt: () => localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_AT),

  // User Market
  getUserMarket: () => localStorage.getItem(STORAGE_KEYS.USER_MARKET),
  setUserMarket: (market) => localStorage.setItem(STORAGE_KEYS.USER_MARKET, market),
  removeUserMarket: () => localStorage.removeItem(STORAGE_KEYS.USER_MARKET),

  // Clear all auth data
  clearAll: () => {
    storage.removeAccessToken();
    storage.removeRefreshToken();
    storage.removeTokenExpiresAt();
    storage.removeUserMarket();
  },

  // Check if token is expired
  isTokenExpired: () => {
    const expiresAt = storage.getTokenExpiresAt();
    if (!expiresAt) return true;
    // Consider expired if less than 5 minutes remaining
    return Date.now() >= (expiresAt - 5 * 60 * 1000);
  },
};
