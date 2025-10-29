import React from "react";
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import coverImage from "../images/coverImage.png";
import artistImage from "../images/artistImage.png";
import Box from "@mui/material/Box";
import ArtistItem from "./ArtistItem";
import SongMedium from "./SongMedium";
import Typography from "@mui/material/Typography";

function SearchResults({ results }) {

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
        {results.tracks.items.filter(track => track).map(track => (
        <SongMedium
          key={track.id}
          song={track}
        />
        ))}
      </Box>

      <Typography variant="h5">Albums</Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {results.albums.items.filter(album => album && album.images && album.images.length > 0).map(album => (
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
        {results.artists.items.filter(artist => artist).map(artist => (
          <ArtistItem
            key={artist.id}
            imageUrl={artist.images?.[0]?.url || artistImage}
            artist={artist.name}
            albumCount="Unknown" // Spotify API does not provide album count in search results
            songCount="Unknown" // Spotify API does not provide song count in search results
          />
        ))}
      </Box>

      <Typography variant="h5">Playlists</Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        {results.playlists.items.filter(playlist => playlist && playlist.images && playlist.images.length > 0).map(playlist => (
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
