import React, { createContext, useContext, useState, useEffect } from 'react';

const MusicContext = createContext();

const useMusicContext = () => {
  return useContext(MusicContext);
};

const MusicProvider = ({ children, spotifyPlayer }) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [, forceUpdate] = useState({});

  // Force re-render when Spotify player state changes
  useEffect(() => {
    if (spotifyPlayer?.currentTrack) {
      console.log('🔄 MusicContext - currentTrack updated:', spotifyPlayer.currentTrack);
      forceUpdate({});
    }
  }, [spotifyPlayer?.currentTrack, spotifyPlayer?.isPaused, spotifyPlayer?.position]);

  const playTrack = (spotifyTrack) => {
    if (!spotifyPlayer || !spotifyPlayer.isReady) {
      alert("Spotify player is not ready yet. Please wait a moment and try again.");
      return;
    }

    // Convert Spotify track to our format with URI for SDK playback
    const newTrack = {
      uri: spotifyTrack.uri, // Spotify URI for SDK playback
      title: spotifyTrack.name || spotifyTrack.title,
      artist: spotifyTrack.artists ? spotifyTrack.artists[0].name : spotifyTrack.artist,
      minutes: spotifyTrack.duration_ms ? Math.floor(spotifyTrack.duration_ms / 60000) : spotifyTrack.minutes,
      seconds: spotifyTrack.duration_ms ? Math.floor((spotifyTrack.duration_ms % 60000) / 1000) : spotifyTrack.seconds,
      image: spotifyTrack.album?.images?.[0]?.url || spotifyTrack.image,
    };

    // Play using Spotify SDK
    spotifyPlayer.play(newTrack.uri);

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

  const value = {
    playlist,
    currentSongIndex,
    isPlaying: spotifyPlayer ? !spotifyPlayer.isPaused : isPlaying,
    currentTrack: spotifyPlayer?.currentTrack,
    playTrack,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
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