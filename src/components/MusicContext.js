import React, { createContext, useContext, useState, useEffect } from 'react';

const MusicContext = createContext();

const useMusicContext = () => {
  return useContext(MusicContext);
};

const MusicProvider = ({ children, spotifyPlayer }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queuedTracks, setQueuedTracks] = useState([]);
  const [, forceUpdate] = useState({});

  // Force re-render when Spotify player state changes
  // Also remove the current track from the queue when it starts playing
  useEffect(() => {
    if (spotifyPlayer?.currentTrack) {
      console.log('🔄 MusicContext - currentTrack updated:', spotifyPlayer.currentTrack);

      const currentUri = spotifyPlayer.currentTrack.uri;

      // Remove the currently playing track from the queue
      setQueuedTracks(prev => {
        const filtered = prev.filter(track => track.uri !== currentUri);
        if (filtered.length !== prev.length) {
          console.log('[MusicContext] Removed playing track from queue:', currentUri);
        }
        return filtered;
      });

      forceUpdate({});
    }
  }, [spotifyPlayer?.currentTrack, spotifyPlayer?.isPaused, spotifyPlayer?.position]);

  const playTrack = async (spotifyTrack, context_uri = null, skipQueue = false) => {
    if (!spotifyPlayer || !spotifyPlayer.isReady) {
      alert("Spotify player is not ready yet. Please wait a moment and try again.");
      return;
    }

    console.log('[MusicContext] playTrack called with:', spotifyTrack);

    // Convert Spotify track to our format with URI for SDK playback
    const newTrack = {
      uri: spotifyTrack.uri, // Spotify URI for SDK playback
      title: spotifyTrack.name || spotifyTrack.title,
      artist: spotifyTrack.artists ? spotifyTrack.artists[0].name : spotifyTrack.artist,
      minutes: spotifyTrack.duration_ms ? Math.floor(spotifyTrack.duration_ms / 60000) : spotifyTrack.minutes,
      seconds: spotifyTrack.duration_ms ? Math.floor((spotifyTrack.duration_ms % 60000) / 1000) : spotifyTrack.seconds,
      image: spotifyTrack.album?.images?.[0]?.url || spotifyTrack.image,
      duration_ms: spotifyTrack.duration_ms
    };

    console.log('[MusicContext] Converted track:', newTrack);
    console.log('[MusicContext] Playing URI:', newTrack.uri);

    // Play using Spotify SDK with optional context (for albums/playlists)
    spotifyPlayer.play(newTrack.uri, context_uri);

    // Add single tracks to queue (unless this is called from playAll/shuffleAll)
    if (!skipQueue) {
      // Add to Spotify's queue
      await spotifyPlayer.addToQueue(newTrack.uri);

      // Add to our queue display with album info - it will show in "Now Playing" section
      const queueTrack = {
        ...newTrack,
        album: spotifyTrack.album // Preserve album info for "Go to Album"
      };
      setQueuedTracks(prev => [queueTrack, ...prev]);
      console.log('[MusicContext] Added single track to queue:', newTrack.title);
    }

    // Add to playlist
    setPlaylist([newTrack, ...playlist]);
    setCurrentSongIndex(0);
    setIsPlaying(true);
  };

  const playPauseHandler = () => {
    if (spotifyPlayer) {
      spotifyPlayer.togglePlay();
    }
  };

  const nextSongHandler = () => {
    if (spotifyPlayer) {
      spotifyPlayer.nextTrack();
    }
  };

  const prevSongHandler = () => {
    if (spotifyPlayer) {
      spotifyPlayer.previousTrack();
    }
  };

  // Shuffle array utility
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const playAll = async (tracks) => {
    if (!spotifyPlayer || !spotifyPlayer.isReady) {
      alert("Spotify player is not ready yet. Please wait a moment and try again.");
      return;
    }

    if (!tracks || tracks.length === 0) {
      alert("No tracks to play.");
      return;
    }

    console.log('[MusicContext] playAll called with', tracks.length, 'tracks');
    console.log('[MusicContext] First track:', tracks[0]);

    // Clear the existing queue
    setQueuedTracks([]);

    // Play the first track (skip adding to queue since we'll do it manually)
    await playTrack(tracks[0], null, true);

    // Wait a bit for the first track to start playing before queuing others
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert and store remaining tracks in queue
    const queueTracks = tracks.slice(1).map(track => ({
      uri: track.uri,
      title: track.name || track.title,
      artist: track.artists ? track.artists[0].name : track.artist,
      image: track.album?.images?.[0]?.url || track.image,
      duration_ms: track.duration_ms,
      album: track.album // Preserve album info for "Go to Album"
    }));
    setQueuedTracks(queueTracks);

    console.log('[MusicContext] Queuing', queueTracks.length, 'additional tracks');

    // Queue the rest to Spotify
    for (let i = 1; i < tracks.length; i++) {
      if (tracks[i].uri) {
        await spotifyPlayer.addToQueue(tracks[i].uri);
      }
    }

    console.log('[MusicContext] All tracks queued');
  };

  const shuffleAll = async (tracks) => {
    if (!spotifyPlayer || !spotifyPlayer.isReady) {
      alert("Spotify player is not ready yet. Please wait a moment and try again.");
      return;
    }

    if (!tracks || tracks.length === 0) {
      alert("No tracks to play.");
      return;
    }

    console.log('[MusicContext] shuffleAll called with', tracks.length, 'tracks');

    // Clear the existing queue
    setQueuedTracks([]);

    // Shuffle the tracks
    const shuffled = shuffleArray(tracks);

    // Play the first shuffled track (skip adding to queue since we'll do it manually)
    await playTrack(shuffled[0], null, true);

    // Wait a bit for the first track to start playing before queuing others
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Convert and store remaining shuffled tracks in queue
    const queueTracks = shuffled.slice(1).map(track => ({
      uri: track.uri,
      title: track.name || track.title,
      artist: track.artists ? track.artists[0].name : track.artist,
      image: track.album?.images?.[0]?.url || track.image,
      duration_ms: track.duration_ms,
      album: track.album // Preserve album info for "Go to Album"
    }));
    setQueuedTracks(queueTracks);

    console.log('[MusicContext] Queuing', queueTracks.length, 'shuffled tracks');

    // Queue the rest to Spotify
    for (let i = 1; i < shuffled.length; i++) {
      if (shuffled[i].uri) {
        await spotifyPlayer.addToQueue(shuffled[i].uri);
      }
    }

    console.log('[MusicContext] All shuffled tracks queued');
  };

  const addToQueue = async (track) => {
    if (!spotifyPlayer || !spotifyPlayer.isReady) {
      alert("Spotify player is not ready yet. Please wait a moment and try again.");
      return;
    }

    if (track && track.uri) {
      // Add to our queue state
      const queueTrack = {
        uri: track.uri,
        title: track.name || track.title,
        artist: track.artists ? track.artists[0].name : track.artist,
        image: track.album?.images?.[0]?.url || track.image,
        duration_ms: track.duration_ms,
        album: track.album // Preserve album info for "Go to Album"
      };
      setQueuedTracks(prev => [...prev, queueTrack]);

      // Add to Spotify queue
      await spotifyPlayer.addToQueue(track.uri);
    }
  };

  const clearQueue = () => {
    setQueuedTracks([]);
  };

  // Add track to the beginning of the queue (Play Next)
  const addToQueueNext = async (track) => {
    if (!spotifyPlayer || !spotifyPlayer.isReady) {
      alert("Spotify player is not ready yet. Please wait a moment and try again.");
      return;
    }

    if (track && track.uri) {
      // Add to our queue state at the beginning
      const queueTrack = {
        uri: track.uri,
        title: track.name || track.title,
        artist: track.artists ? track.artists[0].name : track.artist,
        image: track.album?.images?.[0]?.url || track.image,
        duration_ms: track.duration_ms,
        album: track.album // Preserve album info for "Go to Album"
      };
      setQueuedTracks(prev => [queueTrack, ...prev]);

      // Add to Spotify queue (will add to beginning)
      await spotifyPlayer.addToQueue(track.uri);

      console.log('[MusicContext] Added track to beginning of queue:', queueTrack.title);
    }
  };

  // Remove track from queue by URI
  const removeFromQueue = (trackUri) => {
    console.log('[MusicContext] Removing track from queue:', trackUri);
    setQueuedTracks(prev => prev.filter(track => track.uri !== trackUri));

    // NOTE: Spotify API doesn't support removing tracks from queue
    // This only removes from our display state
    console.warn('[MusicContext] Track removed from display only - Spotify queue not affected');
  };

  // Reorder the queue
  const reorderQueue = async (newOrder) => {
    console.log('[MusicContext] Reordering queue with', newOrder.length, 'tracks');

    // Update local state
    setQueuedTracks(newOrder);

    // NOTE: Spotify doesn't have a reorder endpoint
    // We would need to rebuild the entire queue, but that requires:
    // 1. Clearing the queue (no API endpoint)
    // 2. Re-adding all tracks in new order
    // For now, just update local state - actual playback order won't change
    console.warn('[MusicContext] Queue reordered in display only - Spotify playback order not affected');
  };

  const value = {
    playlist,
    currentSongIndex,
    isPlaying: spotifyPlayer ? !spotifyPlayer.isPaused : isPlaying,
    currentTrack: spotifyPlayer?.currentTrack,
    playTrack,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
    playAll,
    shuffleAll,
    addToQueue,
    addToQueueNext,
    removeFromQueue,
    reorderQueue,
    clearQueue,
    queuedTracks,
    setIsPlaying,
    spotifyPlayer,
  };

  console.log('🎯 MusicContext value:', {
    hasSpotifyPlayer: !!spotifyPlayer,
    currentTrack: spotifyPlayer?.currentTrack,
    isPlaying: value.isPlaying
  });

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { useMusicContext, MusicProvider };