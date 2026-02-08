const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env'), override: true });

console.log('[Server] Environment variables loaded:', {
  hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
  hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
  hasRedirectUri: !!process.env.REDIRECT_URI,
  redirectUri: process.env.REDIRECT_URI
});

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Vercel functions and wrap them for Express
const loginHandler = require('./api/auth/login');
const callbackHandler = require('./api/auth/callback');
const refreshHandler = require('./api/auth/refresh');

// Import Spotify API handlers
const searchHandler = require('./api/spotify/search');
const recommendationsHandler = require('./api/spotify/recommendations');
const browseHandler = require('./api/spotify/browse');
const userHandler = require('./api/spotify/user');
const albumsHandler = require('./api/spotify/albums');
const createPlaylistHandler = require('./api/spotify/create-playlist');

// Import AI handlers
const generatePathwaysHandler = require('./api/ai/generate-pathways');
const generateNarrativeHandler = require('./api/ai/generate-narrative');

// Import Journey handlers
const journeysIndexHandler = require('./api/journeys/index');
const journeysIdHandler = require('./api/journeys/[id]');

// Wrap Vercel handlers for Express (Vercel functions export default, Express needs req/res)
const wrapVercelHandler = (handler) => {
  // Handle both default export and direct function export
  const fn = handler.default || handler;
  return (req, res) => {
    // Ensure environment variables are available in the handler's process
    // (they should already be, but this is a safety check)
    fn(req, res);
  };
};

// API routes - Auth
app.get('/api/auth/login', wrapVercelHandler(loginHandler));
app.get('/api/auth/callback', wrapVercelHandler(callbackHandler));
app.post('/api/auth/refresh', wrapVercelHandler(refreshHandler));

// API routes - Spotify
app.get('/api/spotify/search', wrapVercelHandler(searchHandler));
app.get('/api/spotify/recommendations', wrapVercelHandler(recommendationsHandler));
app.get('/api/spotify/browse', wrapVercelHandler(browseHandler));
app.get('/api/spotify/user', wrapVercelHandler(userHandler));
app.get('/api/spotify/albums', wrapVercelHandler(albumsHandler));
app.post('/api/spotify/create-playlist', wrapVercelHandler(createPlaylistHandler));

// API routes - AI
app.post('/api/ai/generate-pathways', wrapVercelHandler(generatePathwaysHandler));
app.post('/api/ai/generate-narrative', wrapVercelHandler(generateNarrativeHandler));

// API routes - Journeys
app.get('/api/journeys', wrapVercelHandler(journeysIndexHandler));
app.post('/api/journeys', wrapVercelHandler(journeysIndexHandler));
app.get('/api/journeys/:id', (req, res) => {
  req.query = { ...(req.query || {}), id: req.params.id };
  return wrapVercelHandler(journeysIdHandler)(req, res);
});
app.patch('/api/journeys/:id', (req, res) => {
  req.query = { ...(req.query || {}), id: req.params.id };
  return wrapVercelHandler(journeysIdHandler)(req, res);
});
app.put('/api/journeys/:id', (req, res) => {
  req.query = { ...(req.query || {}), id: req.params.id };
  return wrapVercelHandler(journeysIdHandler)(req, res);
});
app.delete('/api/journeys/:id', (req, res) => {
  req.query = { ...(req.query || {}), id: req.params.id };
  return wrapVercelHandler(journeysIdHandler)(req, res);
});

// In development, proxy React app requests to the dev server
if (process.env.NODE_ENV !== 'production') {
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying for hot reload
    logLevel: 'debug'
  }));
} else {
  // Serve static files from the React app build directory in production
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
  console.log(`API routes available at http://127.0.0.1:${PORT}/api/auth/`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Proxying React app from http://localhost:3001`);
  }
});
