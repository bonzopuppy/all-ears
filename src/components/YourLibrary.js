import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ArtistItem from "./ArtistItem";
import SongMedium from "./SongMedium";
import Typography from "@mui/material/Typography";
import { Tabs, Tab } from "@mui/material";
import AlbumPlaylistItem from "./AlbumPlaylistItem";
import { spotifyAPI } from '../api/spotify-client';

function YourLibrary({ accessToken }) {
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
        const data = await spotifyAPI.directRequest('/browse/featured-playlists?country=US&limit=21');
        if (data && data.playlists && data.playlists.items) {
          setPlaylists(data.playlists.items);
        }
      } catch (error) {
        console.error('[YourLibrary] Error fetching playlists:', error);
      }
    }

    async function fetchArtists() {
      try {
        const artistIds = [
          '3TVXtAsR1Inumwj472S9r4', '06HL4z0CvFAxyc27GXpf02', '4q3ewBCX7sLwd24euuV69X',
          '1Xyo4u8uXC1ZmMpatF05PJ', '6qqNVTkY8uBg9cP3Jd7DAH', '6KImCVD70vtIoJWnq6nGn3',
          '5de6jFMvo1aI3pSzzmWbWT', '6l3HvQ5sa6mXTsMTB19rO5', '5cj0lLjcoR7YOSnhnX0Po5',
          '2YZyLoL8N0Wb9xBt1NhZWg', '0du5cEVh5yTK9QJze8zA0C', '6eUKZXaKkcviH0Ku9w2n3V',
          '4NcMrSi3B8eUVy6e1Ni3wu', '4dpARuHxo51G3z768sgnrY', '4HzKw8XcD0piJmDrrPRCYk',
          '60R4M19QBXvs0gO4IL6CpS', '1vyhD5VmyZ7KMfW5gqLgo5', '3BBN1P1JNw0sSdYEdBkOZK',
          '3SozjO3Lat463tQICI9LcE', '6vWDO969PvNqNYHIOW5v0m', '20qISvAhX20dpIbOOzGK3q'
        ];

        const artistIdsString = artistIds.join(',');
        const data = await spotifyAPI.directRequest(`/artists?ids=${artistIdsString}`);
        if (data && data.artists) {
          setArtists(data.artists);
        }
      } catch (error) {
        console.error('[YourLibrary] Error fetching artists:', error);
      }
    }

    async function fetchSongs() {
      try {
        const data = await spotifyAPI.getRecommendations({
          seedGenres: 'hip-hop,r-n-b,afrobeat,pop',
          limit: 21,
          market: 'US'
        });
        if (data && data.tracks) {
          const topTracks = data.tracks.sort((a, b) => b.popularity - a.popularity);
          setSongs(topTracks);
        }
      } catch (error) {
        console.error('[YourLibrary] Error fetching songs:', error);
      }
    }

    async function fetchAlbums() {
      try {
        const data = await spotifyAPI.directRequest('/browse/new-releases?country=US&limit=21');
        if (data && data.albums && data.albums.items) {
          setAlbums(data.albums.items);
        }
      } catch (error) {
        console.error('[YourLibrary] Error fetching albums:', error);
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
            <Typography variant="h5">Popular Songs</Typography>
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
            <Typography variant="h5">Top Albums</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {albums.map((album, index) => (
                <AlbumPlaylistItem
                  key={index}
                  imageUrl={album.images[0].url}
                  album={album}
                  textLine1={album.name}
                  textLine2={album.artists[0].name}
                />
              ))}
            </Box>
          </>
        )}

        {selectedTab === 2 && (
          <>
            <Typography variant="h5">Top Artists</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {artists.map((artist, index) => (
                <ArtistItem
                  key={index}
                  artist={artist}
                  imageUrl={artist.images[0].url}
                  textLine1={artist.name}
                />
              ))}
            </Box>
          </>
        )}

        {selectedTab === 3 && (
          <>
            <Typography variant="h5">Top Playlists</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              {playlists.map((playlist, index) => (
                <AlbumPlaylistItem
                  key={index}
                  imageUrl={playlist.images[0].url}
                  playlist={playlist}
                  textLine1={playlist.name}
                  textLine2={playlist.description}
                />
              ))}
            </Box>
          </>
        )}
      </Box>
    </div>
  );
}

export default YourLibrary;
