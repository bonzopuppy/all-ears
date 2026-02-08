import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import coverImage from "../images/coverImage.png";
import artistImage from "../images/artistImage.png";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ArtistItem from "./ArtistItem";
import SongMedium from "./SongMedium";
import SimpleContextMenu from './SimpleContextMenu';
import StartJourneyMenuItem from './StartJourneyMenuItem';
import { journeyEnabled } from '../utils/featureFlags';
import { useStartJourney } from '../journey/useStartJourney';
import Typography from "@mui/material/Typography";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { useMusicContext } from './MusicContext';
import { spotifyAPI } from '../api/spotify-client';

function SearchResults({ results, accessToken, onSearch, setSearchQuery }) {
  const { playAll, shuffleAll } = useMusicContext();
  const navigate = useNavigate();
  const startJourney = useStartJourney();
  const tracks = results.tracks.items.filter(track => track);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuEntity, setMenuEntity] = useState(null);

  const openMenuFor = (entity) => (e) => {
    setMenuEntity(entity);
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuEntity(null);
  };

  const handleArtistClick = async (artistName) => {
    try {
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Update search query to show artist name in search bar
      if (setSearchQuery) {
        setSearchQuery(artistName);
      }

      const data = await spotifyAPI.search(artistName, 'track,artist,album,playlist', 10);
      if (onSearch) {
        onSearch(data);
      }
    } catch (error) {
      console.error('[SearchResults] Artist search failed:', error);
    }
  };

  const handleAlbumClick = (albumId) => {
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate to album page
    navigate(`/album/${albumId}`);
  };

  const handlePlaylistClick = (playlistId) => {
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Navigate to playlist page
    navigate(`/playlist/${playlistId}`);
  };

  return (

    <Box sx={{
      display: 'flex',
      flexDirection: 'column', // Stack sections vertically
      maxWidth: 1296,
      margin: '10px auto',
      padding: '0 30px',
      gap: '30px' // Increase gap for better separation of sections
    }}>

      <SimpleContextMenu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        {journeyEnabled && menuEntity && (
          <StartJourneyMenuItem
            onClick={() => {
              closeMenu();
              startJourney({
                nodeType: menuEntity.nodeType,
                nodeId: menuEntity.nodeId,
                nodeName: menuEntity.nodeName
              });
            }}
          />
        )}
      </SimpleContextMenu>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Songs</Typography>
        {tracks.length > 0 && (
          <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<PlayArrowIcon />}
              onClick={() => playAll(tracks)}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'secondary.main' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Play All
            </Button>
            <Button
              variant="contained"
              startIcon={<ShuffleIcon />}
              onClick={() => shuffleAll(tracks)}
              sx={{
                backgroundColor: 'primary.main',
                '&:hover': { backgroundColor: 'secondary.main' },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Shuffle
            </Button>

            {journeyEnabled && (
              <Button
                variant="outlined"
                onClick={() => startJourney({
                  nodeType: 'track',
                  nodeId: tracks[0].id,
                  nodeName: tracks[0].name
                })}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Start Journey
              </Button>
            )}
          </Box>
        )}
      </Box>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {tracks.map(track => (
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
            onClick={() => handleAlbumClick(album.id)}
            onMenuClick={journeyEnabled ? openMenuFor({
              kind: 'album',
              nodeType: 'album',
              nodeId: album.id,
              nodeName: album.name
            }) : undefined}
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
            artist={artist}
            onClick={() => handleArtistClick(artist.name)}
            onMenuClick={journeyEnabled ? openMenuFor({
              kind: 'artist',
              nodeType: 'artist',
              nodeId: artist.id,
              nodeName: artist.name
            }) : undefined}
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
            onClick={() => handlePlaylistClick(playlist.id)}
          />
        ))}
      </Box>

    </Box>
  );
}

export default SearchResults;
