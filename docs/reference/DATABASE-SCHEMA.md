# Database Schema
**Musical Journey Feature**

**Last Updated:** [DATE]
**Database:** Vercel Postgres (PostgreSQL)

---

## Table of Contents
- [Overview](#overview)
- [Tables](#tables)
- [Indexes](#indexes)
- [JSONB Structures](#jsonb-structures)
- [Queries](#queries)
- [Cache Strategy](#cache-strategy)

---

## Overview

The Musical Journey feature uses Vercel Postgres for persistent storage and Vercel KV (Redis) for caching.

**Core Design Principles:**
- User-scoped journeys (privacy by default)
- JSONB for flexible nested data structures
- Indexes optimized for common queries
- Separate cache layer for Spotify/AI data

---

## Tables

### `journeys`

**Purpose:** Store complete user journey sessions including nodes visited, tracks collected, and narratives generated.

```sql
CREATE TABLE journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  starting_node_type VARCHAR(50) NOT NULL,
  starting_node_id VARCHAR(255) NOT NULL,
  starting_node_name VARCHAR(255) NOT NULL,
  nodes_visited JSONB NOT NULL DEFAULT '[]'::jsonb,
  tracks JSONB NOT NULL DEFAULT '[]'::jsonb,
  narratives JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(255) UNIQUE
);
```

**Columns:**
- `id`: Unique journey identifier
- `user_id`: [User identifier details to be added]
- `title`: Optional user-provided journey title
- `starting_node_type`: [Type details to be added]
- `starting_node_id`: [ID details to be added]
- `starting_node_name`: [Name details to be added]
- `nodes_visited`: [JSONB structure details - see below]
- `tracks`: [JSONB structure details - see below]
- `narratives`: [JSONB structure details - see below]
- `created_at`: Journey creation timestamp
- `updated_at`: Last modification timestamp
- `is_public`: Whether journey is publicly shareable
- `share_token`: Unique token for public sharing

---

### `journey_nodes_cache`

**Purpose:** Cache pathway node data (Spotify API results + AI narratives) to reduce API calls.

```sql
CREATE TABLE journey_nodes_cache (
  cache_key VARCHAR(500) PRIMARY KEY,
  node_data JSONB NOT NULL,
  cached_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

**Columns:**
- `cache_key`: [Key pattern details to be added]
- `node_data`: [JSONB structure details to be added]
- `cached_at`: Cache entry creation time
- `expires_at`: Expiration time for cache invalidation

---

## Indexes

### `journeys` Indexes

```sql
-- User journey lookup
CREATE INDEX idx_journeys_user_id ON journeys(user_id);

-- Public journey discovery
CREATE INDEX idx_journeys_public ON journeys(is_public) WHERE is_public = true;

-- Share token lookup
CREATE INDEX idx_journeys_share_token ON journeys(share_token) WHERE share_token IS NOT NULL;

-- Recent journeys
CREATE INDEX idx_journeys_created_at ON journeys(created_at DESC);

-- JSONB indexing for search
CREATE INDEX idx_journeys_nodes_visited ON journeys USING gin(nodes_visited);
```

**Usage Patterns:**
[Index usage details to be added]

### `journey_nodes_cache` Indexes

```sql
-- Expiration cleanup
CREATE INDEX idx_cache_expires_at ON journey_nodes_cache(expires_at);
```

---

## JSONB Structures

### `nodes_visited` JSONB Structure

```json
[
  {
    "nodeId": "string (Spotify ID)",
    "nodeType": "artist | track | album | genre",
    "nodeName": "string",
    "pathwayType": "influences | legacy | collaborators | contemporaries | genre",
    "visitedAt": "ISO 8601 timestamp",
    "parentNodeId": "string (optional)",
    "narrative": "string (AI-generated connection story)"
  }
]
```

**Fields:**
[Field descriptions to be added]

---

### `tracks` JSONB Structure

```json
[
  {
    "trackId": "string (Spotify ID)",
    "trackName": "string",
    "artistName": "string",
    "albumName": "string",
    "previewUrl": "string (nullable)",
    "addedAt": "ISO 8601 timestamp",
    "fromNodeId": "string (which node added this track)"
  }
]
```

**Fields:**
[Field descriptions to be added]

---

### `narratives` JSONB Structure

```json
[
  {
    "id": "string (UUID)",
    "fromNodeId": "string",
    "toNodeId": "string",
    "pathwayType": "influences | legacy | collaborators | contemporaries | genre",
    "narrative": "string (AI-generated story)",
    "generatedAt": "ISO 8601 timestamp"
  }
]
```

**Fields:**
[Field descriptions to be added]

---

## Queries

### Common Query Patterns

#### Get User's Journeys

```sql
SELECT
  id,
  title,
  starting_node_name,
  created_at,
  jsonb_array_length(nodes_visited) as node_count,
  jsonb_array_length(tracks) as track_count
FROM journeys
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;
```

---

#### Get Journey Detail

```sql
SELECT * FROM journeys WHERE id = $1;
```

---

#### Search Journeys by Starting Point

```sql
SELECT *
FROM journeys
WHERE user_id = $1
  AND starting_node_id = $2
ORDER BY created_at DESC;
```

---

#### Find Cached Node

```sql
SELECT node_data
FROM journey_nodes_cache
WHERE cache_key = $1
  AND (expires_at IS NULL OR expires_at > NOW());
```

---

## Cache Strategy

### Vercel KV (Redis) Cache Patterns

**Key Patterns:**
```
pathway:{type}:{id}                    # TTL: 1 hour
narrative:{fromId}:{toId}:{type}       # TTL: 7 days
spotify:artist:{id}                    # TTL: 24 hours
spotify:track:{id}                     # TTL: 24 hours
```

**Cache Flow:**
[Cache flow details to be added]

**Invalidation Strategy:**
[Invalidation details to be added]

---

## Migration Scripts

### Initial Migration

```sql
-- Create tables
[Migration SQL to be added]
```

### Rollback

```sql
-- Drop tables
[Rollback SQL to be added]
```

---

## References

- [Architecture](./ARCHITECTURE.md) - System architecture overview
- [API Routes](./API-ROUTES.md) - API endpoint documentation

---

*Last Updated: [DATE]*
*Version: [VERSION]*
