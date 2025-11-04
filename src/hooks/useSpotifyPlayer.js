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

    const initializePlayer = () => {
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
      let previousTrackUri = null;
      spotifyPlayer.addListener('player_state_changed', state => {
        if (!state) return;

        const currentTrackUri = state.track_window.current_track?.uri;

        console.log('🎵 Player state changed:', {
          track: state.track_window.current_track,
          paused: state.paused,
          position: state.position,
          duration: state.duration,
          trackChanged: previousTrackUri !== currentTrackUri
        });

        // Detect track change
        if (previousTrackUri && previousTrackUri !== currentTrackUri) {
          console.log('🔄 Track changed from', previousTrackUri, 'to', currentTrackUri);
        }

        previousTrackUri = currentTrackUri;

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

    // Check if Spotify SDK is already loaded
    if (window.Spotify) {
      initializePlayer();
    } else {
      // Wait for Spotify SDK to load
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
      }
      // Clean up the global callback
      if (window.onSpotifyWebPlaybackSDKReady === initializePlayer) {
        window.onSpotifyWebPlaybackSDKReady = null;
      }
    };
  }, [accessToken]);

  const play = async (spotify_uri, context_uri = null) => {
    if (!deviceId || !accessToken) {
      console.error('[useSpotifyPlayer] Cannot play - missing deviceId or accessToken:', { deviceId, hasToken: !!accessToken });
      return;
    }

    if (!isReady) {
      console.error('[useSpotifyPlayer] Cannot play - player not ready yet');
      return;
    }

    console.log('[useSpotifyPlayer] Playing:', { spotify_uri, context_uri, deviceId });

    try {
      const body = context_uri
        ? JSON.stringify({ context_uri }) // Play album/playlist context
        : JSON.stringify({ uris: [spotify_uri] }); // Play single track

      const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: body,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useSpotifyPlayer] Play request failed:', response.status, errorText);
      } else {
        console.log('[useSpotifyPlayer] Play request successful');
      }
    } catch (error) {
      console.error('[useSpotifyPlayer] Error playing track:', error);
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

  const addToQueue = async (spotify_uri) => {
    if (!deviceId || !accessToken) {
      console.error('[useSpotifyPlayer] Cannot add to queue - missing deviceId or accessToken');
      return;
    }

    console.log('[useSpotifyPlayer] Adding to queue:', spotify_uri);

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(spotify_uri)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useSpotifyPlayer] Add to queue failed:', response.status, errorText);
      } else {
        console.log('[useSpotifyPlayer] Successfully added to queue');
      }
    } catch (error) {
      console.error('[useSpotifyPlayer] Error adding track to queue:', error);
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
    seek,
    addToQueue
  };
};
