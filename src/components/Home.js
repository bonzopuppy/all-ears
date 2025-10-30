import { useState, useEffect } from "react";
import NavBar from "./NavBar";
import MusicPlayer from "./MusicPlayer";
import SearchBar from "./SearchBar";
import ListContainerWrapper from "./ListContainerWrapper";
import GenreCarousel from "./GenreCarousel";
import { useMusicContext } from "./MusicContext";
import SearchResults from "./SearchResults";

function Home({setSearchResults, searchResults, getAccessToken, spotifyAPI, newReleases, whatsHot, handleRefresh, genres, accessToken}) {
    const {
        currentSongIndex,
        isPlaying,
        playPauseHandler,
        nextSongHandler,
        prevSongHandler,
      } = useMusicContext();

    return (
        <>
            <SearchBar
                getAccessToken={getAccessToken}
                spotifyAPI={spotifyAPI}
                onResultsFetched={setSearchResults}
            />
            {searchResults ? (
                <SearchResults results={searchResults} />
            ) : (
                <>
                    <ListContainerWrapper
                        newReleases={newReleases}
                        whatsHot={whatsHot}
                        handleRefresh={handleRefresh}
                        accessToken={accessToken}
                        spotifyAPI={spotifyAPI}
                    />
                    <GenreCarousel genres={genres} />
                </>
            )}
        </>
    )
}
export default Home;

