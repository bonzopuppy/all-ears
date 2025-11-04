# API Routes
**Musical Journey Feature**

**Last Updated:** [DATE]
**Base URL:** Production: `https://[your-app].vercel.app` | Local: `http://127.0.0.1:3000`

---

## Table of Contents
- [Authentication Routes](#authentication-routes)
- [Journey Routes](#journey-routes)
- [Spotify Proxy Routes](#spotify-proxy-routes)
- [Response Formats](#response-formats)
- [Error Codes](#error-codes)

---

## Authentication Routes

### `POST /api/auth/login`

**Purpose:** Initiate Spotify OAuth 2.0 flow.

**Request:**
```json
{}
```

**Response:**
```json
{
  "authUrl": "https://accounts.spotify.com/authorize?..."
}
```

**Flow:**
[Auth flow details to be added]

---

### `GET /api/auth/callback`

**Purpose:** Handle Spotify OAuth callback.

**Query Parameters:**
- `code`: Authorization code from Spotify
- `state`: CSRF protection token

**Response:**
[Response details to be added]

---

### `POST /api/auth/refresh`

**Purpose:** Refresh expired access token.

**Request:**
```json
{
  "refreshToken": "string"
}
```

**Response:**
```json
{
  "accessToken": "string",
  "expiresIn": 3600
}
```

---

## Journey Routes

### `GET /api/journeys`

**Purpose:** Get user's journey history.

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Request Headers:**
```
Authorization: Bearer {spotify_access_token}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "string (nullable)",
      "startingNodeName": "string",
      "startingNodeType": "artist | track | album",
      "nodeCount": 5,
      "trackCount": 12,
      "createdAt": "ISO 8601 timestamp"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0
  }
}
```

---

### `POST /api/journeys`

**Purpose:** Create a new journey.

**Request:**
```json
{
  "startingNodeType": "artist | track | album",
  "startingNodeId": "string (Spotify ID)",
  "startingNodeName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": null,
    "startingNodeType": "artist",
    "startingNodeId": "spotify-id",
    "startingNodeName": "Artist Name",
    "nodesVisited": [],
    "tracks": [],
    "narratives": [],
    "createdAt": "ISO 8601 timestamp"
  }
}
```

---

### `GET /api/journeys/:journeyId`

**Purpose:** Get journey details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "string (nullable)",
    "startingNodeType": "artist",
    "startingNodeId": "spotify-id",
    "startingNodeName": "Artist Name",
    "nodesVisited": [
      {
        "nodeId": "spotify-id",
        "nodeType": "artist",
        "nodeName": "Artist Name",
        "pathwayType": "influences",
        "visitedAt": "ISO 8601 timestamp",
        "narrative": "string"
      }
    ],
    "tracks": [
      {
        "trackId": "spotify-id",
        "trackName": "Track Name",
        "artistName": "Artist Name",
        "albumName": "Album Name",
        "previewUrl": "string (nullable)",
        "addedAt": "ISO 8601 timestamp",
        "fromNodeId": "spotify-id"
      }
    ],
    "narratives": [...],
    "createdAt": "ISO 8601 timestamp"
  }
}
```

---

### `POST /api/journeys/:journeyId/continue`

**Purpose:** Generate next pathway nodes from current position.

**Request:**
```json
{
  "currentNodeId": "string (Spotify ID)",
  "currentNodeType": "artist | track | album",
  "pathwayType": "influences | legacy | collaborators | contemporaries | genre"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nodes": [
      {
        "nodeId": "spotify-id",
        "nodeType": "artist",
        "nodeName": "Artist Name",
        "pathwayType": "influences",
        "narrative": "AI-generated connection story",
        "imageUrl": "string",
        "spotifyUrl": "string"
      }
    ],
    "tracks": [
      {
        "trackId": "spotify-id",
        "trackName": "Track Name",
        "artistName": "Artist Name",
        "previewUrl": "string (nullable)"
      }
    ]
  }
}
```

---

### `DELETE /api/journeys/:journeyId`

**Purpose:** Delete a journey.

**Response:**
```json
{
  "success": true,
  "message": "Journey deleted"
}
```

---

## Spotify Proxy Routes

### `GET /api/spotify/search`

**Purpose:** Proxy Spotify search API.

**Query Parameters:**
- `q`: Search query
- `type`: Comma-separated types (artist,track,album)
- `limit`: Results per type (default: 10)

**Response:**
[Response details to be added]

---

## Response Formats

### Success Response

```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  }
}
```

---

## Error Codes

```typescript
enum ApiErrorCode {
  // Auth errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',

  // Resource errors
  JOURNEY_NOT_FOUND = 'JOURNEY_NOT_FOUND',
  NODE_NOT_FOUND = 'NODE_NOT_FOUND',

  // Permission errors
  FORBIDDEN = 'FORBIDDEN',
  NOT_JOURNEY_OWNER = 'NOT_JOURNEY_OWNER',

  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_NODE_TYPE = 'INVALID_NODE_TYPE',
  INVALID_PATHWAY_TYPE = 'INVALID_PATHWAY_TYPE',

  // Service errors
  SPOTIFY_API_ERROR = 'SPOTIFY_API_ERROR',
  AI_GENERATION_FAILED = 'AI_GENERATION_FAILED',
  DATABASE_ERROR = 'DATABASE_ERROR',
  CACHE_ERROR = 'CACHE_ERROR',
}
```

---

## References

- [Architecture](./ARCHITECTURE.md) - System architecture
- [Database Schema](./DATABASE-SCHEMA.md) - Data structures
- [Spotify Integration](./SPOTIFY-API-INTEGRATION.md) - Spotify API details

---

*Last Updated: [DATE]*
*Version: [VERSION]*
