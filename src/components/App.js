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
import Playlist from './Playlist';
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

function App() {
  const { isAuthenticated, accessToken, user, logout, error: authError } = useSpotifyAuth();
  const spotifyPlayer = useSpotifyPlayer(accessToken);
  const market = useMarket(accessToken);

  const [newReleases, setNewReleases] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [genres, setGenres] = useState([]);
  const [newReleasesCategoryId, setNewReleasesCategoryId] = useState(null);
  const [newReleasesCategoryTitle, setNewReleasesCategoryTitle] = useState('New Releases');
  const [forYouCategoryId, setForYouCategoryId] = useState(null);
  const [forYouCategoryTitle, setForYouCategoryTitle] = useState('For You');

  // Fetch new releases, featured playlists, and recently played
  useEffect(() => {
    if (!accessToken) return;

    async function fetchHomeData() {
      // Fetch recently played
      console.log('[App] Fetching recently played...');
      spotifyAPI.directRequest('/me/player/recently-played?limit=3')
        .then(recentlyPlayedData => {
          console.log('[App] Recently played data:', recentlyPlayedData);
          if (recentlyPlayedData && recentlyPlayedData.items) {
            const tracks = recentlyPlayedData.items.map(item => item.track);
            setRecentlyPlayed(tracks);
            console.log('[App] Set recently played:', tracks.length);
          }
        })
        .catch(error => console.error('[App] Error fetching recently played:', error));

      // Fetch genres/categories from Spotify
      console.log('[App] Fetching Spotify categories...');
      try {
        const categoriesData = await spotifyAPI.directRequest('/browse/categories?limit=20&locale=en_US');
        console.log('[App] Categories data:', categoriesData);

        if (categoriesData && categoriesData.categories && categoriesData.categories.items) {
          const categories = categoriesData.categories.items;

          // Transform Spotify categories into our genre format
          const colors = ['#31334F', '#EA9633', '#8340D9', '#E13535', '#75C6F4'];
          const images = [blueOvals, orangeOvals, purpleOvals, redOvals, lightBlueOvals];

          const transformedGenres = categories.map((cat, index) => ({
            id: cat.id,
            title: cat.name,
            background: colors[index % colors.length],
            imageUrl: images[index % images.length],
            url: `#/genre/${cat.id}`
          }));

          // Set all genres (Genre component needs first two for View All pages)
          setGenres(transformedGenres);
          console.log('[App] Set genres:', transformedGenres.length);

          // Fetch tracks for first category (New Releases)
          if (categories[0]) {
            const firstCategory = categories[0];
            setNewReleasesCategoryId(firstCategory.id);
            setNewReleasesCategoryTitle(firstCategory.name);
            console.log('[App] Fetching tracks for first category:', firstCategory.name);

            try {
              const searchData = await spotifyAPI.search(firstCategory.name, 'playlist', 20);
              if (searchData.playlists && searchData.playlists.items) {
                const validPlaylists = searchData.playlists.items.filter(p => p !== null && p.id);

                if (validPlaylists.length > 0) {
                  const playlist = validPlaylists[0];
                  console.log('[App] Using playlist for New Releases:', playlist.name);

                  const tracksData = await spotifyAPI.directRequest(`/playlists/${playlist.id}/tracks?limit=3`);
                  if (tracksData && tracksData.items) {
                    const tracks = tracksData.items.map(item => item.track).filter(track => track !== null);
                    setNewReleases(tracks);
                    console.log('[App] Set New Releases tracks:', tracks.length);
                  }
                }
              }
            } catch (error) {
              console.error('[App] Error fetching New Releases tracks:', error);
            }
          }

          // Fetch tracks for second category (For You)
          if (categories[1]) {
            const secondCategory = categories[1];
            setForYouCategoryId(secondCategory.id);
            setForYouCategoryTitle(secondCategory.name);
            console.log('[App] Fetching tracks for second category:', secondCategory.name);

            try {
              const searchData = await spotifyAPI.search(secondCategory.name, 'playlist', 20);
              if (searchData.playlists && searchData.playlists.items) {
                const validPlaylists = searchData.playlists.items.filter(p => p !== null && p.id);

                if (validPlaylists.length > 0) {
                  const playlist = validPlaylists[0];
                  console.log('[App] Using playlist for For You:', playlist.name);

                  const tracksData = await spotifyAPI.directRequest(`/playlists/${playlist.id}/tracks?limit=3`);
                  if (tracksData && tracksData.items) {
                    const tracks = tracksData.items.map(item => item.track).filter(track => track !== null);
                    setForYou(tracks);
                    console.log('[App] Set For You tracks:', tracks.length);
                  }
                }
              }
            } catch (error) {
              console.error('[App] Error fetching For You tracks:', error);
            }
          }
        }
      } catch (error) {
        console.error('[App] Error fetching categories:', error);
      }
    }

    fetchHomeData();
  }, [accessToken]);

  function handleRefresh(e) {
    e.preventDefault();
    if (!accessToken) return;

    spotifyAPI.directRequest('/me/player/recently-played?limit=3')
      .then(data => {
        if (data && data.items) {
          setRecentlyPlayed(data.items.map(item => item.track));
        }
      })
      .catch(error => {
        console.error('[App] Error refreshing recently played:', error);
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
                      forYou={forYou}
                      recentlyPlayed={recentlyPlayed}
                      handleRefresh={handleRefresh}
                      genres={genres}
                      searchResults={searchResults}
                      setSearchResults={setSearchResults}
                      accessToken={accessToken}
                      market={market}
                      newReleasesCategoryId={newReleasesCategoryId}
                      newReleasesCategoryTitle={newReleasesCategoryTitle}
                      forYouCategoryId={forYouCategoryId}
                      forYouCategoryTitle={forYouCategoryTitle}
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
                  <Route path="/playlist/:playlistId" element={
                    <Playlist accessToken={accessToken} />
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
