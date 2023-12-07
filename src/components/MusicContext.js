import React, { createContext, useContext, useState } from 'react';
import frozen from "../music/LetItGo.mp3"
import phil from "../music/In-the-Air-Tonight.mp3";
import untold from "../music/Untold-Stories.mp3"

const MusicContext = createContext();

const useMusicContext = () => {
  return useContext(MusicContext);
};

const MusicProvider = ({ children }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const songs = [frozen, phil, untold]

  const playPauseHandler = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const nextSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const prevSongHandler = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + songs.length) % songs.length);
  };

  const value = {
    currentSongIndex,
    isPlaying,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export { useMusicContext, MusicProvider }