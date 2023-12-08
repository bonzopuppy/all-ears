import React, { createContext, useContext, useState } from 'react';
import taylor from "../music/YoureLosingMe.mp3";
import tyla from "../music/Water.mp3";
import bey from "../music/MyHouse.mp3"

const MusicContext = createContext();

const useMusicContext = () => {
  return useContext(MusicContext);
};

const MusicProvider = ({ children }) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const songs = [
    {
        song: tyla,
        title: "Water",
        artist: "Tyla",
        time: "3:21"
    },
    {
        song: bey,
        title: "My House",
        artist: "Beyoncé",
        time: "4:23"
    },
    {
        song: taylor,
        title: "You're Losing Me",
        artist: "Taylor Swift",
        time: "4:38"
    }
  ]

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