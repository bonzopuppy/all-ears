
import React from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import coverImage from "../images/coverImage.png";
import artistImage from "../images/artistImage.png";
import Box from "@mui/material/Box";
import ArtistItem from "./ArtistItem";


function Explore() {
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
    <Box sx={{
      display: 'flex',
      flexWrap: 'wrap', // Allows items to wrap to the next line
      // justifyContent: 'space-between', // Adjusts space between items
      alignContent: 'center',
      maxWidth: 1296,
      margin: '0 auto', // Centers the container
      padding: '0 30px', // Similar to the search bar
      gap: '20px' // Space between ListContainer components
    }}>
      <AlbumPlaylistItem
        imageUrl={coverImage}
        textLine1="The Beatles"
        textLine2="Abbey Road"
      />
      <ArtistItem
        imageUrl={artistImage}
        textLine1="Ariane Grande"
        albumCount="16"
        songCount="187"
      />
    </Box>
    </div>
  );
}
export default Explore;

