# System Architecture
**Musical Journey Feature**

**Last Updated:** [DATE]
**Architecture Model:** User-Scoped Journey System with AI Generation

---

## Table of Contents
- [High-Level Overview](#high-level-overview)
- [Technology Stack](#technology-stack)
- [Authentication Flow](#authentication-flow)
- [Database Architecture](#database-architecture)
- [Storage Architecture](#storage-architecture)
- [AI Integration](#ai-integration)
- [API Architecture](#api-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Spotify Integration](#spotify-integration)
- [Data Flow Examples](#data-flow-examples)

---

## High-Level Overview

### System Components

```
[System diagram to be added]

┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              React 18 Frontend                              │ │
│  │  - Music Player  - Journey Graph  - Chat Interface         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ▲
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel (Express Backend)                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   API Routes    │  │  OAuth Handlers │  │   Serverless    │ │
│  │  /api/journeys  │  │  /api/auth/*    │  │   Functions     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
        │                    │                    │
        ├────────────────────┼────────────────────┤
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Spotify    │    │   Vercel     │    │  Anthropic   │
│  OAuth + API │    │   Postgres   │    │  Claude API  │
└──────────────┘    └──────────────┘    └──────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  Vercel KV   │
                    │   (Cache)    │
                    └──────────────┘
```

### Technology Stack

- **Frontend:** React 18, Material-UI v5, React Flow (graph visualization)
- **Backend:** Express.js (local dev), Vercel Serverless Functions (production)
- **Auth:** Spotify OAuth 2.0 (Authorization Code with PKCE)
- **Database:** Vercel Postgres (journey storage)
- **Cache:** Vercel KV (Redis - node caching)
- **AI:** Anthropic Claude API (narrative generation)
- **Music API:** Spotify Web API
- **Hosting:** Vercel (serverless deployment)

---

## Authentication Flow

### Spotify OAuth 2.0 Integration

```
[OAuth flow diagram to be added]
```

**Key Endpoints:**
- `/api/auth/login` - Initiates OAuth flow
- `/api/auth/callback` - Handles OAuth callback
- `/api/auth/refresh` - Refreshes expired tokens

**Token Storage:** localStorage via `useSpotifyAuth` hook

**Scopes Requested:**
[List of Spotify scopes to be added]

---

## Database Architecture

### Schema Overview

```
[Database schema diagram to be added]

┌──────────────────────────────────────────────────────────┐
│                         journeys                          │
│  - id (UUID)                                             │
│  - user_id (VARCHAR)                                     │
│  - starting_node_type, starting_node_id                  │
│  - nodes_visited (JSONB)                                 │
│  - tracks (JSONB)                                        │
│  - narratives (JSONB)                                    │
│  - created_at, is_public, share_token                    │
└──────────────────────────────────────────────────────────┘
                   │
                   │ Caching
                   ▼
┌──────────────────────────────────────────────────────────┐
│                  journey_nodes_cache                      │
│  - cache_key (VARCHAR, PRIMARY KEY)                      │
│  - node_data (JSONB)                                     │
│  - cached_at (TIMESTAMP)                                 │
└──────────────────────────────────────────────────────────┘
```

### Key Tables

**journeys:**
[Table details to be added]

**journey_nodes_cache:**
[Table details to be added]

### Indexes

[Index specifications to be added]

See [DATABASE-SCHEMA.md](./DATABASE-SCHEMA.md) for complete schema details.

---

## Storage Architecture

### Vercel KV (Redis Cache)

**Purpose:** Cache Spotify API responses to reduce API calls and improve performance.

**Key Patterns:**
```
pathway:{type}:{id}        # Pathway node data
narrative:{id1}:{id2}      # AI-generated narratives
spotify:artist:{id}        # Artist data
spotify:track:{id}         # Track data
```

**TTL Strategy:**
- Spotify data: 24 hours
- Pathway nodes: 1 hour
- Narratives: 7 days

[Additional caching details to be added]

---

## AI Integration

### Anthropic Claude API

**Purpose:** Generate musical narratives and pathway connections.

**AI Client Service:**
[Service implementation details to be added]

**Prompt Templates:**
[Prompt system details to be added]

**Retry Logic:**
[Retry strategy details to be added]

See [AI-PROMPTS.md](./AI-PROMPTS.md) for complete prompt documentation.

---

## API Architecture

### Route Structure

```
/api/
├── auth/
│   ├── login/              # Spotify OAuth login
│   ├── callback/           # OAuth callback handler
│   └── refresh/            # Token refresh
├── journeys/
│   ├── route.ts            # GET (list), POST (create)
│   └── [journeyId]/
│       ├── route.ts        # GET (detail), DELETE
│       └── continue/
│           └── route.ts    # POST (generate next nodes)
└── spotify/
    ├── search/             # Spotify search proxy
    └── [endpoint]/         # Spotify API proxy routes
```

[Additional route details to be added]

See [API-ROUTES.md](./API-ROUTES.md) for complete endpoint documentation.

---

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── App.js              # Root component
│   ├── NavBar.js           # Fixed navigation
│   ├── MusicPlayer.js      # Fixed audio player
│   ├── MusicContext.js     # Audio state management
│   ├── journey/            # Journey feature components
│   │   ├── JourneyGraph.js
│   │   ├── PathwayNode.js
│   │   ├── NarrativeCard.js
│   │   ├── ChatInterface.js
│   │   ├── JourneyRecorder.js
│   │   ├── JourneyPlaylist.js
│   │   └── StartingPointSelector.js
│   └── [other components]
└── hooks/
    ├── useSpotifyAuth.js
    └── useJourney.js       # Journey state management
```

[Additional architecture details to be added]

---

## Spotify Integration

### API Patterns

**Base URL:** `https://api.spotify.com/v1`

**Key Endpoints:**
[Endpoint list to be added]

**Authentication:**
[Auth pattern details to be added]

See [SPOTIFY-API-INTEGRATION.md](./SPOTIFY-API-INTEGRATION.md) for complete integration details.

---

## Data Flow Examples

### Example 1: Starting a New Journey

```
[Data flow to be added]
```

### Example 2: Generating Pathway Nodes

```
[Data flow to be added]
```

### Example 3: Playing Journey as Playlist

```
[Data flow to be added]
```

---

## References

- [Database Schema](./DATABASE-SCHEMA.md) - Complete SQL schema
- [API Routes](./API-ROUTES.md) - All endpoint documentation
- [Spotify Integration](./SPOTIFY-API-INTEGRATION.md) - Spotify API patterns
- [AI Prompts](./AI-PROMPTS.md) - Claude prompt documentation
- [Deployment](./DEPLOYMENT.md) - Vercel deployment guide

---

*Last Updated: [DATE]*
*Version: [VERSION]*
