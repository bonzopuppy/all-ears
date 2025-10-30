// Custom hook to detect and cache user's market (country)
import { useState, useEffect } from 'react';
import { spotifyAPI } from '../api/spotify-client';
import { storage } from '../utils/storage';

export const useMarket = (accessToken) => {
  const [market, setMarket] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    const fetchMarket = async () => {
      try {
        const profile = await spotifyAPI.getUserData('profile');
        if (profile && profile.country) {
          setMarket(profile.country);
          storage.setUserMarket(profile.country);
        }
      } catch (error) {
        console.error('[useMarket] Failed to fetch user market:', error);
        // Fallback to US
        setMarket('US');
      }
    };

    // Check localStorage first
    const cachedMarket = storage.getUserMarket();
    if (cachedMarket) {
      setMarket(cachedMarket);
    } else {
      fetchMarket();
    }
  }, [accessToken]);

  return market;
};
