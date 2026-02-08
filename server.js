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

// Lazy-load ESM handlers via dynamic import()
const handlers = {};

async function loadHandlers() {
  const [
    loginMod, callbackMod, refreshMod,
    searchMod, recommendationsMod, browseMod, userMod, albumsMod, createPlaylistMod,
    generatePathwaysMod, generateNarrativeMod,
    journeysIndexMod, journeysIdMod
  ] = await Promise.all([
    import('./api/auth/login.js'),
    import('./api/auth/callback.js'),
    import('./api/auth/refresh.js'),
    import('./api/spotify/search.js'),
    import('./api/spotify/recommendations.js'),
    import('./api/spotify/browse.js'),
    import('./api/spotify/user.js'),
    import('./api/spotify/albums.js'),
    import('./api/spotify/create-playlist.js'),
    import('./api/ai/generate-pathways.js'),
    import('./api/ai/generate-narrative.js'),
    import('./api/journeys/index.js'),
    import('./api/journeys/[id].js'),
  ]);

  handlers.login = loginMod.default;
  handlers.callback = callbackMod.default;
  handlers.refresh = refreshMod.default;
  handlers.search = searchMod.default;
  handlers.recommendations = recommendationsMod.default;
  handlers.browse = browseMod.default;
  handlers.user = userMod.default;
  handlers.albums = albumsMod.default;
  handlers.createPlaylist = createPlaylistMod.default;
  handlers.generatePathways = generatePathwaysMod.default;
  handlers.generateNarrative = generateNarrativeMod.default;
  handlers.journeysIndex = journeysIndexMod.default;
  handlers.journeysId = journeysIdMod.default;
}

// Wrap handler lookup for Express
const wrapHandler = (name) => (req, res) => handlers[name](req, res);

// API routes - Auth
app.get('/api/auth/login', wrapHandler('login'));
app.get('/api/auth/callback', wrapHandler('callback'));
app.post('/api/auth/refresh', wrapHandler('refresh'));

// API routes - Spotify
app.get('/api/spotify/search', wrapHandler('search'));
app.get('/api/spotify/recommendations', wrapHandler('recommendations'));
app.get('/api/spotify/browse', wrapHandler('browse'));
app.get('/api/spotify/user', wrapHandler('user'));
app.get('/api/spotify/albums', wrapHandler('albums'));
app.post('/api/spotify/create-playlist', wrapHandler('createPlaylist'));

// API routes - AI
app.post('/api/ai/generate-pathways', wrapHandler('generatePathways'));
app.post('/api/ai/generate-narrative', wrapHandler('generateNarrative'));

// API routes - Journeys
app.get('/api/journeys', wrapHandler('journeysIndex'));
app.post('/api/journeys', wrapHandler('journeysIndex'));

// Vercel [id].js reads req.query.id — in Express 5 req.query is a getter,
// so we inject the param via the actual URL query string.
const injectIdParam = (req, _res, next) => {
  const sep = req.url.includes('?') ? '&' : '?';
  req.url += `${sep}id=${encodeURIComponent(req.params.id)}`;
  next();
};
app.get('/api/journeys/:id', injectIdParam, wrapHandler('journeysId'));
app.patch('/api/journeys/:id', injectIdParam, wrapHandler('journeysId'));
app.put('/api/journeys/:id', injectIdParam, wrapHandler('journeysId'));
app.delete('/api/journeys/:id', injectIdParam, wrapHandler('journeysId'));

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

loadHandlers()
  .then(() => {
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
      console.log(`API routes available at http://127.0.0.1:${PORT}/api/auth/`);
      if (process.env.NODE_ENV !== 'production') {
        console.log(`Proxying React app from http://localhost:3001`);
      }
    });
  })
  .catch((err) => {
    console.error('[Server] Failed to load handlers:', err);
    process.exit(1);
  });
