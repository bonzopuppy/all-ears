import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ArtistItem from "./ArtistItem";
import SongMedium from "./SongMedium";
import Typography from "@mui/material/Typography";
import { Tabs, Tab, Button } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import { spotifyAPI } from '../api/spotify-client';
import { useMusicContext } from './MusicContext';

function YourLibrary({ accessToken }) {
  const { playAll, shuffleAll } = useMusicContext();
  const [selectedTab, setSelectedTab] = useState(0);
  const [playlists, setPlaylists] = useState([]);
  const [artists, setArtists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabStyle = (isActive) => ({
    backgroundColor: isActive ? '#181C1E' : '',
    color: isActive ? 'white !important' : 'rgba(0, 0, 0, 0.7)',
    borderRadius: isActive ? '8px' : '0',
    opacity: 1,
    textTransform: 'none',
    fontSize: '1.1rem',
    '&.Mui-selected': {
      marginTop: '15px',
      marginBottom: '15px',
    },
    '& .MuiTab-wrapper': {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    '& .count': {
      backgroundColor: isActive ? 'white' : '#181C1E',
      borderRadius: '30px',
      padding: '2px 12px',
      marginLeft: '4px',
      fontSize: '.9rem',
      color: isActive ? '#181C1E' : 'white',
    },
  });

  const songData = new Array(5).fill(null);
  const albumData = new Array(1).fill(null);
  const artistData = new Array(1).fill(null);
  const playlistData = new Array(1).fill(null);

  useEffect(() => {
    if (!accessToken) return;

    async function fetchPlaylists() {
      try {
        let allPlaylists = [];
        let url = '/me/playlists?limit=50';

        while (url) {
          const data = await spotifyAPI.directRequest(url);
          if (data && data.items) {
            allPlaylists = [...allPlaylists, ...data.items];
          }
          // Check if there's a next page
          url = data?.next ? data.next.replace('https://api.spotify.com/v1', '') : null;
        }

        console.log('[YourLibrary] Total playlists fetched:', allPlaylists.length);
        setPlaylists(allPlaylists);
      } catch (error) {
        console.error('[YourLibrary] Error fetching user playlists:', error);
      }
    }

    async function fetchArtists() {
      try {
        let allArtists = [];
        let after = null;

        // The /me/following endpoint uses cursor-based pagination with 'after' parameter
        do {
          const url = after
            ? `/me/following?type=artist&limit=50&after=${after}`
            : '/me/following?type=artist&limit=50';

          const data = await spotifyAPI.directRequest(url);

          if (data && data.artists && data.artists.items) {
            allArtists = [...allArtists, ...data.artists.items];
          }

          // Get cursor for next page
          after = data?.artists?.cursors?.after || null;
        } while (after);

        console.log('[YourLibrary] Total artists fetched:', allArtists.length);
        setArtists(allArtists);
      } catch (error) {
        console.error('[YourLibrary] Error fetching followed artists:', error);
      }
    }

    async function fetchSongs() {
      try {
        let allTracks = [];
        let url = '/me/tracks?limit=50';

        while (url) {
          const data = await spotifyAPI.directRequest(url);
          if (data && data.items) {
            const tracks = data.items.map(item => item.track).filter(track => track !== null);
            allTracks = [...allTracks, ...tracks];
          }
          // Check if there's a next page
          url = data?.next ? data.next.replace('https://api.spotify.com/v1', '') : null;
        }

        console.log('[YourLibrary] Total songs fetched:', allTracks.length);
        setSongs(allTracks);
      } catch (error) {
        console.error('[YourLibrary] Error fetching saved tracks:', error);
      }
    }

    async function fetchAlbums() {
      try {
        let allAlbums = [];
        let url = '/me/albums?limit=50';

        while (url) {
          const data = await spotifyAPI.directRequest(url);
          if (data && data.items) {
            const albums = data.items.map(item => item.album).filter(album => album !== null);
            allAlbums = [...allAlbums, ...albums];
          }
          // Check if there's a next page
          url = data?.next ? data.next.replace('https://api.spotify.com/v1', '') : null;
        }

        console.log('[YourLibrary] Total albums fetched:', allAlbums.length);
        setAlbums(allAlbums);
      } catch (error) {
        console.error('[YourLibrary] Error fetching saved albums:', error);
      }
    }

    fetchSongs();
    fetchAlbums();
    fetchArtists();
    fetchPlaylists();
  }, [accessToken]);

  return (
    <div>
      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: 1296, margin: '10px auto', padding: '0 30px', gap: '20px' }}>
        <Box sx={{
          backgroundColor: '#F4F2F7',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'auto',
          boxSizing: 'border-box',
          height: '64px',
          margin: '20px auto',
        }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            TabIndicatorProps={{ style: { display: 'none' }}}
            sx={{
              minHeight: '64px',
              '& .MuiTabs-flexContainer': {
                height: '100%',
              },
              '& .MuiTab-root': {
                height: 'auto',
                alignItems: 'center',
                margin: '15px 12px',
              },
            }}
          >
            {['Songs', 'Albums', 'Artists', 'Playlists'].map((label, index) => (
              <Tab
                key={label}
                label={
                  <span>
                    {label} <span className="count">{[songs, albums, artists, playlists][index].length}</span>
                  </span>
                }
                sx={tabStyle(selectedTab === index)}
              />
            ))}
          </Tabs>
        </Box>

        {selectedTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Typography variant="h5">Your Liked Songs</Typography>
              <Box sx={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => playAll(songs)}
                  disabled={songs.length === 0}
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
                  onClick={() => shuffleAll(songs)}
                  disabled={songs.length === 0}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'secondary.main' },
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Shuffle
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {songs.map((song, index) => (
                <SongMedium
                  song={song}
                  key={index}
                />
              ))}
            </Box>
          </>
        )}

        {selectedTab === 1 && (
          <>
            <Typography variant="h5">Your Saved Albums</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {albums.map((album, index) => (
                album.images && album.images.length > 0 && album.artists && album.artists.length > 0 ? (
                  <AlbumPlaylistItem
                    key={index}
                    imageUrl={album.images[0].url}
                    album={album}
                    textLine1={album.name}
                    textLine2={album.artists[0].name}
                  />
                ) : null
              ))}
            </Box>
          </>
        )}

        {selectedTab === 2 && (
          <>
            <Typography variant="h5">Artists You Follow</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {artists.map((artist, index) => (
                artist.images && artist.images.length > 0 ? (
                  <ArtistItem
                    key={index}
                    artist={artist}
                    imageUrl={artist.images[0].url}
                    textLine1={artist.name}
                  />
                ) : null
              ))}
            </Box>
          </>
        )}

        {selectedTab === 3 && (
          <>
            <Typography variant="h5">Your Playlists</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {playlists.map((playlist, index) => (
                playlist.images && playlist.images.length > 0 ? (
                  <AlbumPlaylistItem
                    key={index}
                    imageUrl={playlist.images[0].url}
                    playlist={playlist}
                    textLine1={playlist.name}
                    textLine2={playlist.description}
                  />
                ) : null
              ))}
            </Box>
          </>
        )}
      </Box>
    </div>
  );
}

export default YourLibrary;
