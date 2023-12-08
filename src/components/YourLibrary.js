import React, { useEffect, useState } from "react";
// import MusicPlayer from "./MusicPlayer";
// import NavBar from "./NavBar";
import { useMusicContext } from "./MusicContext";
import coverImage from "../images/coverImage.png";
import artistImage from "../images/artistImage.png";
import Box from "@mui/material/Box";
import ArtistItem from "./ArtistItem";
import SongMedium from "./SongMedium";
import Typography from "@mui/material/Typography";
import { Tabs, Tab } from "@mui/material";
import AlbumPlaylistItem from "./AlbumPlaylistItem";

function YourLibrary({getAccessToken, spotifyAPI}) {


  const [selectedTab, setSelectedTab] = useState(0);

  const {
    currentSongIndex,
    isPlaying,
    playPauseHandler,
    nextSongHandler,
    prevSongHandler,
  } = useMusicContext();

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
    // padding: '10px 15px', // Padding added to each tab
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
  const albumData = new Array(1).fill(null); // Replace with actual data
  const artistData = new Array(1).fill(null); // Replace with actual data
  const playlistData = new Array(1).fill(null); // Replace with actual data

  const [playlists, setPlaylists] = useState([])
  const [artists, setArtists] = useState([])
  const [songs, setSongs] = useState([])
  const [albums, setAlbums] = useState([])

  useEffect(() => {

    async function fetchPlaylists() {

      const accessToken = await getAccessToken()

      const response = await fetch(`${spotifyAPI}/browse/featured-playlists?country=US&limit=21`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

        const data = await response.json()
        setPlaylists(data.playlists.items)
    }

    async function fetchArtists() {

      const accessToken = await getAccessToken()

      const artistIds = [
        { id: 1, name: 'Drake', spotifyId: '3TVXtAsR1Inumwj472S9r4' },
        { id: 2, name: 'Taylor Swift', spotifyId: '06HL4z0CvFAxyc27GXpf02' },
        { id: 3, name: 'Bad Bunny', spotifyId: '4q3ewBCX7sLwd24euuV69X' },
        { id: 4, name: 'The Weeknd', spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ' },
        { id: 5, name: 'Billie Eilish', spotifyId: '6qqNVTkY8uBg9cP3Jd7DAH' },
        { id: 6, name: 'Harry Styles', spotifyId: '6KImCVD70vtIoJWnq6nGn3' },
        { id: 7, name: 'Rell Nice', spotifyId: '5de6jFMvo1aI3pSzzmWbWT' },
        { id: 8, name: 'J. Cole', spotifyId: '6l3HvQ5sa6mXTsMTB19rO5' },
        { id: 9, name: 'Doja Cat', spotifyId: '5cj0lLjcoR7YOSnhnX0Po5' },
        { id: 10, name: 'Kendrick Lamar', spotifyId: '2YZyLoL8N0Wb9xBt1NhZWg' },
        { id: 11, name: 'Bruno Mars', spotifyId: '0du5cEVh5yTK9QJze8zA0C' },
        { id: 12, name: 'Ed Sheeran', spotifyId: '6eUKZXaKkcviH0Ku9w2n3V' },
        { id: 13, name: 'Ivy Sole', spotifyId: '4NcMrSi3B8eUVy6e1Ni3wu' },
        { id: 14, name: 'Adele', spotifyId: '4dpARuHxo51G3z768sgnrY' },
        { id: 15, name: 'Majid Jordan', spotifyId: '4HzKw8XcD0piJmDrrPRCYk' },
        { id: 16, name: 'The Foreign Exchange', spotifyId: '60R4M19QBXvs0gO4IL6CpS' },
        { id: 17, name: 'J Balvin', spotifyId: '1vyhD5VmyZ7KMfW5gqLgo5' },
        { id: 18, name: 'Bathe', spotifyId: '3BBN1P1JNw0sSdYEdBkOZK' },
        { id: 19, name: 'Tyla', spotifyId: '3SozjO3Lat463tQICI9LcE' },
        { id: 20, name: 'Beyonce', spotifyId: '6vWDO969PvNqNYHIOW5v0m' },
        { id: 21, name: 'Nas', spotifyId: '20qISvAhX20dpIbOOzGK3q' }
      ]

      const spotifyIds = artistIds.map(artist => artist.spotifyId)
      const artistIdsString = spotifyIds.join(',')

      const response = await fetch(`${spotifyAPI}/artists?ids=${artistIdsString}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      const data = await response.json()
      setArtists(data.artists)
    }

    async function fetchSongs() {

      const accessToken = await getAccessToken()
  
      const response = await fetch(`${spotifyAPI}/recommendations?country=US&limit=21&seed_genres=hip-hop,r-n-b,afrobeat,pop&min_popularity=75`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
  
      const data = await response.json()
      const topTracks = data.tracks.sort((a, b) => b.popularity - a.popularity);
      setSongs(topTracks);
    
    }

    async function fetchAlbums() {

      const accessToken = await getAccessToken()
        
        const response = await fetch(`${spotifyAPI}/browse/new-releases?country=US&limit=21`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
  
          const data = await response.json()
          setAlbums(data.albums.items)
      }

    fetchSongs()
    fetchAlbums()
    fetchArtists()
    fetchPlaylists()
    
  }, [])


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
            variant="scrollable" // Changed to scrollable
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
                    {label} <span className="count">{[songData, albumData, artistData, playlistData][index].length}</span>
                  </span>
                }
                sx={tabStyle(selectedTab === index)} // Added padding
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
          <Typography variant="h5">Popular Playlists</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {playlists.map((playlist, index) => (
              <AlbumPlaylistItem
                key={index}
                playlist={playlist}
                imageUrl={playlist.images[0].url}
                textLine1={playlist.name}
                textLine2={playlist.owner.display_name}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
    </div >
  );
}

export default YourLibrary;

