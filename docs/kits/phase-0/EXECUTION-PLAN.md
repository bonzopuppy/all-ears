# PHASE 0: EXECUTION PLAN
**Prerequisites & Setup**

**Duration:** 3 days (12-16 hours total)
**Phase:** 0 (Foundation)
**Status:** 🟡 Not Started

---

## Prerequisites Checklist

Before beginning this phase:

- [ ] Vercel project exists and is accessible
- [ ] Can run `npm run dev` successfully in All Ears
- [ ] Have permission to create Anthropic account (or access to existing)
- [ ] Familiar with All Ears codebase (`CLAUDE.md` reviewed)
- [ ] Git repo is clean (no uncommitted changes)
- [ ] Have Vercel CLI installed (`npm i -g vercel`)

---

## Day 1: API Keys & AI Client (4-5 hours)

### Task 1.1: Create Anthropic Account & API Key (30 min)

**Steps:**
1. Navigate to https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create new key: "All Ears - Musical Journey - Development"
5. Copy and save API key securely

**Acceptance Criteria:**
- [ ] Account created successfully
- [ ] API key generated (starts with `sk-ant-api03-`)
- [ ] API key saved in password manager or secure location
- [ ] Test curl request successful (see PROMPT.md for command)

**Testing:**
```bash
# Test API key
curl https://api.anthropic.com/v1/messages \
  --header "x-api-key: YOUR_KEY" \
  --header "anthropic-version: 2023-06-01" \
  --header "content-type: application/json" \
  --data '{"model":"claude-sonnet-4-20250514","max_tokens":50,"messages":[{"role":"user","content":"Hello"}]}'
```

Expected: JSON response with Claude message

---

### Task 1.2: Configure Environment Variables (15 min)

**Steps:**
1. Open `.env` file in project root
2. Add `ANTHROPIC_API_KEY=your_key_here`
3. Add `REACT_APP_FEATURE_JOURNEY_ENABLED=false`
4. Add empty database variable placeholders (see PROMPT.md)
5. Verify `.env` is in `.gitignore`
6. Run `vercel env add ANTHROPIC_API_KEY` (add to Vercel)
7. Run `vercel env add REACT_APP_FEATURE_JOURNEY_ENABLED` (set to `false`)

**Acceptance Criteria:**
- [ ] `.env` file contains all variables from PROMPT.md
- [ ] `.env` is NOT tracked by git (`git status` doesn't show it)
- [ ] Vercel environment variables configured
- [ ] Can restart dev server without errors

**Verification:**
```bash
# Check .env is gitignored
git status | grep .env
# Should return nothing

# Check Vercel env vars
vercel env ls
# Should show ANTHROPIC_API_KEY and REACT_APP_FEATURE_JOURNEY_ENABLED
```

---

### Task 1.3: Install npm Dependencies (15 min)

**Steps:**
1. Run installation command from PROMPT.md
2. Verify all packages installed
3. Check for peer dependency warnings
4. Commit `package.json` and `package-lock.json`

**Acceptance Criteria:**
- [ ] All 5 packages installed: @anthropic-ai/sdk, reactflow, @vercel/postgres, @vercel/kv, framer-motion
- [ ] No installation errors
- [ ] `npm list` shows all packages
- [ ] No critical peer dependency warnings

**Testing:**
```bash
# Verify installations
npm list @anthropic-ai/sdk reactflow @vercel/postgres @vercel/kv framer-motion

# Check for vulnerabilities
npm audit

# If server running, restart it
npm run dev
```

---

### Task 1.4: Create AI Client (2 hours)

**Steps:**
1. Create `/src/api/ai-client.js` (copy from PROMPT.md)
2. Implement AIClient class with singleton pattern
3. Add `initialize()` method
4. Add `complete()` method with retry logic
5. Add `parseJSON()` helper method
6. Create test file `/src/api/__tests__/ai-client.test.js`
7. Run tests

**Acceptance Criteria:**
- [ ] `ai-client.js` file created
- [ ] AIClient class exported as singleton
- [ ] Initialize method checks for API key
- [ ] Complete method handles retries (exponential backoff)
- [ ] Retry logic works for 429 and 500+ errors
- [ ] JSON parser handles markdown code blocks
- [ ] Test file created with 3+ tests
- [ ] All tests pass (`npm test -- ai-client.test.js`)

**Testing:**
```bash
# Run tests
npm test -- ai-client.test.js

# Manual test (create temp test file)
node -e "
const { aiClient } = require('./src/api/ai-client');
aiClient.complete({
  systemPrompt: 'You are a helpful assistant.',
  userPrompt: 'Say hello',
  maxTokens: 50
}).then(console.log);
"
```

Expected: AI response printed

---

### Task 1.5: Create Feature Flag System (30 min)

**Steps:**
1. Create `/src/utils/featureFlags.js` (copy from PROMPT.md)
2. Implement `FEATURES` constant
3. Implement `isFeatureEnabled()` function
4. Implement `withFeatureFlag()` HOC
5. Create test file `/src/utils/__tests__/featureFlags.test.js`
6. Run tests

**Acceptance Criteria:**
- [ ] `featureFlags.js` file created
- [ ] `FEATURES.JOURNEY` constant exists
- [ ] `isFeatureEnabled(FEATURES.JOURNEY)` returns boolean
- [ ] `withFeatureFlag()` HOC conditionally renders component
- [ ] Test file created
- [ ] All tests pass

**Testing:**
```bash
# Run tests
npm test -- featureFlags.test.js

# Manual test
node -e "
process.env.REACT_APP_FEATURE_JOURNEY_ENABLED='true';
const { isFeatureEnabled, FEATURES } = require('./src/utils/featureFlags');
console.log('Journey enabled:', isFeatureEnabled(FEATURES.JOURNEY));
"
```

Expected: "Journey enabled: true"

---

### Day 1 Subtotal: 5 tasks, 4-5 hours
**Exit Criteria:** AI client working, feature flags implemented, all tests passing

---

## Day 2: Database Setup (4-5 hours)

### Task 2.1: Create Vercel Postgres Database (30 min)

**Steps:**
1. Run `vercel link` (if not linked)
2. Run `vercel postgres create`
3. Name: `all-ears-journeys`
4. Choose region (closest to users)
5. Run `vercel env pull .env` to get database URLs
6. Create `/api/db-test.js` (copy from PROMPT.md)
7. Test connection

**Acceptance Criteria:**
- [ ] Vercel Postgres database created
- [ ] Database visible in Vercel dashboard
- [ ] `.env` contains POSTGRES_URL and related vars
- [ ] Test endpoint created
- [ ] Test endpoint returns current timestamp
- [ ] No connection errors

**Testing:**
```bash
# Pull env vars
vercel env pull .env

# Check vars populated
cat .env | grep POSTGRES

# Start dev server
npm run dev

# Test endpoint
curl http://localhost:3000/api/db-test
```

Expected: `{"success":true,"time":"2025-11-04T..."}`

---

### Task 2.2: Create Vercel KV Store (30 min)

**Steps:**
1. Run `vercel kv create`
2. Name: `all-ears-journey-cache`
3. Choose same region as Postgres
4. Run `vercel env pull .env`
5. Create `/api/kv-test.js` (copy from PROMPT.md)
6. Test KV operations

**Acceptance Criteria:**
- [ ] Vercel KV store created
- [ ] KV visible in Vercel dashboard
- [ ] `.env` contains KV_URL and related vars
- [ ] Test endpoint created
- [ ] Test endpoint can write and read
- [ ] No connection errors

**Testing:**
```bash
# Pull env vars
vercel env pull .env

# Check vars populated
cat .env | grep KV

# Test endpoint
curl http://localhost:3000/api/kv-test
```

Expected: `{"success":true,"value":{"timestamp":...}}`

---

### Task 2.3: Create Database Schema (2 hours)

**Steps:**
1. Create directory: `mkdir -p sql/migrations`
2. Create `/sql/migrations/001_initial_schema.sql` (copy from PROMPT.md)
3. Review schema: 2 tables, 5 indexes, comments
4. Create `/api/migrate.js` (copy from PROMPT.md)
5. Run migration endpoint
6. Create `/api/verify-schema.js` (copy from PROMPT.md)
7. Verify tables and indexes exist

**Acceptance Criteria:**
- [ ] Migration SQL file created with complete schema
- [ ] Migration includes: journeys table, journey_nodes_cache table
- [ ] All 5 indexes defined
- [ ] Table and column comments added
- [ ] Migration endpoint created
- [ ] Migration runs successfully
- [ ] Verify endpoint confirms all tables exist
- [ ] Verify endpoint confirms all indexes exist
- [ ] JSONB columns accept test data

**Testing:**
```bash
# Run migration
curl http://localhost:3000/api/migrate

# Verify schema
curl http://localhost:3000/api/verify-schema

# Manual verification
vercel postgres connect all-ears-journeys
# Then in psql:
\dt    # List tables
\d journeys
\d journey_nodes_cache
\di    # List indexes
```

Expected tables: `journeys`, `journey_nodes_cache`
Expected indexes: 5 total (pkey for each table + 3 custom indexes)

---

### Task 2.4: Test Database Operations (1 hour)

**Steps:**
1. Create test data insertion
2. Test JSONB column operations
3. Test querying with indexes
4. Test cache expiry logic
5. Clean up test data

**Acceptance Criteria:**
- [ ] Can insert journey with JSONB data
- [ ] Can query journeys by user_id (uses index)
- [ ] Can query journeys by share_token (uses index)
- [ ] Can insert and query cache entries
- [ ] Can filter cache by expiry (uses index)
- [ ] All test data cleaned up

**Testing:**
```sql
-- Test in psql
-- Insert test journey
INSERT INTO journeys (user_id, title, starting_node_type, starting_node_id, starting_node_name, nodes_visited)
VALUES ('test_user', 'Test Journey', 'artist', 'spotify:artist:123', 'Test Artist', '[{"type":"artist","id":"123","name":"Test"}]'::jsonb);

-- Query by user_id (should use index)
EXPLAIN ANALYZE SELECT * FROM journeys WHERE user_id = 'test_user';

-- Insert cache entry
INSERT INTO journey_nodes_cache (node_type, node_id, pathways, cache_expires_at)
VALUES ('artist', '123', '{"influences":[]}'::jsonb, NOW() + INTERVAL '24 hours');

-- Clean up
DELETE FROM journeys WHERE user_id = 'test_user';
DELETE FROM journey_nodes_cache WHERE node_id = '123';
```

---

### Day 2 Subtotal: 4 tasks, 4-5 hours
**Exit Criteria:** Database and cache operational, schema verified, all tests pass

---

## Day 3: Integration Testing & Documentation (3-4 hours)

### Task 3.1: Create Infrastructure Test Endpoint (1 hour)

**Steps:**
1. Create `/api/test/infrastructure.js` (copy from PROMPT.md)
2. Implement database test (write/read/delete)
3. Implement cache test (write/read/delete)
4. Implement AI test (completion request)
5. Run comprehensive test

**Acceptance Criteria:**
- [ ] Infrastructure test endpoint created
- [ ] Tests all 3 systems: DB, Cache, AI
- [ ] Database test passes (write, read, cleanup)
- [ ] Cache test passes (write, read, cleanup)
- [ ] AI test passes (generates response)
- [ ] Endpoint returns success for all tests
- [ ] No errors in logs

**Testing:**
```bash
# Run comprehensive test
curl http://localhost:3000/api/test/infrastructure

# Expected output:
# {
#   "success": true,
#   "results": {
#     "database": { "status": "success", "details": "..." },
#     "cache": { "status": "success", "details": "..." },
#     "ai": { "status": "success", "details": "..." }
#   }
# }
```

---

### Task 3.2: Document Architecture (1 hour)

**Steps:**
1. Create `/docs/reference/ARCHITECTURE.md`
2. Document system components
3. Add diagrams or ASCII art
4. Explain data flow
5. List all services and their purposes
6. Add troubleshooting section

**Acceptance Criteria:**
- [ ] ARCHITECTURE.md created in /docs/reference/
- [ ] Documents: AI client, database, cache, feature flags
- [ ] Includes system diagram
- [ ] Explains data flow for pathway generation
- [ ] Lists all environment variables
- [ ] Includes troubleshooting tips

---

### Task 3.3: Document Database Schema (1 hour)

**Steps:**
1. Create `/docs/reference/DATABASE-SCHEMA.md`
2. Document both tables with descriptions
3. Add ERD or table relationship diagram
4. Include example queries
5. Document JSONB structure
6. Add migration instructions

**Acceptance Criteria:**
- [ ] DATABASE-SCHEMA.md created in /docs/reference/
- [ ] Both tables fully documented
- [ ] Column descriptions included
- [ ] JSONB structure examples provided
- [ ] Index usage explained
- [ ] Example queries for common operations
- [ ] Migration and rollback instructions

---

### Task 3.4: Security Audit (30 min)

**Steps:**
1. Verify `.env` not in git
2. Check Vercel env vars are production-safe
3. Confirm API keys not in code
4. Review migration endpoint security
5. Test that sensitive data not logged

**Acceptance Criteria:**
- [ ] `.env` in `.gitignore` and not tracked
- [ ] No API keys in committed code
- [ ] No database credentials in committed code
- [ ] Migration endpoint disabled in production
- [ ] Test endpoints clearly marked as dev-only
- [ ] No sensitive data in console logs

**Testing:**
```bash
# Check git history for secrets
git log -p | grep -i "api.key\|secret\|password"
# Should return nothing

# Check current files
grep -r "sk-ant-api" --exclude-dir=node_modules --exclude=.env .
# Should return nothing

# Verify .gitignore
cat .gitignore | grep .env
# Should show .env
```

---

### Task 3.5: Phase 0 Completion Checklist (30 min)

**Steps:**
1. Review all acceptance criteria in PROMPT.md
2. Run all test endpoints
3. Update PROGRESS.md with completion status
4. Commit all code (no sensitive data!)
5. Update CLAUDE.md if needed

**Acceptance Criteria:**
- [ ] All 12 acceptance criteria from PROMPT.md checked
- [ ] All test endpoints return success
- [ ] PROGRESS.md marked complete
- [ ] All code committed to git
- [ ] No sensitive data committed
- [ ] Ready to begin Phase 0.5

**Final Verification:**
```bash
# Run all tests
curl http://localhost:3000/api/db-test
curl http://localhost:3000/api/kv-test
curl http://localhost:3000/api/test/infrastructure

# Check feature flag
node -e "console.log(require('./src/utils/featureFlags').isFeatureEnabled('JOURNEY'))"

# Verify no secrets in git
git diff HEAD --name-only | xargs grep -l "sk-ant-\|POSTGRES_URL\|KV_URL" || echo "All clear"
```

---

### Day 3 Subtotal: 5 tasks, 3-4 hours
**Exit Criteria:** All infrastructure tested, documented, secured, ready for Phase 0.5

---

## Time Breakdown

| Day | Tasks | Estimated Time |
|-----|-------|----------------|
| Day 1 | API Keys & AI Client (5 tasks) | 4-5 hours |
| Day 2 | Database Setup (4 tasks) | 4-5 hours |
| Day 3 | Integration & Docs (5 tasks) | 3-4 hours |
| **Total** | **14 tasks** | **12-16 hours** |

---

## Dependencies for Next Phase

**Phase 0.5 requires:**
- ✅ Feature flag system (to gate journey routes)
- ✅ AI client (may use for design system validation)
- ✅ Database schema (to understand data requirements for UI)

**Phase 1 requires:**
- ✅ AI client operational
- ✅ Database schema created
- ✅ KV cache operational
- ✅ All environment variables configured

---

## Troubleshooting

**Issue: API key not found**
- Check `.env` file exists and has `ANTHROPIC_API_KEY`
- Restart dev server after adding env vars
- Verify Vercel env vars: `vercel env ls`

**Issue: Database connection fails**
- Run `vercel env pull .env` to refresh credentials
- Check database exists in Vercel dashboard
- Verify correct region selected

**Issue: Tests failing**
- Check all dependencies installed: `npm install`
- Verify API key is valid (test with curl)
- Check database migrations ran: `curl /api/verify-schema`

**Issue: Migration fails**
- Check if tables already exist (may need to drop manually)
- Verify SQL syntax in migration file
- Check Postgres version compatibility

---

## Reference Links

- [Phase 0 PROMPT.md](./PROMPT.md) - Master implementation guide
- [Phase 0 TESTING.md](./TESTING.md) - Manual test procedures
- [Phase 0 PROGRESS.md](./PROGRESS.md) - Track your progress
- [Anthropic API Docs](https://docs.anthropic.com/claude/reference/getting-started)
- [Vercel Postgres Quickstart](https://vercel.com/docs/storage/vercel-postgres/quickstart)
- [Vercel KV Quickstart](https://vercel.com/docs/storage/vercel-kv/quickstart)
