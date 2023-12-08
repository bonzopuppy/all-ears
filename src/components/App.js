import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MusicPlayer from './MusicPlayer';
import Home from './Home';
import YourLibrary from './YourLibrary';
import Explore from './Explore';
import { MusicProvider } from './MusicContext';
import blueOvals from '../images/blueOvals.svg';
import orangeOvals from '../images/orangeOvals.svg';
import purpleOvals from '../images/purpleOvals.svg';
import redOvals from '../images/redOvals.svg';
import lightBlueOvals from '../images/lightBlueOvals.svg';


// App
// |- Home
//    |- Nav Bar
//    |- Search Bar
//    |- Search Results Container
//       |- Search Results Card
//    |- List Container Wrapper
//       |- List Container 1
//          |- Album Small (3)
//       |- List Container 2
//          |- Song Small (3)
//       |- List Container 3 (Hard-coded)
//          |- Album Playlist Item
//          |- Artist Item
//    |- Genre Carousel
//       |- Genre Component
// |- Your Library 12
//    |- Nav Bar 3
//    |- Library Summary Bar 13
//    |- Library Container 14
//       |- Library Card 15
// |- Explore 16
//    |- Nav Bar 3
//    |- Exploration Bar 17
//    |- Sample Prompt Container 18
//    |- Sample Prompt 19
// |- Music Player 20


const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: "'Prompt', sans-serif",
            color: '#181C1E',
        },
        h5: {
            fontSize: '1.2rem',
            fontWeight: '500',
            marginBottom: '0',
        },
        h6: {
            fontSize: '1.1rem',
            fontWeight: '500',
        },
    },
    palette: {
        primary: {
            main: '#181C1E',
        },
        secondary: {
            main: '#FF6E1D',
        },
    },
    components: {
        MuiButtonBase: {
          defaultProps: {
            disableRipple: true,
          },
        },
    },
    // Include any other theme customizations here
});

function App() {

  const allEarsClientId = "dabca092fe0b46d8aea268eb47f61bf7"
  const allEarsClientSecret = "6db5e30985a04ff38867b491ff81c749"

  const [searchResults, setSearchResults] = useState(null);

  
  const spotifyAPI = "https://api.spotify.com/v1"
  
  async function getAccessToken(clientId = allEarsClientId, clientSecret = allEarsClientSecret) {
      const result = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
              'Content-type': 'application/x-www-form-urlencoded'
          },
          body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
      })
  
      const data = await result.json();
      return data.access_token;
  }

  const [newReleases, setNewReleases] = useState([])
  const [whatsHot, setWhatsHot] = useState([])

  async function fetchWhatsHot() {

    const accessToken = await getAccessToken()

    const response = await fetch(`${spotifyAPI}/recommendations?country=US&limit=30&seed_genres=hip-hop,r-n-b,afrobeat,pop&min_popularity=75`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const data = await response.json()
    const sortedTracks = data.tracks.sort((a, b) => b.popularity - a.popularity);
    const whatsHot = sortedTracks.slice(0, 3);
    setWhatsHot(whatsHot);
  }

  useEffect(() => {
      async function fetchNewReleases() {

        const accessToken = await getAccessToken()
        
        const response = await fetch(`${spotifyAPI}/browse/new-releases?country=US&limit=3`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
  
          const data = await response.json()
          setNewReleases(data.albums.items)
        
        }

      fetchNewReleases()
      fetchWhatsHot()

  }, [])

  function handleRefresh(e) {
    e.preventDefault()
    fetchWhatsHot()
  }

  const genres = [
    { id: '1', title: 'Rock', background: '#31334F', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFDXXwE9BDJAr', imageUrl: blueOvals },
    { id: '2', title: 'Pop', background: '#EA9633', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFEC4WFtoNRpw', imageUrl: orangeOvals },
    { id: '3', title: 'Hip Hop', background: '#8340D9', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFQ00XGBls6ym', imageUrl: purpleOvals },
    { id: '4', title: 'Jazz', background: '#E13535', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFAJ5xb0fwo9m', imageUrl: redOvals },
    { id: '5', title: 'Country', background: '#75C6F4', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFKLfwjuJMoNC', imageUrl: lightBlueOvals },
    { id: '6', title: 'Classical', background: '#31334F', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFPrEiAOxgac3', imageUrl: blueOvals },
    { id: '7', title: 'Electronic', background: '#EA9633', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFHOzuVTgTizF', imageUrl: orangeOvals },
    { id: '8', title: 'Folk', background: '#8340D9', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFy78wprEpAjl', imageUrl: purpleOvals },
    { id: '9', title: 'R&B', background: '#E13535', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFEZPnFQSFB1T', imageUrl: redOvals },
    { id: '10', title: 'Caribbean', background: '#75C6F4', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFObNLOHydSW8', imageUrl: lightBlueOvals },
    { id: '11', title: 'Blues', background: '#31334F', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFQiK2EHwyjcU', imageUrl: blueOvals },
    { id: '12', title: 'Metal', background: '#EA9633', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFDkd668ypn6O', imageUrl: orangeOvals },
    { id: '13', title: 'Funk & Disco', background: '#8340D9', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFFsW9N8maB6z', imageUrl: purpleOvals },
    { id: '14', title: 'Latin', background: '#E13535', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFxXaXKP7zcDp', imageUrl: redOvals },
    { id: '15', title: 'Afrobeats', background: '#75C6F4', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFNQ0fGp4byGU', imageUrl: lightBlueOvals },
    { id: '16', title: 'Soul', background: '#31334F', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFIpEuaCnimBj', imageUrl: blueOvals },
    { id: '17', title: 'Punk', background: '#EA9633', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFAjfauKLOZiv', imageUrl: orangeOvals },
    { id: '18', title: 'Gospel', background: '#8340D9', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFy0OenPG51Av', imageUrl: purpleOvals },
    { id: '19', title: 'Indie', background: '#E13535', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFCWjUTdzaG0e', imageUrl: redOvals },
    { id: '20', title: 'Alternative', background: '#75C6F4', url: 'https://open.spotify.com/genre/0JQ5DAqbMKFFtlLYUHv8bT', imageUrl: lightBlueOvals },
];

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <NavBar />
          <MusicProvider>
        <div style ={{ paddingTop: '64px', paddingBottom: '108px'}}>
          <Routes>
            <Route path="/all-ears" element={
              <Home 
                getAccessToken={getAccessToken}
                spotifyAPI={spotifyAPI} 
                newReleases={newReleases}
                whatsHot={whatsHot}
                handleRefresh={handleRefresh}
                genres={genres}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
              />
            }/>
            <Route path="/library" element={
              <YourLibrary
                getAccessToken={getAccessToken}
                spotifyAPI={spotifyAPI} 
              />
            }/>
            <Route path="/explore" element={
              <Explore
                getAccessToken={getAccessToken}
                spotifyAPI={spotifyAPI} 
              />
            }/>
          </Routes>
          </div>
          </MusicProvider>
          <MusicPlayer />
        </div>
      </Router>
    </ThemeProvider>
    );

}

export default App;
