# Musical Journey — Backend/Infrastructure (MVP)

This doc describes the backend/infrastructure pieces added on branch `feature/journey-backend`.

## What’s included

### 1) Database (Vercel Postgres)

**Tables** (see migrations):
- `journeys` — per-user saved journeys
- `journey_nodes_cache` — cached AI pathway generations per node

**Migration files**
- `db/migrations/001_create_journeys.sql`
- `db/migrations/002_create_journey_nodes_cache.sql`

**Run migrations locally**
```bash
# set POSTGRES_URL in your environment
npm run db:migrate
```

> Note: migrations are plain SQL files executed in filename order.

### 2) KV caching + rate limiting

KV is used for:
- short-term caching of AI responses (to avoid burst re-generation)
- simple per-IP rate limiting

If KV env vars are not set, code **falls back to “no caching/no rate limiting”** (MVP-friendly local dev).

### 3) Claude (Anthropic) integration

**Shared helpers**
- `api/_lib/anthropic.js` — Anthropic client singleton + KV cache helper + safe JSON parsing

**Serverless endpoints**
- `POST /api/ai/generate-pathways`
  - Input: `{ nodeType, nodeId, nodeName, context? }`
  - Caching:
    - checks Postgres `journey_nodes_cache` (24h TTL)
    - also caches to KV for 1h
- `POST /api/ai/generate-narrative`
  - Input: `{ fromNode, toNode, connectionType? }`
  - Caching: KV 24h

Both endpoints enforce a simple per-IP rate limit (configurable via env).

### 4) Journey CRUD API

**Authenticated (requires Spotify Bearer token)**
- `GET /api/journeys?limit=25&offset=0` — list current user’s journeys
- `POST /api/journeys` — create journey
- `GET /api/journeys/:id` — load journey (owner only)
- `PUT/PATCH /api/journeys/:id` — update journey
- `DELETE /api/journeys/:id` — delete journey

User identity is derived by calling Spotify `GET /v1/me` server-side using the bearer token.

**Public shared journeys**
- `GET /api/journeys/shared/:token` — load a public journey by share token (no auth)

### 5) Spotify playlist export

- `POST /api/spotify/create-playlist`
  - Input: `{ journeyId }` (loads tracks from DB) **or** `{ title, description, trackUris }`
  - Creates a playlist in the authenticated user’s account and adds tracks (batched by 100).

### 6) React Flow foundation (logic only)

Added minimal data structures + state management that the UI layer can build on:
- `src/journey/graphTypes.js` — JSDoc types + constants
- `src/journey/graphTraversal.js` — adjacency + BFS + `pathwaysToGraph()` conversion helper
- `src/journey/journeyStore.js` — Zustand store for center/node/edge/visited/recording

No styling or UI components were added.

## Environment variables

See `.env.example` for the full list.

Required for AI:
- `ANTHROPIC_API_KEY`

Required for Postgres:
- `POSTGRES_URL`

Recommended for caching/rate limiting:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

Feature flag:
- `REACT_APP_FEATURE_JOURNEY_ENABLED=false`

## What’s ready for David (visual design layer)

- React Flow can be introduced by creating UI components that:
  - call `POST /api/ai/generate-pathways`
  - use `pathwaysToGraph()` to convert response → nodes/edges
  - render with `reactflow` using a custom `journeyNode` node type
- Journey persistence endpoints are ready for save/load/share.

## Known decisions / follow-ups

- `@vercel/postgres` and `@vercel/kv` are deprecated by Vercel (migrated services: Neon + Upstash).
  - Current implementation keeps the recommended API from the implementation plan.
  - If you want to switch to Neon/Upstash SDKs, the API layer is isolated in `api/_lib/db.js` and `api/_lib/kv.js`.
