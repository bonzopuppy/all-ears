# Spotify API Integration
**Musical Journey Feature**

**Last Updated:** [DATE]
**API Version:** Spotify Web API v1

---

## Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [Key Endpoints](#key-endpoints)
- [Data Models](#data-models)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Overview

The Musical Journey feature integrates with Spotify Web API for:
- Artist, track, and album data
- Related artists (for pathway generation)
- User authentication and account access
- Music playback (preview URLs)

**Base URL:** `https://api.spotify.com/v1`

---

## Authentication

### OAuth 2.0 Flow

**Grant Type:** Authorization Code with PKCE

**Scopes Required:**
```
user-read-email
user-read-private
streaming
user-read-playback-state
user-modify-playback-state
user-top-read
playlist-read-private
playlist-read-collaborative
```

**Token Storage:**
[Storage details to be added]

**Token Refresh:**
[Refresh flow details to be added]

---

## Key Endpoints

### Get Artist

```
GET /v1/artists/{id}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "genres": ["genre1", "genre2"],
  "images": [
    {
      "url": "string",
      "height": 640,
      "width": 640
    }
  ],
  "popularity": 85,
  "external_urls": {
    "spotify": "string"
  }
}
```

**Use Case:** [Usage details to be added]

---

### Get Artist's Related Artists

```
GET /v1/artists/{id}/related-artists
```

**Response:**
```json
{
  "artists": [
    {
      "id": "string",
      "name": "string",
      "genres": [...],
      "images": [...],
      "popularity": 75
    }
  ]
}
```

**Use Case:** [Usage details to be added]

---

### Get Artist's Top Tracks

```
GET /v1/artists/{id}/top-tracks?market=US
```

**Response:**
```json
{
  "tracks": [
    {
      "id": "string",
      "name": "string",
      "preview_url": "string (nullable)",
      "duration_ms": 240000,
      "album": {
        "id": "string",
        "name": "string",
        "images": [...]
      }
    }
  ]
}
```

**Use Case:** [Usage details to be added]

---

### Search

```
GET /v1/search?q={query}&type=artist,track,album&limit=10
```

**Response:**
```json
{
  "artists": {
    "items": [...]
  },
  "tracks": {
    "items": [...]
  },
  "albums": {
    "items": [...]
  }
}
```

**Use Case:** [Usage details to be added]

---

### Get Multiple Artists

```
GET /v1/artists?ids={id1},{id2},{id3}
```

**Response:**
```json
{
  "artists": [
    { ... },
    { ... }
  ]
}
```

**Use Case:** [Usage details to be added]

---

## Data Models

### Artist Object

```typescript
interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: SpotifyImage[];
  popularity: number;
  external_urls: {
    spotify: string;
  };
  followers: {
    total: number;
  };
}
```

---

### Track Object

```typescript
interface SpotifyTrack {
  id: string;
  name: string;
  preview_url: string | null;
  duration_ms: number;
  explicit: boolean;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: {
    spotify: string;
  };
}
```

---

### Album Object

```typescript
interface SpotifyAlbum {
  id: string;
  name: string;
  release_date: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
}
```

---

## Rate Limiting

**Limits:**
[Rate limit details to be added]

**Handling:**
[Rate limit handling strategy to be added]

**Retry Strategy:**
[Retry strategy details to be added]

---

## Error Handling

### Common Error Responses

```json
{
  "error": {
    "status": 401,
    "message": "The access token expired"
  }
}
```

**Error Codes:**
- `401`: Unauthorized (token expired/invalid)
- `403`: Forbidden (insufficient scope)
- `404`: Not found (resource doesn't exist)
- `429`: Rate limit exceeded
- `500`: Internal server error

**Handling Strategy:**
[Error handling details to be added]

---

## Best Practices

### Caching Strategy

**What to Cache:**
[Caching details to be added]

**Cache Duration:**
[Duration details to be added]

---

### Batch Requests

**When to Batch:**
[Batching guidelines to be added]

**Example:**
[Example code to be added]

---

### Preview URL Handling

**Availability:**
- Not all tracks have preview URLs
- Preview URLs are 30-second MP3 clips
- URLs may expire

**Fallback Strategy:**
[Fallback details to be added]

---

## References

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api/)
- [Architecture](./ARCHITECTURE.md) - System architecture
- [API Routes](./API-ROUTES.md) - All Ears API endpoints

---

*Last Updated: [DATE]*
*Version: [VERSION]*
