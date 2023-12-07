
import React from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";

function Explore({getAccessToken, spotifyAPI}) {
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
        Explore
    </h1>
    </div>

  );
}
export default Explore;

