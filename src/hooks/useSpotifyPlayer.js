import { useState, useEffect, useRef } from 'react';

export const useSpotifyPlayer = (accessToken) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;

    // Wait for Spotify SDK to load
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'All Ears Web Player',
        getOAuthToken: cb => { cb(accessToken); },
        volume: 0.5
      });

      // Error handling
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Spotify Player initialization error:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Spotify Player authentication error:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Spotify Player account error:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Spotify Player playback error:', message);
      });

      // Playback status updates
      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      // Ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player ready with Device ID', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      // Not Ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsReady(false);
      });

      // Connect to the player
      spotifyPlayer.connect();

      playerRef.current = spotifyPlayer;
      setPlayer(spotifyPlayer);
    };

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
    };
  }, [accessToken]);

  const play = async (spotify_uri) => {
    if (!deviceId || !accessToken) return;

    try {
      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const nextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const previousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const seek = (position_ms) => {
    if (player) {
      player.seek(position_ms);
    }
  };

  return {
    player,
    deviceId,
    isReady,
    isPaused,
    currentTrack,
    position,
    duration,
    play,
    togglePlay,
    nextTrack,
    previousTrack,
    seek
  };
};
