import React from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";

function YourLibrary({getAccessToken, spotifyAPI}) {
  const {
    currentSongIndex,
    isPlaying,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
  } = useMusicContext();

  return (

    <div>
      <h1>
        Your Library
      </h1>
    </div>

  );
}

export default YourLibrary;

