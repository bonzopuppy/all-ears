import React from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import coverImage from "../images/coverImage.png";
import artistImage from "../images/artistImage.png";
import Box from "@mui/material/Box";
import ArtistItemSearch from "./ArtistItemSearch";
import SongMediumSearch from "./SongMediumSearch";
import Typography from "@mui/material/Typography";

function SearchResults({ results }) {
console.log(results.tracks);
  return (

    <Box sx={{
      display: 'flex',
      flexDirection: 'column', // Stack sections vertically
      maxWidth: 1296,
      margin: '10px auto',
      padding: '0 30px',
      gap: '30px' // Increase gap for better separation of sections
    }}>

      <Typography variant="h5">Songs</Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {results.tracks.items.map(track => (
        <SongMediumSearch
          key={track.id}
          title={track.name}
          artist={track.artists[0].name}
          album={track.album.name}
          image={track.album.images[0].url || coverImage}
          duration={track.duration_ms}
        />
        ))}
      </Box>

      <Typography variant="h5">Albums</Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {results.albums.items.map(album => (
          <AlbumPlaylistItem
            key={album.id}
            imageUrl={album.images[0].url || coverImage}
            textLine1={album.name}
            textLine2={album.artists[0].name}
          />
        ))}
      </Box>

      <Typography variant="h5">Artists</Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {results.artists.items.map(artist => (
          <ArtistItemSearch
            key={artist.id}
            imageUrl={artist.images[0]?.url || artistImage}
            artist={artist.name}
            // followers={artist.followers.total}
          />
        ))}
      </Box>

      <Typography variant="h5">Playlists</Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {results.playlists.items.map(playlist => (
          <AlbumPlaylistItem
            key={playlist.id}
            imageUrl={playlist.images[0]?.url || coverImage} // Using the first image or a default cover image
            textLine1={playlist.name}
            textLine2={`Curated by ${playlist.owner.display_name}`} // Example of using the playlist owner's name
          />
        ))}
      </Box>

    </Box>
  );
}

export default SearchResults;
