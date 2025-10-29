# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Working with the Project Owner

**ALWAYS ask before making changes to:**
- Any functionality or feature behavior
- UI elements, labels, or component names
- API endpoints or data sources
- Route names or navigation structure
- Section names or titles (e.g., "What's Hot" → "Top 50")

**DO NOT make assumptions about desired changes.** Even if something seems incorrect or could be improved, propose the change and get approval first. The owner may have specific reasons for current implementation choices.

When suggesting fixes:
1. Explain the problem clearly
2. Propose solution(s) with pros/cons
3. Wait for approval before implementing
4. Never replace content or functionality without explicit permission

## Project Overview

**All Ears** is a Spotify-powered music discovery web application built with React 18. It's a client-side only app that uses Spotify's Web API (Client Credentials flow) to provide music search, browsing, and preview playback functionality. Deployed to GitHub Pages.

## Development Commands

```bash
npm start      # Development server on http://localhost:3000
npm run build  # Production build for deployment
npm run deploy # Deploy to GitHub Pages (runs predeploy build automatically)
npm test       # Run tests (minimal coverage currently)
```

**Base URL in development:** `http://localhost:3000/all-ears` (note the `/all-ears` path configured for GitHub Pages)

## Architecture & Key Patterns

### Spotify API Integration

**Authentication:** Client Credentials flow only (no user OAuth)
- API credentials stored in `.env` file as `REACT_APP_SPOTIFY_CLIENT_ID` and `REACT_APP_SPOTIFY_CLIENT_SECRET`
- Access token fetched on-demand via `getAccessToken()` in App.js (no caching)
- **Limitation:** Only public Spotify data accessible; track previews limited to 30 seconds

**Authentication function location:** `src/components/App.js` lines 90-101

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

- Target: `https://AnneMiriam.github.io/all-ears`
- Uses `gh-pages` npm package
- GitHub Pages configuration in package.json (`homepage` field)
- Deploy command runs build automatically via `predeploy` script

## Environment Setup

Required environment variables in `.env`:
```
REACT_APP_SPOTIFY_CLIENT_ID=your_client_id
REACT_APP_SPOTIFY_CLIENT_SECRET=your_client_secret
```

Get credentials from: https://developer.spotify.com/dashboard

**Security note:** `.env` is gitignored. Use `.env.example` as template for new developers.
