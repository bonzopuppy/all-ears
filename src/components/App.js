import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MusicPlayer from './MusicPlayer';
import Home from './Home';
import YourLibrary from './YourLibrary';
import Explore from './Explore';
import { MusicProvider } from './MusicContext';


// App 1
// |- Home 2
//    |- Nav Bar 3
//    |- Search Bar 4
//    |- Search Results Container 5
//       |- Search Results Card 6
//    |- List Container Wrapper 7
//       |- List Container 8
//          |- Song Item 9
//    |- Genre Carousel 10
//       |- Genre Component 11
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

  const allEarsClientId = "600f950452a84657b5a28a42c739ceac"
  const allEarsClientSecret = "21203cc6dd96448d9e1751b1debe3e38"
  
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

  useEffect(async () => {
    
    const accessToken = await getAccessToken()
    
    const response = await fetch(`${spotifyAPI}/browse/new-releases?country=US&limit=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const data = await response.json()
    setNewReleases(data)
    console.log(newReleases)
  }, [])







  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <NavBar />
          <MusicProvider>
        <div style ={{ paddingTop: '64px', paddingBottom: '88px'}}>
          <Routes>
            <Route path="/all-ears" element={
              <Home 
                getAccessToken={getAccessToken}
                spotifyAPI={spotifyAPI} 
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
