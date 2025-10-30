# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Working with the Project Owner

**CRITICAL RULE: Under NO circumstances can you change a feature without asking first.**

**ALWAYS ask before making changes to:**
- Any functionality or feature behavior
- UI elements, labels, or component names
- API endpoints or data sources
- Route names or navigation structure
- Section names or titles (e.g., "What's Hot" → "Top 50")
- Implementation approaches or technical solutions

**DO NOT make assumptions about desired changes.** Even if something seems incorrect or could be improved, propose the change and get approval first. The owner may have specific reasons for current implementation choices.

**DO NOT change implementation approaches without permission.** If an endpoint or approach fails, you MUST ask before switching to a different solution.

When suggesting fixes:
1. Explain the problem clearly
2. Propose solution(s) with pros/cons
3. Wait for approval before implementing
4. Never replace content or functionality without explicit permission
5. Never change technical approaches (e.g., switching from one API endpoint to another) without asking

## Project Overview

**All Ears** is a Spotify-powered music discovery web application built with React 18. It uses Spotify's Web API with OAuth 2.0 authentication to provide music search, browsing, and playback functionality. Deployed to Vercel.

## Development Commands

```bash
npm run dev    # Local development with OAuth support (Express server on port 3000, React on port 3001)
npm start      # React dev server only (no OAuth endpoints available)
npm run build  # Production build for deployment
npm test       # Run tests (minimal coverage currently)
vercel         # Deploy to Vercel (requires Vercel CLI)
```

**IMPORTANT:** For full local development with OAuth authentication, you MUST use `npm run dev`, which runs:
- Express server on http://127.0.0.1:3000 (OAuth endpoints at `/api/auth/*`)
- React dev server on http://localhost:3001 (proxied through Express server)

Using just `npm start` will compile the React app but OAuth endpoints won't work.

**OAuth Redirect URI:** `http://127.0.0.1:3000/api/auth/callback` (configured in Spotify Dashboard)

## Architecture & Key Patterns

### Spotify API Integration

**Authentication:** User OAuth 2.0 flow (Authorization Code with PKCE)
- OAuth credentials stored in `.env` file as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`
- OAuth flow handled by serverless functions in `/api/auth/` directory:
  - `/api/auth/login` - Initiates OAuth flow
  - `/api/auth/callback` - Handles OAuth callback and token exchange
  - `/api/auth/refresh` - Refreshes expired access tokens
- Tokens stored in localStorage via `useSpotifyAuth` hook (`src/hooks/useSpotifyAuth.js`)
- Full access to user's Spotify account (playback, playlists, top tracks, etc.)

**Scopes requested:** streaming, user-read-playback-state, user-modify-playback-state, user-read-email, user-read-private, playlist-read-private, playlist-read-collaborative, user-top-read

**API base URL:** `https://api.spotify.com/v1` (stored as `spotifyAPI` constant in App.js)

**Endpoints used:**
- `/browse/new-releases` - New album releases
- `/playlists/{id}/tracks` - Playlist tracks (used for Top 50)
- `/recommendations` - Track recommendations based on seeds
- `/browse/featured-playlists` - Curated playlists
- `/artists` - Batch artist lookups
- `/search` - Multi-type search (tracks, artists, albums, playlists)

### State Management Strategy

**MusicContext (Context API):**
- Location: `src/components/MusicContext.js`
- Manages global music player state (current track, play/pause, playlist)
- **Note:** Context is wrapped twice (in `index.js` and `App.js`) - this is redundant but harmless
- Default playlist includes 4 local MP3 files stored in `/src/music/` directory

**State structure:**
```javascript
{
  playlist: Array,           // Current playlist (local + Spotify previews)
  currentSongIndex: Number,  // Active track
  isPlaying: Boolean,
  playTrack: Function,       // Adds Spotify track to playlist and plays it
  playPauseHandler: Function,
  nextSongHandler: Function,
  prevSongHandler: Function
}
```

**API data:** Props drilling pattern (no global state for API data)
- `getAccessToken` and `spotifyAPI` passed down from App.js through component hierarchy
- Data fetched in App.js and passed as props to child components
- No caching, persistence, or loading states implemented

### Component Hierarchy

```
App.js (root component)
├── NavBar (fixed header)
├── Routes:
│   ├── /all-ears (Home)
│   │   ├── SearchBar → SearchResults (conditional)
│   │   ├── ListContainerWrapper
│   │   │   ├── ListContainer (New Releases - 3 albums)
│   │   │   ├── ListContainer2 (Top 50 - 3 tracks)
│   │   │   └── ListContainer3 (Recent Selections - hardcoded data)
│   │   └── GenreCarousel (20 genres, react-slick)
│   ├── /library (YourLibrary component)
│   │   └── Tabs: Songs/Albums/Artists/Playlists (21 items each)
│   └── /explore (Explore component - AI assistant placeholder)
└── MusicPlayer (fixed footer)
```

**Naming quirk:** NavBar labels don't match route names:
- "Home" → `/all-ears`
- "Explore" → `/library` (shows YourLibrary component)
- "Assistant" → `/explore` (shows Explore component)

### Playback Architecture

**Dual playback system:**
1. **Local MP3s:** 4 full-length tracks included in `/src/music/` (Tyla, Beyoncé, Taylor Swift, OneRepublic)
2. **Spotify previews:** 30-second preview URLs from API responses

**Implementation:** `src/components/MusicPlayer.js`
- Uses HTML5 Audio API with `useRef` hook for persistent audio object
- When user clicks Spotify track, `playTrack()` converts it to internal format and prepends to playlist
- Alert shown if preview URL unavailable: "Preview not available for this track..."

### Data Flow Pattern

1. **App.js fetches on mount:** New Releases and Top 50 (via `useEffect`)
2. **Props passed down:** Through Home → ListContainerWrapper → ListContainer components
3. **Search triggers conditional render:** SearchResults replaces home content when search active
4. **Click handlers flow up:** Track clicks in card components call `playTrack()` from MusicContext

### Hardcoded Data Locations

Several components use hardcoded data to simulate features that would require user authentication:

- **ListContainer3.js:** Beatles album + Ariana Grande artist (Recent Selections)
- **YourLibrary.js:** 21 hardcoded Spotify artist IDs (lines ~80-100)
- **MusicContext.js:** 4 local MP3 file paths (lines 14-50)
- **App.js:** 20 genre definitions with Spotify URLs (lines 150-171)

This is intentional to provide demo functionality without requiring OAuth.

## Styling Approach

- **Material-UI v5** with custom theme (primary: `#181C1E`, secondary: `#FF6E1D`)
- **Typography:** 'Prompt' font family from Google Fonts
- **Ripple effects disabled globally** (see theme config in App.js)
- **sx prop** for component-level styling (no CSS modules)
- Minimal CSS files in `/src/styles/`

## Important Implementation Details

### Top 50 Section (Recent Change)

The "Top 50" section (formerly "What's Hot") attempts to fetch from Spotify's Global Top 50 playlist but may encounter 404 errors because:
- Playlist ID `37i9dQZEVXbMDoHDwVN2tF` requires user authentication or is region-specific
- Current implementation: `src/components/App.js` line ~111
- Fallback approach needed: Use recommendations API with popular artist seeds and high popularity filter

### Search Implementation

**Location:** `src/components/SearchBar.js`
- Triggers on Enter key press (not real-time)
- Searches 4 types simultaneously: tracks, artists, albums, playlists (limit 10 each)
- Results passed up to Home component via `setSearchResults` callback
- SearchResults component conditionally rendered, hiding normal home content

### Genre Carousel

- Uses `react-slick` library with custom Material-UI arrows
- Shows 4 cards at a time, scrolls by 4
- Genre cards link to external Spotify web player (opens in new tab)
- 20 genres with color-coded backgrounds and SVG overlays

### Audio Ref Management

The MusicPlayer uses a persistent audio element via `useRef`:
```javascript
const audioRef = useRef(new Audio(song.song));
```
This persists across renders but requires manual synchronization with React state. Event listeners must be carefully cleaned up in useEffect to avoid memory leaks.

## Known Issues & Incomplete Features

### Explore/Assistant Page
- UI exists but Generate button has no functionality
- Placeholder for future AI music assistant feature
- Located at `/explore` route

### Click-to-Play Integration
- Recently implemented (see MusicContext `playTrack()` function)
- Works for SongSmall and SongMedium components
- Album/playlist cards don't have playback (would require fetching tracks from album/playlist first)

### Error Handling
- API failures logged to console but no user-facing error states
- No loading spinners or skeleton screens
- Components handle null data with early returns

## Deployment

- **Platform:** Vercel
- **Production URL:** Deployed via Vercel CLI or GitHub integration
- **Build Configuration:** Defined in `vercel.json`
  - Build command: `npm run build`
  - Output directory: `build`
  - Framework: `create-react-app`
- **Serverless Functions:** API routes in `/api/auth/` directory deployed as Vercel serverless functions

## Environment Setup

Required environment variables (set in Vercel dashboard for production, `.env` for local):
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://127.0.0.1:3000/api/auth/callback  # Local dev
FRONTEND_URL=http://127.0.0.1:3000  # Local dev
```

**Production environment variables** (set in Vercel):
- `SPOTIFY_CLIENT_ID` - Your Spotify app client ID
- `SPOTIFY_CLIENT_SECRET` - Your Spotify app client secret
- `REDIRECT_URI` - Production callback URL (e.g., `https://your-app.vercel.app/api/auth/callback`)
- `FRONTEND_URL` - Production frontend URL (e.g., `https://your-app.vercel.app`)

Get credentials from: https://developer.spotify.com/dashboard

**Security note:** `.env` is gitignored. Configure Spotify redirect URIs in the Spotify Dashboard for both local and production URLs.
