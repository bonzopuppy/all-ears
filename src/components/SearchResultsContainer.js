import React from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import coverImage from "../images/coverImage.png";
import artistImage from "../images/artistImage.png";
import Box from "@mui/material/Box";
import ArtistItem from "./ArtistItem";
import SongMedium from "./SongMedium";
import Typography from "@mui/material/Typography";

<Box sx={{
        display: 'flex',
        flexDirection: 'column', // Stack sections vertically
        maxWidth: 1296,
        margin: '10px auto',
        padding: '0 30px',
        gap: '20px' // Increase gap for better separation of sections
      }}>

        <Typography variant="h5">Songs</Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <SongMedium />
          <SongMedium />
          <SongMedium />
          <SongMedium />
          <SongMedium />
        </Box>

        <Typography variant="h5">Albums</Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <AlbumPlaylistItem
            imageUrl={coverImage}
            textLine1="The Beatles"
            textLine2="Abbey Road"
          />
        </Box>

        <Typography variant="h5">Artists</Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <ArtistItem
            imageUrl={artistImage}
            textLine1="Ariane Grande"
            albumCount="16"
            songCount="187"
          />
        </Box>

        <Typography variant="h5">Playlists</Typography>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <AlbumPlaylistItem
            imageUrl={coverImage}
            textLine1="The Beatles"
            textLine2="Abbey Road"
          />
        </Box>

      </Box>