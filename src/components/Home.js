// Home (App)
// |- NavBar
//    |- Home (Return)
//    |- Your Library
//       |- Summary Bar
//       |- Library Card
//    |- Explore
// |- Search Bar
// |- Search Results
//    |- Results Card
// |- New Releases
// |- What's Hot
// |- Genre Carousel
//    |- Genre Card
// |- Music Player

import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";
import ListContainerWrapper from "./ListContainerWrapper";
import GenreCarousel from "./GenreCarousel";
import { useMusicContext } from "./MusicContext";

function Home() {
    const {
        currentSongIndex,
        isPlaying,
        playPauseHandler,
        nextSongHandler,
        prevSongHandler,
      } = useMusicContext();
   
    return (
        <>
                <div>
                    <SearchBar />
                    <ListContainerWrapper />
                    <GenreCarousel />
                </div>
        </>
    )
}
export default Home;

