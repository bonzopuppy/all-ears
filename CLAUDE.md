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

### Spotify Integration (Dual-Layer Architecture)

The app uses **two distinct Spotify systems** that work together:

#### 1. Spotify Web API (Data Layer)
- **Purpose:** Fetch music metadata (search, browse, playlists, etc.)
- **Authentication:** OAuth 2.0 Authorization Code flow
- **Implementation:** Centralized in `src/api/spotify-client.js` (SpotifyAPIClient class)
- **Serverless Functions:** OAuth endpoints in `/api/auth/` directory:
  - `/api/auth/login` - Initiates OAuth flow
  - `/api/auth/callback` - Handles OAuth callback and token exchange
  - `/api/auth/refresh` - Auto-refreshes expired tokens
- **API Proxy Endpoints:** Serverless functions in `/api/spotify/`:
  - `/api/spotify/search` - Multi-type search
  - `/api/spotify/recommendations` - Track recommendations
  - `/api/spotify/browse` - Browse categories/featured content
  - `/api/spotify/user` - User profile and library data
  - `/api/spotify/albums` - Album/playlist track listings

#### 2. Spotify Web Playback SDK (Playback Layer)
- **Purpose:** Full-length, high-quality track playback in the browser
- **Requirement:** Spotify Premium account
- **Implementation:** `src/hooks/useSpotifyPlayer.js`
- **SDK Script:** Loaded via `<script src="https://sdk.scdn.co/spotify-player.js">` in public/index.html
- **Device Registration:** Creates "All Ears Web Player" device visible in Spotify Connect
- **Playback Control:** Play/pause/skip via Web Playback SDK + queue management via Web API

**OAuth Scopes:** streaming, user-read-playback-state, user-modify-playback-state, user-read-email, user-read-private, playlist-read-private, playlist-read-collaborative, user-top-read, user-library-read, user-follow-read

**Token Management:**
- Stored in localStorage via `src/utils/storage.js` helper
- Auto-refresh 5 minutes before expiry (handled by useSpotifyAuth hook)
- SpotifyAPIClient automatically retries requests with refreshed tokens on 401 errors

### Custom Hooks Architecture

The app uses React hooks extensively for clean separation of concerns:

- **`useSpotifyAuth`** (`src/hooks/useSpotifyAuth.js`)
  - Manages OAuth flow, token storage, and user session
  - Handles URL hash parsing on OAuth callback
  - Auto-refreshes tokens before expiry
  - Provides: `accessToken`, `isAuthenticated`, `user`, `login()`, `logout()`

- **`useSpotifyPlayer`** (`src/hooks/useSpotifyPlayer.js`)
  - Initializes Spotify Web Playback SDK
  - Creates and manages browser-based player device
  - Listens to playback state changes
  - Provides: `player`, `deviceId`, `isReady`, `isPaused`, `currentTrack`, `play()`, `togglePlay()`, `nextTrack()`, `previousTrack()`, `seek()`, `addToQueue()`

- **`useMarket`** (`src/hooks/useMarket.js`)
  - Fetches and caches user's country code for region-specific content

### State Management Strategy

**MusicContext (Context API):**
- Location: `src/components/MusicContext.js`
- Manages global playback state and queue
- Wraps entire app in `App.js` (receives `spotifyPlayer` as prop)

**Context provides:**
```javascript
{
  // Playback state (derived from spotifyPlayer)
  currentTrack: Object,       // Currently playing track
  isPlaying: Boolean,         // Playing/paused state
  spotifyPlayer: Object,      // Direct access to useSpotifyPlayer hook

  // Queue management
  queuedTracks: Array,        // Upcoming tracks
  addToQueue: Function,       // Add track to end of queue
  addToQueueNext: Function,   // Add track next in queue
  removeFromQueue: Function,  // Remove track by URI
  reorderQueue: Function,     // Drag-and-drop reordering
  clearQueue: Function,       // Clear all queued tracks

  // Playback controls
  playTrack: Function,        // Play single track
  playAll: Function,          // Play multiple tracks in order
  shuffleAll: Function,       // Play multiple tracks shuffled
  playPauseHandler: Function,
  nextSongHandler: Function,
  prevSongHandler: Function,
}
```

**Important:** Queue reordering and removal only affect the display state in `QueueViewer`. Spotify's Web API doesn't support queue manipulation, so actual playback order won't change unless queue is rebuilt.

**API data:** Props drilling pattern (no global state for API data)
- `accessToken` and `market` passed down from App.js through component hierarchy
- Data fetched in App.js and passed as props to child components
- Components use `spotifyAPI` singleton client directly for additional API calls

### Component Hierarchy & Routing

```
App.js (root component)
├── Login (shown if !isAuthenticated)
├── NavBar (fixed header with user profile)
├── Routes:
│   ├── / (Home)
│   │   ├── SearchBar → SearchResults (conditional, replaces home content)
│   │   ├── ListContainerWrapper
│   │   │   ├── ListContainer (Dynamic category - 3 tracks)
│   │   │   ├── ListContainer2 (Dynamic category - 3 tracks)
│   │   │   └── ListContainer3 (Recently Played - from Spotify API)
│   │   └── GenreCarousel (20 Spotify categories, react-slick)
│   ├── /library (YourLibrary component)
│   │   └── Tabs: Songs/Albums/Artists/Playlists (real user data)
│   ├── /explore (Explore component - AI assistant placeholder)
│   ├── /for-you (ForYou - "View All" for category 2)
│   ├── /new-releases (NewReleases - "View All" for category 1)
│   ├── /recently-played (RecentlyPlayed - "View All" for recent tracks)
│   ├── /album/:albumId (Album detail page)
│   ├── /playlist/:playlistId (Playlist detail page)
│   ├── /genre/:genreId (Genre/category browse page)
│   └── /radio/:trackId (Radio - track-based recommendations)
├── MusicPlayer (fixed footer, always visible)
│   └── QueueViewer (slide-out panel)
└── TrackContextMenu/QueueContextMenu (right-click menus)
```

**Important route changes:**
- Home moved from `/all-ears` to `/` (with redirect for old path)
- "View All" pages added for each section
- Album, playlist, genre, and radio detail pages added
- All routes require authentication (Login shown if not authenticated)

### Playback Architecture

**Spotify Web Playback SDK (Full Playback):**
- **Requirement:** Spotify Premium account
- **Implementation:** Full-length, high-quality streaming via Spotify's official SDK
- **Player Device:** Registered as "All Ears Web Player" in Spotify Connect
- **Playback Controls:**
  - `MusicPlayer.js` - Fixed footer player with play/pause, skip, progress bar
  - Progress bar updates via polling (`getCurrentState()` every 500ms when playing)
  - Seek functionality via slider drag
- **Track Context:** Supports playing from album/playlist context (full playback experience)

**Queue System:**
- **QueueViewer** (`src/components/QueueViewer.js`) - Slide-out panel showing upcoming tracks
- **Features:**
  - Drag-and-drop reordering (react-beautiful-dnd)
  - Right-click context menus (play next, remove from queue, go to album/artist/radio)
  - "Play All" and "Shuffle All" for albums/playlists
  - Visual indicator for currently playing track
- **Limitation:** Queue display is UI-only; Spotify doesn't support queue reordering via API

**Context Menus:**
- **TrackContextMenu** - Right-click on any track (play, add to queue, go to album/artist/radio)
- **QueueContextMenu** - Right-click on queued tracks (play next, remove, navigation)

### Data Flow Pattern

1. **App.js initialization (after auth):**
   - Fetches Spotify categories (via `/browse/categories`)
   - Uses first two categories to populate home sections (dynamic titles)
   - Searches for playlists matching category names, extracts 3 tracks each
   - Fetches recently played tracks (via `/me/player/recently-played`)
   - All data passed as props to Home component

2. **Props drilling:** Through Home → ListContainerWrapper → ListContainer components

3. **Search flow:**
   - User types in SearchBar, presses Enter
   - Searches 4 types: tracks, artists, albums, playlists (limit 10 each)
   - Results passed up to Home via `setSearchResults` callback
   - SearchResults component conditionally rendered, hiding home content

4. **Playback flow:**
   - User clicks track (SongSmall, SongMedium) or album/playlist "Play All"
   - Component calls `playTrack()` / `playAll()` from MusicContext
   - MusicContext calls `spotifyPlayer.play(uri)` or `spotifyPlayer.addToQueue(uri)`
   - SDK plays track and emits state changes
   - MusicPlayer and QueueViewer update via context state changes

5. **Navigation flow:**
   - Genre cards link to `/genre/:genreId`
   - Album/playlist cards link to `/album/:id` or `/playlist/:id`
   - "View All" buttons link to category-specific pages
   - Radio icon in MusicPlayer links to `/radio/:trackId`

## Styling Approach

- **Material-UI v5** with custom theme (primary: `#181C1E`, secondary: `#FF6E1D`)
- **Typography:** 'Prompt' font family from Google Fonts
- **Ripple effects disabled globally** (see theme config in App.js)
- **sx prop** for component-level styling (no CSS modules)
- Minimal CSS files in `/src/styles/`

## Important Implementation Details

### Dynamic Home Sections

The home page sections are **dynamically generated** from Spotify categories:
- First category → "New Releases" section (or category name)
- Second category → "For You" section (or category name)
- Third section → Recently Played (from user's Spotify history)

**Implementation:** `App.js` lines ~74-180
1. Fetches categories from `/browse/categories?limit=20`
2. For each of first two categories, searches for matching playlists
3. Extracts first 3 tracks from best-matching playlist
4. Sets dynamic titles and IDs for "View All" pages

**Why this approach:** Avoids hardcoded playlist IDs that may not work across regions/accounts

### Search Implementation

**Location:** `src/components/SearchBar.js`
- Triggers on Enter key press (not real-time)
- Searches 4 types simultaneously: tracks, artists, albums, playlists (limit 10 each)
- Results passed up to Home component via `setSearchResults` callback
- SearchResults component conditionally rendered, hiding normal home content

### Genre Carousel

- Uses `react-slick` library with custom Material-UI arrows
- Shows 4 cards at a time, scrolls by 4
- Genre cards link to internal `/genre/:id` pages (not external)
- 20 Spotify categories fetched from API with color-coded backgrounds and SVG overlays

### Radio Feature

**Implementation:** `/radio/:trackId` route
- Uses Spotify's `/recommendations` endpoint with track seed
- Fetches 50 recommended tracks similar to seed track
- Displays as a playable list with album art and metadata
- "Play All" and "Shuffle All" buttons queue entire radio station

## Key Dependencies

- **React 18** - Core framework
- **React Router v6** - Client-side routing
- **Material-UI v5** (`@mui/material`, `@emotion/react`, `@emotion/styled`) - UI components and styling
- **react-slick** + **slick-carousel** - Genre carousel
- **react-beautiful-dnd** - Drag-and-drop queue reordering
- **Express 5** - Local dev server for OAuth proxy
- **http-proxy-middleware** - Proxies React dev server through Express
- **dotenv** - Environment variable management
- **concurrently** - Runs Express + React dev servers simultaneously

## Known Issues & Limitations

### Spotify Premium Requirement
- **Full playback requires Spotify Premium subscription**
- Free users will see player but cannot play tracks
- No fallback to preview URLs (removed in recent updates)

### Queue Management Limitations
- Queue reordering and removal are **UI-only** (display state)
- Spotify's Web API doesn't support queue reordering or removal
- Actual playback order follows Spotify's internal queue
- Consider rebuilding queue from scratch if reordering is critical

### Explore/Assistant Page
- UI exists but Generate button has no functionality
- Placeholder for future AI music assistant feature
- Located at `/explore` route

### Error Handling
- API failures logged to console but minimal user-facing error states
- No loading spinners or skeleton screens in most components
- Components handle null data with early returns
- ErrorBoundary wraps entire app for React errors

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

## Documentation Structure

The project uses a comprehensive documentation system inspired by the Show.me methodology:

### `/docs/kits/` - Phase-Based Implementation Kits

Each major feature phase has a complete documentation kit with 4 files:

#### 4-File Kit Pattern

1. **PROMPT.md** - Master implementation guide
   - Copy-paste ready instructions
   - Complete code snippets with full context
   - Step-by-step implementation details
   - Acceptance criteria and prerequisites

2. **EXECUTION-PLAN.md** - Day-by-day task breakdown
   - Time estimates for each task
   - Clear deliverables
   - Sequential dependencies
   - Resource allocation

3. **TESTING.md** - Manual test procedures
   - Test suites with specific steps
   - Expected results for each test
   - Success criteria
   - Validation checklists

4. **PROGRESS.md** - Real-time progress tracking
   - Task completion checklists
   - Testing results tables
   - Time tracking
   - Exit criteria status
   - Notes and observations

#### Current Phase Kits

- **Phase 0** (`/docs/kits/phase-0/`) - Prerequisites & Infrastructure Setup
  - AI client integration (Anthropic Claude)
  - Database setup (Vercel Postgres + KV)
  - Environment configuration
  - Feature flags system

- **Phase 0.5** (`/docs/kits/phase-0.5/`) - Design System Documentation & Extension
  - Audit existing All Ears design patterns
  - Document Material-UI theme and components
  - Extend with Musical Journey UI specifications
  - Create comprehensive style guide (1,000+ lines)
  - Define 8 journey-specific components

- **Phases 1-5** (`/docs/kits/phase-1/` through `/docs/kits/phase-5/`) - Reserved for future implementation phases

### `/docs/reference/` - Technical Reference Documentation

Comprehensive technical documentation for ongoing reference:

- **ARCHITECTURE.md** - System architecture overview
  - High-level component diagram
  - Technology stack
  - Authentication and data flows
  - Integration patterns

- **DATABASE-SCHEMA.md** - Complete database schema
  - Table definitions and relationships
  - JSONB structures for nested data
  - Indexes and query patterns
  - Cache strategy (Vercel KV)

- **API-ROUTES.md** - All API endpoint documentation
  - Request/response formats
  - Authentication requirements
  - Error codes and handling
  - Usage examples

- **SPOTIFY-API-INTEGRATION.md** - Spotify API patterns
  - Key endpoints used
  - Data models and transformations
  - Rate limiting strategy
  - Best practices

- **AI-PROMPTS.md** - Claude AI prompt documentation
  - Prompt templates for narrative generation
  - Pathway type specifications
  - Response formats and validation
  - Token limits and retry logic

- **DEPLOYMENT.md** - Vercel deployment guide
  - Environment variable configuration
  - Database and KV setup
  - Deployment process and verification
  - Rollback procedures

### `/design-system/` - UI Design System

Design system documentation and specifications (created in Phase 0.5):

- **style-guide.md** - Comprehensive UI component specifications
  - Existing All Ears components documented
  - Journey feature components specified
  - Material-UI patterns and conventions
  - React implementation examples

- **design-philosophy.md** - Design principles and decisions
  - All Ears aesthetic guidelines
  - Journey feature design approach
  - Accessibility principles
  - Graph visualization philosophy

### Using the Documentation

**When implementing a new phase:**
1. Read the phase's PROMPT.md file first (complete implementation guide)
2. Follow EXECUTION-PLAN.md for day-by-day task breakdown
3. Use PROGRESS.md to track completion in real-time
4. Run TESTING.md validation tests before considering phase complete
5. Reference `/docs/reference/` files for technical details as needed

**When making design decisions:**
1. Check `/design-system/style-guide.md` for existing patterns
2. Ensure new components follow All Ears aesthetic
3. Use Material-UI with sx prop (consistent with codebase)
4. Document any new patterns for future reference

**When troubleshooting:**
1. Check relevant reference documentation in `/docs/reference/`
2. Review ARCHITECTURE.md for system-level understanding
3. Consult DATABASE-SCHEMA.md for data structure questions
4. Check API-ROUTES.md for endpoint specifications

## Common Development Tasks

### Adding a New Route/Page
1. Create component in `src/components/`
2. Add route in `App.js` `<Routes>` section
3. Pass `accessToken` and `market` props if needed
4. Use `spotifyAPI.directRequest()` or convenience methods for data fetching

### Adding a New Spotify API Endpoint
1. Create serverless function in `/api/spotify/` (if proxying is needed for security)
2. Add endpoint constant to `src/utils/constants.js` `API_ENDPOINTS.SPOTIFY`
3. Add convenience method to `SpotifyAPIClient` class in `src/api/spotify-client.js`
4. Or use `spotifyAPI.directRequest()` for direct Spotify API calls

### Working with Playback
- Access `spotifyPlayer` from MusicContext: `const { spotifyPlayer } = useMusicContext()`
- Play track: `playTrack(spotifyTrackObject)` - converts and plays
- Play album/playlist: `playAll(tracksArray)` - queues all tracks
- Check player ready: `spotifyPlayer.isReady` before attempting playback
- **Important:** Always check for Premium requirement in UI/error messages

### Debugging OAuth Issues
- Check `.env` file has all 4 variables set
- Verify redirect URI matches Spotify Dashboard exactly (including http vs https)
- Check browser console for token refresh errors
- Use `localStorage.clear()` to reset auth state during development
- Ensure `npm run dev` is used (not `npm start`) for local OAuth flow

### Testing Without Premium
- OAuth and data fetching work without Premium
- Playback will fail with SDK error
- Consider adding Premium check and showing upgrade prompt
