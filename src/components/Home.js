import { useState, useEffect } from "react";
import NavBar from "./NavBar";
// import "./NavBar.css"
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";
import ListContainerWrapper from "./ListContainerWrapper";
import GenreCarousel from "./GenreCarousel";
import { useMusicContext } from "./MusicContext";

function Home({getAccessToken, spotifyAPI}) {
    const {
        currentSongIndex,
        isPlaying,
        playPauseHandler,
        nextSongHandler,
        prevSongHandler,
      } = useMusicContext();
   
    return (
        <>
            <header className="navbar">
                {/* <NavBar /> */}
            </header>
                <div>
                    <SearchBar getAccessToken={getAccessToken} spotifyAPI={spotifyAPI} />
                    <ListContainerWrapper />
                    <GenreCarousel />
                </div>
        </>
    )
}
export default Home;

