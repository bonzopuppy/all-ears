import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavBar from './NavBar';
import MusicPlayer from './MusicPlayer';
import Home from './Home';
import YourLibrary from './YourLibrary';
import Explore from './Explore';
import ForYou from './ForYou';
import NewReleases from './NewReleases';
import Album from './Album';
import Genre from './Genre';
import Radio from './Radio';
import Login from './Login';
import ErrorBoundary from './common/ErrorBoundary';
import { MusicProvider } from './MusicContext';
import { useSpotifyAuth } from '../hooks/useSpotifyAuth';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';
import { useMarket } from '../hooks/useMarket';
import { spotifyAPI } from '../api/spotify-client';
import blueOvals from '../images/blueOvals.svg';
import orangeOvals from '../images/orangeOvals.svg';
import purpleOvals from '../images/purpleOvals.svg';
import redOvals from '../images/redOvals.svg';
import lightBlueOvals from '../images/lightBlueOvals.svg';

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
    primary: { main: '#181C1E' },
    secondary: { main: '#FF6E1D' },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

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

function App() {
  const { isAuthenticated, accessToken, user, logout, error: authError } = useSpotifyAuth();
  const spotifyPlayer = useSpotifyPlayer(accessToken);
  const market = useMarket(accessToken);

  const [newReleases, setNewReleases] = useState([]);
  const [whatsHot, setWhatsHot] = useState([]);
  const [searchResults, setSearchResults] = useState(null);

  // Fetch new releases and user's top tracks
  useEffect(() => {
    if (!accessToken) return;

    async function fetchHomeData() {
      try {
        // Fetch new releases
        const newReleasesData = await spotifyAPI.directRequest('/browse/new-releases?country=US&limit=3');
        if (newReleasesData && newReleasesData.albums && newReleasesData.albums.items) {
          setNewReleases(newReleasesData.albums.items);
        }

        // Fetch user's top tracks
        const topTracksData = await spotifyAPI.directRequest('/me/top/tracks?time_range=short_term&limit=3');
        if (topTracksData && topTracksData.items && topTracksData.items.length > 0) {
          setWhatsHot(topTracksData.items);
        }
      } catch (error) {
        console.error('[App] Error fetching home data:', error);
      }
    }

    fetchHomeData();
  }, [accessToken]);

  function handleRefresh(e) {
    e.preventDefault();
    if (!accessToken) return;

    spotifyAPI.directRequest('/me/top/tracks?time_range=short_term&limit=3')
      .then(data => {
        if (data && data.items && data.items.length > 0) {
          setWhatsHot(data.items);
        }
      })
      .catch(error => {
        console.error('[App] Error refreshing top tracks:', error);
      });
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <Login error={authError} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary>
        <Router>
          <div className="App">
            <NavBar user={user} onLogout={logout} />
            <MusicProvider spotifyPlayer={spotifyPlayer}>
              <div style={{ paddingTop: '64px', paddingBottom: '108px' }}>
                <Routes>
                  <Route path="/" element={
                    <Home
                      newReleases={newReleases}
                      whatsHot={whatsHot}
                      handleRefresh={handleRefresh}
                      genres={genres}
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                      accessToken={accessToken}
                      market={market}
                    />
                  } />
                  <Route path="/library" element={
                    <YourLibrary accessToken={accessToken} />
                  } />
                  <Route path="/explore" element={
                    <Explore accessToken={accessToken} />
                  } />
                  <Route path="/for-you" element={
                    <ForYou accessToken={accessToken} />
                  } />
                  <Route path="/new-releases" element={
                    <NewReleases accessToken={accessToken} />
                  } />
                  <Route path="/album/:albumId" element={
                    <Album accessToken={accessToken} />
                  } />
                  <Route path="/genre/:genreId" element={
                    <Genre
                      accessToken={accessToken}
                      genres={genres}
                    />
                  } />
                  <Route path="/radio/:trackId" element={
                    <Radio
                      accessToken={accessToken}
                      market={market}
                    />
                  } />
                  {/* Redirect old /all-ears path */}
                  <Route path="/all-ears" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <MusicPlayer />
            </MusicProvider>
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
