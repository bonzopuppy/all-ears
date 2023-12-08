import React, { useState } from "react";
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

  const songData = new Array(5).fill(null);
  const albumData = new Array(1).fill(null); // Replace with actual data
  const artistData = new Array(1).fill(null); // Replace with actual data
  const playlistData = new Array(1).fill(null); // Replace with actual data

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
          <Typography variant="h5">Songs</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {songData.map((_, index) => <SongMedium key={index} />)}
          </Box>
        </>
      )}

      {selectedTab === 1 && (
        <>
          <Typography variant="h5">Albums</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {albumData.map((_, index) => (
              <AlbumPlaylistItem
                key={index}
                imageUrl={coverImage}
                textLine1="The Beatles"
                textLine2="Abbey Road"
              />
            ))}
          </Box>
        </>
      )}

      {selectedTab === 2 && (
        <>
          <Typography variant="h5">Artists</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {artistData.map((_, index) => (
              <ArtistItem
                key={index}
                imageUrl={artistImage}
                textLine1="Ariane Grande"
                albumCount="16"
                songCount="187"
              />
            ))}
          </Box>
        </>
      )}

      {selectedTab === 3 && (
        <>
          <Typography variant="h5">Playlists</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {playlistData.map((_, index) => (
              <AlbumPlaylistItem
                key={index}
                imageUrl={coverImage}
                textLine1="The Beatles"
                textLine2="Abbey Road"
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

