import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";
import ListContainerWrapper from "./ListContainerWrapper";
import GenreCarousel from "./GenreCarousel";
import { useMusicContext } from "./MusicContext";

function Home({getAccessToken, spotifyAPI, newReleases, whatsHot}) {
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
                    <SearchBar getAccessToken={getAccessToken} spotifyAPI={spotifyAPI} />
                    <ListContainerWrapper newReleases={newReleases} whatsHot={whatsHot} />
                    <GenreCarousel />
                </div>
        </>
    )
}
export default Home;

