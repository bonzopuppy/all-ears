import React, { createContext, useContext, useState } from 'react';
import taylor from "../music/YoureLosingMe.mp3";
import tyla from "../music/Water.mp3";
import bey from "../music/MyHouse.mp3"
import republic from "../music/CountingStars.mp3"

const MusicContext = createContext();

const useMusicContext = () => {
  return useContext(MusicContext);
};

const MusicProvider = ({ children }) => {
  const defaultSongs = [
    {
        song: tyla,
        title: "Water",
        artist: "Tyla",
        minutes: 3,
        seconds: 21,
        image: "https://upload.wikimedia.org/wikipedia/en/1/1e/Tyla_album.jpg",
        isLocal: true
    },
    {
        song: bey,
        title: "My House",
        artist: "Beyoncé",
        minutes: 4,
        seconds: 23,
        image: "https://media.pitchfork.com/photos/6569e8059df35b9503950ce8/1:1/w_320,c_limit/Beyonce-My-House.jpg",
        isLocal: true
    },
    {
        song: taylor,
        title: "You're Losing Me",
        artist: "Taylor Swift",
        minutes: 4,
        seconds: 38,
        image: "https://upload.wikimedia.org/wikipedia/en/9/9b/Taylor_Swift_-_You%27re_Losing_Me.png",
        isLocal: true
    },
    {
        song: republic,
        title: "Counting Stars",
        artist: "One Republic",
        minutes: 4,
        seconds: 17,
        image: "https://upload.wikimedia.org/wikipedia/en/9/96/OneRepublic_-_Native.png",
        isLocal: true
    }
  ];

  const [playlist, setPlaylist] = useState(defaultSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (spotifyTrack) => {
    // Convert Spotify track to our format
    const newTrack = {
      song: spotifyTrack.preview_url || spotifyTrack.song,
      title: spotifyTrack.name || spotifyTrack.title,
      artist: spotifyTrack.artists ? spotifyTrack.artists[0].name : spotifyTrack.artist,
      minutes: spotifyTrack.duration_ms ? Math.floor(spotifyTrack.duration_ms / 60000) : spotifyTrack.minutes,
      seconds: spotifyTrack.duration_ms ? Math.floor((spotifyTrack.duration_ms % 60000) / 1000) : spotifyTrack.seconds,
      image: spotifyTrack.album?.images?.[0]?.url || spotifyTrack.image,
      isLocal: false
    };

    // If no preview URL available, show alert and don't play
    if (!newTrack.song) {
      alert("Preview not available for this track. Only 30-second previews are available with the current API setup.");
      return;
    }

    // Add to playlist and play
    setPlaylist([newTrack, ...playlist]);
    setCurrentSongIndex(0);
    setIsPlaying(true);
  };

  const playPauseHandler = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  const value = {
    playlist,
    currentSongIndex,
    isPlaying,
    playTrack,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
    setIsPlaying,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { useMusicContext, MusicProvider }