# PHASE 0: Prerequisites & Setup

**Phase:** 0 (Foundation)
**Duration:** 3 days (12-16 hours)
**Architecture Version:** Musical Journey v1.0
**Status:** 🟡 Not Started

---

## Your Task

Set up the foundational infrastructure for Musical Journey: AI integration, database, dependencies, and feature flags. This phase establishes all prerequisites before any feature implementation begins.

---

## What You Will Build

1. **Anthropic Claude API Integration** - API client with rate limiting and error handling
2. **Database Layer** - Vercel Postgres for journeys + Vercel KV for AI response caching
3. **Feature Flag System** - Toggle journey feature on/off without deployment
4. **Environment Configuration** - Secure credential management for all services
5. **Database Schema** - Tables for journeys and AI pathway caching

---

## Prerequisites

Before starting, ensure:
- [ ] You have access to Vercel project (deployment target)
- [ ] You can create Anthropic account (or have access to create one)
- [ ] All Ears codebase is working locally (`npm run dev` succeeds)
- [ ] You understand the existing All Ears architecture (see `CLAUDE.md`)

---

## Implementation Steps

### Day 1: API Keys & AI Client (4-5 hours)

#### Task 1.1: Create Anthropic Account & Get API Key (30 min)

**Steps:**
1. Go to https://console.anthropic.com/
2. Sign up / log in
3. Navigate to API Keys section
4. Create new API key with name: "All Ears - Musical Journey - Development"
5. Copy API key (starts with `sk-ant-api03-`)
6. Store securely (will add to `.env` next)

**Verification:**
```bash
# Test API key works
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: YOUR_KEY_HERE" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 100,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

Expected: JSON response with Claude's message.

**Acceptance Criteria:**
- [ ] API key created and saved securely
- [ ] Test curl command returns valid response
- [ ] API key has not been committed to git

---

#### Task 1.2: Add Environment Variables (15 min)

**File:** `.env`

Add the following to your local `.env` file:

```bash
# Anthropic Claude API
ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE

# Feature Flags
REACT_APP_FEATURE_JOURNEY_ENABLED=false

# Database (will be populated by Vercel CLI)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

**Add to Vercel Environment Variables:**
1. Run: `vercel env add ANTHROPIC_API_KEY`
2. Paste your API key
3. Select: Production, Preview, Development
4. Repeat for `REACT_APP_FEATURE_JOURNEY_ENABLED` (set to `false`)

**Acceptance Criteria:**
- [ ] `.env` file updated with all variables
- [ ] `.env` is in `.gitignore` (verify not tracked)
- [ ] Vercel environment variables configured
- [ ] Can access `process.env.ANTHROPIC_API_KEY` in serverless functions

---

#### Task 1.3: Install Dependencies (15 min)

**Command:**
```bash
npm install @anthropic-ai/sdk@^0.20.0 \
            reactflow@^11.11.0 \
            @vercel/postgres@^0.8.0 \
            @vercel/kv@^1.0.1 \
            framer-motion@^11.0.0
```

**Verify installation:**
```bash
npm list @anthropic-ai/sdk reactflow @vercel/postgres @vercel/kv framer-motion
```

**Acceptance Criteria:**
- [ ] All packages installed without errors
- [ ] `package.json` updated with new dependencies
- [ ] `package-lock.json` updated
- [ ] No peer dependency warnings

---

#### Task 1.4: Create AI Client (2 hours)

**File:** `/src/api/ai-client.js`

```javascript
/**
 * Centralized Anthropic Claude API Client
 * Handles all AI interactions for Musical Journey feature
 */

import Anthropic from '@anthropic-ai/sdk';

class AIClient {
  constructor() {
    this.client = null;
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4096;
    this.isInitialized = false;
  }

  /**
   * Initialize the Anthropic client
   * Call this before using any AI methods
   */
  initialize() {
    if (this.isInitialized) return;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not found in environment variables');
    }

    this.client = new Anthropic({
      apiKey: apiKey,
    });

    this.isInitialized = true;
    console.log('[AIClient] Initialized successfully');
  }

  /**
   * Generate AI completion with automatic retry
   * @param {Object} params - Request parameters
   * @param {string} params.systemPrompt - System instruction
   * @param {string} params.userPrompt - User message
   * @param {number} params.maxTokens - Max tokens to generate (default: 4096)
   * @param {number} params.retries - Number of retries on failure (default: 2)
   * @returns {Promise<string>} AI-generated text
   */
  async complete({ systemPrompt, userPrompt, maxTokens, retries = 2 }) {
    if (!this.isInitialized) {
      this.initialize();
    }

    const attemptGeneration = async (attempt = 1) => {
      try {
        console.log(`[AIClient] Generating completion (attempt ${attempt}/${retries + 1})...`);

        const message = await this.client.messages.create({
          model: this.model,
          max_tokens: maxTokens || this.maxTokens,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        });

        const text = message.content[0].text;
        console.log(`[AIClient] Completion generated (${text.length} chars)`);
        return text;

      } catch (error) {
        console.error(`[AIClient] Error on attempt ${attempt}:`, error.message);

        // Retry on rate limit or server errors
        if (attempt <= retries && (error.status === 429 || error.status >= 500)) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 8000); // Exponential backoff
          console.log(`[AIClient] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return attemptGeneration(attempt + 1);
        }

        throw error;
      }
    };

    return attemptGeneration();
  }

  /**
   * Parse AI response as JSON with error handling
   * @param {string} response - AI-generated text
   * @returns {Object} Parsed JSON object
   */
  parseJSON(response) {
    try {
      // Remove markdown code blocks if present
      const cleaned = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

      return JSON.parse(cleaned);
    } catch (error) {
      console.error('[AIClient] JSON parse error:', error.message);
      console.error('[AIClient] Response was:', response);
      throw new Error('AI response was not valid JSON');
    }
  }
}

// Singleton instance
export const aiClient = new AIClient();
```

**Test the client:**

Create `/src/api/__tests__/ai-client.test.js`:

```javascript
import { aiClient } from '../ai-client';

describe('AIClient', () => {
  test('should initialize successfully', () => {
    aiClient.initialize();
    expect(aiClient.isInitialized).toBe(true);
  });

  test('should generate completion', async () => {
    const response = await aiClient.complete({
      systemPrompt: 'You are a helpful assistant.',
      userPrompt: 'Say "Hello World" and nothing else.',
      maxTokens: 50
    });

    expect(response).toContain('Hello World');
  }, 15000); // 15 second timeout for API call

  test('should parse JSON response', () => {
    const jsonResponse = '```json\n{"message": "test"}\n```';
    const parsed = aiClient.parseJSON(jsonResponse);
    expect(parsed).toEqual({ message: 'test' });
  });
});
```

Run test:
```bash
npm test -- ai-client.test.js
```

**Acceptance Criteria:**
- [ ] AIClient class created with singleton pattern
- [ ] `initialize()` method works
- [ ] `complete()` method generates AI responses
- [ ] Automatic retry on rate limits (429) and server errors (500+)
- [ ] Exponential backoff implemented
- [ ] JSON parsing handles markdown code blocks
- [ ] All tests pass

---

#### Task 1.5: Create Feature Flag Utility (30 min)

**File:** `/src/utils/featureFlags.js`

```javascript
/**
 * Feature flag utilities for gradual rollout
 */

export const FEATURES = {
  JOURNEY: 'JOURNEY',
};

/**
 * Check if a feature is enabled
 * @param {string} feature - Feature name from FEATURES constant
 * @returns {boolean}
 */
export function isFeatureEnabled(feature) {
  switch (feature) {
    case FEATURES.JOURNEY:
      return process.env.REACT_APP_FEATURE_JOURNEY_ENABLED === 'true';

    default:
      console.warn(`[FeatureFlags] Unknown feature: ${feature}`);
      return false;
  }
}

/**
 * HOC to conditionally render component based on feature flag
 * @param {string} feature - Feature name
 * @returns {Function} Higher-order component
 */
export function withFeatureFlag(feature) {
  return (Component) => {
    return (props) => {
      if (!isFeatureEnabled(feature)) {
        return null;
      }
      return <Component {...props} />;
    };
  };
}
```

**Test the utility:**

Create `/src/utils/__tests__/featureFlags.test.js`:

```javascript
import { isFeatureEnabled, FEATURES } from '../featureFlags';

describe('Feature Flags', () => {
  test('should return false when flag is not set', () => {
    process.env.REACT_APP_FEATURE_JOURNEY_ENABLED = 'false';
    expect(isFeatureEnabled(FEATURES.JOURNEY)).toBe(false);
  });

  test('should return true when flag is enabled', () => {
    process.env.REACT_APP_FEATURE_JOURNEY_ENABLED = 'true';
    expect(isFeatureEnabled(FEATURES.JOURNEY)).toBe(true);
  });
});
```

**Acceptance Criteria:**
- [ ] Feature flag utility created
- [ ] `isFeatureEnabled()` function works
- [ ] `withFeatureFlag()` HOC created
- [ ] Tests pass
- [ ] Can toggle feature flag via environment variable

---

### Day 2: Database Setup (4-5 hours)

#### Task 2.1: Create Vercel Postgres Database (30 min)

**Steps:**
1. Run: `vercel link` (if not already linked)
2. Run: `vercel postgres create`
3. Name: `all-ears-journeys`
4. Region: Choose closest to your users
5. Run: `vercel env pull .env` to get database URLs

**Verify connection:**

Create `/api/db-test.js`:

```javascript
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    const result = await sql`SELECT NOW()`;
    res.status(200).json({
      success: true,
      time: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

Test: `curl http://localhost:3000/api/db-test`

**Acceptance Criteria:**
- [ ] Vercel Postgres database created
- [ ] Database URLs populated in `.env`
- [ ] Test endpoint returns current time
- [ ] No connection errors

---

#### Task 2.2: Create Vercel KV Store (30 min)

**Steps:**
1. Run: `vercel kv create`
2. Name: `all-ears-journey-cache`
3. Region: Same as Postgres (for latency)
4. Run: `vercel env pull .env` to get KV URLs

**Verify connection:**

Create `/api/kv-test.js`:

```javascript
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Test write
    await kv.set('test_key', { timestamp: Date.now() });

    // Test read
    const value = await kv.get('test_key');

    res.status(200).json({
      success: true,
      value
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

Test: `curl http://localhost:3000/api/kv-test`

**Acceptance Criteria:**
- [ ] Vercel KV store created
- [ ] KV URLs populated in `.env`
- [ ] Test endpoint can write and read
- [ ] No connection errors

---

#### Task 2.3: Create Database Schema (2 hours)

**File:** `/sql/migrations/001_initial_schema.sql`

```sql
-- Musical Journey Database Schema
-- Version: 1.0
-- Created: 2025-11-04

-- Journeys table: User-created musical explorations
CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,  -- Spotify user ID
  title VARCHAR(255),
  starting_node_type VARCHAR(50) NOT NULL,  -- 'artist' | 'track' | 'genre'
  starting_node_id VARCHAR(255) NOT NULL,   -- Spotify ID
  starting_node_name VARCHAR(255) NOT NULL,
  nodes_visited JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Array of visited nodes
  tracks JSONB NOT NULL DEFAULT '[]'::jsonb,  -- Selected tracks with metadata
  narratives JSONB NOT NULL DEFAULT '[]'::jsonb,  -- AI-generated narratives per track
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(255) UNIQUE
);

-- Journey nodes cache: Avoid regenerating common pathways
CREATE TABLE IF NOT EXISTS journey_nodes_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type VARCHAR(50) NOT NULL,  -- 'artist' | 'track' | 'genre'
  node_id VARCHAR(255) NOT NULL,   -- Spotify ID
  pathways JSONB NOT NULL,  -- AI-generated pathways from this node
  generated_at TIMESTAMP DEFAULT NOW(),
  cache_expires_at TIMESTAMP NOT NULL,
  UNIQUE(node_type, node_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_journeys_user ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_share ON journeys(share_token);
CREATE INDEX IF NOT EXISTS idx_journeys_created ON journeys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cache_node ON journey_nodes_cache(node_type, node_id);
CREATE INDEX IF NOT EXISTS idx_cache_expires ON journey_nodes_cache(cache_expires_at);

-- Comments for documentation
COMMENT ON TABLE journeys IS 'User-created musical journey explorations with tracks and narratives';
COMMENT ON TABLE journey_nodes_cache IS 'Cache of AI-generated pathway data to reduce API calls';

COMMENT ON COLUMN journeys.nodes_visited IS 'JSONB array of node objects with type, id, name, timestamp';
COMMENT ON COLUMN journeys.tracks IS 'JSONB array of Spotify track objects';
COMMENT ON COLUMN journeys.narratives IS 'JSONB array of AI-generated narrative strings';
COMMENT ON COLUMN journey_nodes_cache.pathways IS 'JSONB object with pathway arrays (influences, legacy, collaborators, etc.)';
```

**Apply migration:**

Create `/api/migrate.js`:

```javascript
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Migrations must be run manually in production' });
  }

  try {
    const migrationSQL = fs.readFileSync(
      path.join(process.cwd(), 'sql/migrations/001_initial_schema.sql'),
      'utf8'
    );

    await sql.query(migrationSQL);

    res.status(200).json({
      success: true,
      message: 'Schema created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

Run migration:
```bash
curl http://localhost:3000/api/migrate
```

**Verify schema:**

Create `/api/verify-schema.js`:

```javascript
import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  try {
    // Check tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('journeys', 'journey_nodes_cache')
    `;

    // Check indexes exist
    const indexes = await sql`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename IN ('journeys', 'journey_nodes_cache')
    `;

    res.status(200).json({
      success: true,
      tables: tables.rows.map(r => r.table_name),
      indexes: indexes.rows.map(r => r.indexname)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

Test: `curl http://localhost:3000/api/verify-schema`

Expected output:
```json
{
  "success": true,
  "tables": ["journeys", "journey_nodes_cache"],
  "indexes": [
    "journeys_pkey",
    "journey_nodes_cache_pkey",
    "idx_journeys_user",
    "idx_journeys_share",
    "idx_cache_node",
    ...
  ]
}
```

**Acceptance Criteria:**
- [ ] Migration SQL file created
- [ ] Migration endpoint works
- [ ] Both tables created
- [ ] All indexes created
- [ ] Verify endpoint confirms schema
- [ ] JSONB columns accept test data

---

### Day 3: Integration Testing & Documentation (3-4 hours)

#### Task 3.1: End-to-End Infrastructure Test (1 hour)

Create `/api/test/infrastructure.js`:

```javascript
import { sql } from '@vercel/postgres';
import { kv } from '@vercel/kv';
import { aiClient } from '../../src/api/ai-client';

export default async function handler(req, res) {
  const results = {
    database: { status: 'pending', details: null },
    cache: { status: 'pending', details: null },
    ai: { status: 'pending', details: null }
  };

  // Test 1: Database write/read
  try {
    const testId = crypto.randomUUID();
    await sql`
      INSERT INTO journeys (user_id, title, starting_node_type, starting_node_id, starting_node_name)
      VALUES (${testId}, 'Test Journey', 'artist', 'test123', 'Test Artist')
    `;

    const result = await sql`SELECT * FROM journeys WHERE user_id = ${testId}`;

    await sql`DELETE FROM journeys WHERE user_id = ${testId}`;

    results.database = {
      status: 'success',
      details: 'Write and read successful'
    };
  } catch (error) {
    results.database = {
      status: 'error',
      details: error.message
    };
  }

  // Test 2: KV cache write/read
  try {
    const testKey = `test_${Date.now()}`;
    await kv.set(testKey, { test: 'data', timestamp: Date.now() }, { ex: 60 });
    const value = await kv.get(testKey);
    await kv.del(testKey);

    results.cache = {
      status: 'success',
      details: 'Write and read successful'
    };
  } catch (error) {
    results.cache = {
      status: 'error',
      details: error.message
    };
  }

  // Test 3: AI completion
  try {
    const response = await aiClient.complete({
      systemPrompt: 'You are a test assistant.',
      userPrompt: 'Respond with exactly: "AI test successful"',
      maxTokens: 50
    });

    results.ai = {
      status: response.includes('AI test successful') ? 'success' : 'warning',
      details: response.substring(0, 100)
    };
  } catch (error) {
    results.ai = {
      status: 'error',
      details: error.message
    };
  }

  const allSuccess = Object.values(results).every(r => r.status === 'success');

  res.status(allSuccess ? 200 : 500).json({
    success: allSuccess,
    results
  });
}
```

Test: `curl http://localhost:3000/api/test/infrastructure`

**Acceptance Criteria:**
- [ ] Database test passes
- [ ] Cache test passes
- [ ] AI test passes
- [ ] All infrastructure components working

---

#### Task 3.2: Create docs/reference/ARCHITECTURE.md (1 hour)

Document the infrastructure setup for future reference (see template in next section).

**Acceptance Criteria:**
- [ ] ARCHITECTURE.md created
- [ ] All components documented
- [ ] Diagrams or ASCII art for clarity
- [ ] Reference links included

---

#### Task 3.3: Create docs/reference/DATABASE-SCHEMA.md (1 hour)

Document the database schema with ERD and explanations (see template in next section).

**Acceptance Criteria:**
- [ ] DATABASE-SCHEMA.md created
- [ ] Tables documented with column descriptions
- [ ] Relationships explained
- [ ] Example queries provided

---

## Acceptance Criteria

**Phase 0 is complete when:**

- [ ] Anthropic API key obtained and tested
- [ ] Environment variables configured (local + Vercel)
- [ ] All dependencies installed without errors
- [ ] AI client created and tested
- [ ] Feature flag system implemented and tested
- [ ] Vercel Postgres database created and connected
- [ ] Vercel KV store created and connected
- [ ] Database schema migrated successfully
- [ ] All indexes created
- [ ] Infrastructure test endpoint passes all checks
- [ ] Reference documentation created (ARCHITECTURE.md, DATABASE-SCHEMA.md)
- [ ] No sensitive data committed to git

---

## Reference Documentation

- [IMPLEMENTATION-PLAN.md](../../MUSICAL_JOURNEY_IMPLEMENTATION_PLAN.md) - Full project plan
- [EXECUTION-PLAN.md](./EXECUTION-PLAN.md) - Detailed daily task breakdown
- [TESTING.md](./TESTING.md) - Manual test procedures
- [PROGRESS.md](./PROGRESS.md) - Track your progress here
- [CLAUDE.md](../../CLAUDE.md) - All Ears codebase guide
- [Anthropic API Docs](https://docs.anthropic.com/claude/reference/messages_post)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)

---

## Important Reminders

1. **Security First**: Never commit API keys or database credentials
2. **Test Everything**: Run all test endpoints before marking tasks complete
3. **Document Decisions**: Update ARCHITECTURE.md if you deviate from plan
4. **Feature Flags**: Keep journey feature disabled until Phase 2 UI is ready
5. **Error Handling**: All API clients must have retry logic and proper error messages
6. **Caching**: Set appropriate TTLs for KV cache (24 hours for pathways)

---

## Next Phase

**Phase 0.5: Design System Documentation & Extension** - Audit All Ears design system and document journey-specific components before any UI implementation begins.
