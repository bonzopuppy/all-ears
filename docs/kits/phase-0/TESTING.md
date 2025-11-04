# PHASE 0: TESTING PROCEDURES
**Prerequisites & Setup - Manual Test Plan**

**Phase:** 0 (Foundation)
**Test Duration:** 30-40 minutes
**Prerequisites:** Phase 0 implementation complete

---

## Test Environment Setup

Before running tests:

- [ ] Dev server running (`npm run dev`)
- [ ] `.env` file contains all required variables
- [ ] Vercel CLI installed and authenticated
- [ ] Can access `http://localhost:3000`

---

## Test Suite 1: Environment & Configuration (5 min)

### Test 1.1: Environment Variables Present

**Prerequisites:** None

**Steps:**
1. Run: `cat .env | grep -E "ANTHROPIC|JOURNEY|POSTGRES|KV"`
2. Count variables present

**Expected Results:**
- [ ] `ANTHROPIC_API_KEY` present (starts with `sk-ant-api03-`)
- [ ] `REACT_APP_FEATURE_JOURNEY_ENABLED` present (value: `false`)
- [ ] `POSTGRES_URL` present and not empty
- [ ] `POSTGRES_PRISMA_URL` present and not empty
- [ ] `KV_URL` present and not empty
- [ ] At least 8 environment variables total

**Verification:**
```bash
# Count environment variables
cat .env | wc -l
# Should be 8 or more
```

**Success Criteria:** All required environment variables present with valid values

---

### Test 1.2: Git Security Check

**Prerequisites:** None

**Steps:**
1. Run: `git status`
2. Check if `.env` appears in output
3. Run: `cat .gitignore | grep .env`
4. Search committed code: `git grep "sk-ant-api"`

**Expected Results:**
- [ ] `.env` does NOT appear in `git status`
- [ ] `.gitignore` contains `.env` entry
- [ ] Git grep returns no matches for API keys
- [ ] No database URLs in committed code

**Verification:**
```bash
# Check .gitignore
cat .gitignore | grep -E "^\.env$|^\.env\.local$"

# Search for secrets in git history
git log -p | grep -i "sk-ant\|postgres://\|redis://" | wc -l
# Should return 0
```

**Success Criteria:** No sensitive data committed to git

---

### Test 1.3: Dependencies Installed

**Prerequisites:** None

**Steps:**
1. Run: `npm list --depth=0`
2. Check for required packages

**Expected Results:**
- [ ] `@anthropic-ai/sdk` present
- [ ] `reactflow` present
- [ ] `@vercel/postgres` present
- [ ] `@vercel/kv` present
- [ ] `framer-motion` present
- [ ] No missing peer dependency errors
- [ ] No `UNMET DEPENDENCY` warnings

**Success Criteria:** All 5 new packages installed correctly

---

## Test Suite 2: AI Client Functionality (10 min)

### Test 2.1: AI Client Initialization

**Prerequisites:** Dev server running

**Steps:**
1. Open Node REPL: `node`
2. Import client: `const { aiClient } = require('./src/api/ai-client.js')`
3. Initialize: `aiClient.initialize()`
4. Check: `aiClient.isInitialized`

**Expected Results:**
- [ ] No errors during import
- [ ] Initialize succeeds without errors
- [ ] `isInitialized` property is `true`
- [ ] Console shows "[AIClient] Initialized successfully"

**Success Criteria:** AI client initializes without errors

---

### Test 2.2: AI Completion Request

**Prerequisites:** AI client initialized

**Steps:**
1. Create test script: `test-ai.js`
```javascript
const { aiClient } = require('./src/api/ai-client.js');

async function test() {
  const response = await aiClient.complete({
    systemPrompt: 'You are a helpful assistant.',
    userPrompt: 'Respond with exactly: "Test successful"',
    maxTokens: 50
  });
  console.log('Response:', response);
}

test().catch(console.error);
```
2. Run: `node test-ai.js`
3. Wait for response (should be <5 seconds)

**Expected Results:**
- [ ] Request completes within 10 seconds
- [ ] Response contains "Test successful"
- [ ] No error messages
- [ ] Console shows "[AIClient] Generating completion..."
- [ ] Console shows completion character count

**Verification:**
```bash
# Run test
node test-ai.js

# Check response length
node test-ai.js | wc -c
# Should be > 0
```

**Success Criteria:** AI generates valid response within acceptable time

---

### Test 2.3: AI Retry Logic

**Prerequisites:** AI client functional

**Steps:**
1. Temporarily use invalid API key in `.env`
2. Run test from 2.2
3. Observe retry attempts
4. Restore valid API key
5. Run test again

**Expected Results:**
- [ ] With invalid key: Shows "[AIClient] Error on attempt 1"
- [ ] Shows retry message with delay
- [ ] Attempts up to 3 times total
- [ ] After 3 attempts, throws error
- [ ] With valid key: Works normally

**Success Criteria:** Retry logic functions correctly with exponential backoff

---

### Test 2.4: JSON Parsing

**Prerequisites:** None

**Steps:**
1. Open Node REPL
2. Import: `const { aiClient } = require('./src/api/ai-client.js')`
3. Test with markdown:
```javascript
const jsonWithMarkdown = '```json\n{"test": "value"}\n```';
const parsed = aiClient.parseJSON(jsonWithMarkdown);
console.log(parsed);
```
4. Test without markdown:
```javascript
const plainJSON = '{"test": "value"}';
const parsed2 = aiClient.parseJSON(plainJSON);
console.log(parsed2);
```

**Expected Results:**
- [ ] Markdown code blocks removed correctly
- [ ] Both parse successfully
- [ ] Return objects are identical: `{test: "value"}`
- [ ] Invalid JSON throws error with helpful message

**Success Criteria:** JSON parser handles markdown code blocks

---

## Test Suite 3: Database Operations (10 min)

### Test 3.1: Database Connection

**Prerequisites:** Dev server running, database created

**Steps:**
1. Open browser
2. Navigate to: `http://localhost:3000/api/db-test`
3. Check JSON response

**Expected Results:**
- [ ] HTTP 200 status
- [ ] Response contains `"success": true`
- [ ] Response contains `"time"` field with timestamp
- [ ] Timestamp is current (within 1 minute)
- [ ] No error messages in server logs

**Verification:**
```bash
curl http://localhost:3000/api/db-test | jq .
```

**Success Criteria:** Database connection works and returns current time

---

### Test 3.2: Schema Verification

**Prerequisites:** Migration ran successfully

**Steps:**
1. Navigate to: `http://localhost:3000/api/verify-schema`
2. Check tables array
3. Check indexes array

**Expected Results:**
- [ ] HTTP 200 status
- [ ] Response contains `"success": true`
- [ ] `tables` array contains: `["journeys", "journey_nodes_cache"]`
- [ ] `indexes` array contains at least 7 items (2 primary keys + 5 custom)
- [ ] Indexes include: `idx_journeys_user`, `idx_journeys_share`, `idx_cache_node`, `idx_journeys_created`, `idx_cache_expires`

**Verification:**
```bash
curl http://localhost:3000/api/verify-schema | jq '.tables, .indexes'
```

**Success Criteria:** All tables and indexes exist

---

### Test 3.3: Journey Table Operations

**Prerequisites:** Schema verified

**Steps:**
1. Connect to database: `vercel postgres connect all-ears-journeys`
2. Insert test data:
```sql
INSERT INTO journeys (
  user_id, title, starting_node_type, starting_node_id, starting_node_name,
  nodes_visited, tracks, narratives
) VALUES (
  'test_user_123',
  'Test Journey',
  'artist',
  'spotify:artist:test',
  'Test Artist',
  '[{"type":"artist","id":"test","name":"Test Artist"}]'::jsonb,
  '[{"id":"track1","name":"Track 1"}]'::jsonb,
  '["Test narrative"]'::jsonb
);
```
3. Query: `SELECT * FROM journeys WHERE user_id = 'test_user_123';`
4. Update: `UPDATE journeys SET title = 'Updated Title' WHERE user_id = 'test_user_123';`
5. Query again to verify update
6. Delete: `DELETE FROM journeys WHERE user_id = 'test_user_123';`

**Expected Results:**
- [ ] INSERT succeeds
- [ ] SELECT returns 1 row with correct data
- [ ] JSONB columns contain valid JSON
- [ ] UPDATE succeeds and changes title
- [ ] DELETE succeeds and removes row
- [ ] Final SELECT returns 0 rows

**Success Criteria:** All CRUD operations work on journeys table

---

### Test 3.4: Cache Table Operations

**Prerequisites:** Schema verified

**Steps:**
1. In psql, insert cache entry:
```sql
INSERT INTO journey_nodes_cache (
  node_type, node_id, pathways, cache_expires_at
) VALUES (
  'artist',
  'test123',
  '{"influences":[],"legacy":[]}'::jsonb,
  NOW() + INTERVAL '24 hours'
);
```
2. Query: `SELECT * FROM journey_nodes_cache WHERE node_id = 'test123';`
3. Test expiry filter:
```sql
SELECT * FROM journey_nodes_cache
WHERE cache_expires_at > NOW()
AND node_id = 'test123';
```
4. Delete: `DELETE FROM journey_nodes_cache WHERE node_id = 'test123';`

**Expected Results:**
- [ ] INSERT succeeds with JSONB pathways
- [ ] SELECT returns cache entry
- [ ] Expiry filter returns entry (not expired)
- [ ] DELETE succeeds

**Success Criteria:** Cache table operations work correctly

---

## Test Suite 4: KV Cache Operations (5 min)

### Test 4.1: KV Connection

**Prerequisites:** KV store created, dev server running

**Steps:**
1. Navigate to: `http://localhost:3000/api/kv-test`
2. Check response

**Expected Results:**
- [ ] HTTP 200 status
- [ ] Response contains `"success": true`
- [ ] Response contains `"value"` object with timestamp
- [ ] Timestamp is current

**Verification:**
```bash
curl http://localhost:3000/api/kv-test | jq .
```

**Success Criteria:** KV store connection works

---

### Test 4.2: KV Write/Read/Delete

**Prerequisites:** KV connection working

**Steps:**
1. Open Node REPL
2. Import: `const { kv } = require('@vercel/kv')`
3. Write: `await kv.set('test_key_manual', {data: 'test', time: Date.now()})`
4. Read: `await kv.get('test_key_manual')`
5. Delete: `await kv.del('test_key_manual')`
6. Verify deleted: `await kv.get('test_key_manual')`

**Expected Results:**
- [ ] Set returns 'OK'
- [ ] Get returns object with data and time
- [ ] Delete returns 1 (key existed)
- [ ] Final get returns `null` (key deleted)

**Success Criteria:** All KV operations work

---

### Test 4.3: KV Expiry

**Prerequisites:** KV connection working

**Steps:**
1. In Node REPL:
```javascript
const { kv } = require('@vercel/kv');

// Set with 5 second expiry
await kv.set('expiry_test', {value: 'test'}, {ex: 5});

// Read immediately
console.log('Immediate:', await kv.get('expiry_test'));

// Wait 6 seconds
await new Promise(r => setTimeout(r, 6000));

// Read again
console.log('After expiry:', await kv.get('expiry_test'));
```

**Expected Results:**
- [ ] Immediate read returns data
- [ ] After 6 seconds, read returns `null`
- [ ] No errors during test

**Success Criteria:** KV TTL (expiry) works correctly

---

## Test Suite 5: Feature Flags (5 min)

### Test 5.1: Feature Flag Check

**Prerequisites:** None

**Steps:**
1. Open Node REPL
2. Import: `const { isFeatureEnabled, FEATURES } = require('./src/utils/featureFlags.js')`
3. Test when false: Check `isFeatureEnabled(FEATURES.JOURNEY)`
4. Change `.env`: Set `REACT_APP_FEATURE_JOURNEY_ENABLED=true`
5. Restart server
6. Test when true: Check `isFeatureEnabled(FEATURES.JOURNEY)`

**Expected Results:**
- [ ] With `false` in .env: Returns `false`
- [ ] With `true` in .env: Returns `true`
- [ ] Unknown feature returns `false` with console warning
- [ ] No errors thrown

**Success Criteria:** Feature flags respond to environment variable

---

### Test 5.2: Feature Flag HOC

**Prerequisites:** Feature flags working

**Steps:**
1. Create test component: `test-component.jsx`
```javascript
import React from 'react';
import { withFeatureFlag, FEATURES } from './src/utils/featureFlags';

const TestComponent = () => <div>Journey Feature Active</div>;
const GatedComponent = withFeatureFlag(FEATURES.JOURNEY)(TestComponent);

export default GatedComponent;
```
2. With flag `false`: Component should not render
3. With flag `true`: Component should render

**Expected Results:**
- [ ] With flag false: Component returns `null`
- [ ] With flag true: Component renders
- [ ] No React errors in console

**Success Criteria:** HOC correctly gates component rendering

---

## Test Suite 6: Integration Test (5 min)

### Test 6.1: Infrastructure Comprehensive Test

**Prerequisites:** All individual systems tested, dev server running

**Steps:**
1. Navigate to: `http://localhost:3000/api/test/infrastructure`
2. Wait for response (may take 10-15 seconds due to AI call)
3. Check each result status

**Expected Results:**
- [ ] HTTP 200 status
- [ ] Response contains `"success": true`
- [ ] `results.database.status` === "success"
- [ ] `results.cache.status` === "success"
- [ ] `results.ai.status` === "success"
- [ ] No error details in any result
- [ ] Response time < 20 seconds

**Verification:**
```bash
curl http://localhost:3000/api/test/infrastructure | jq '.results'

# Should show:
# {
#   "database": {"status": "success", "details": "..."},
#   "cache": {"status": "success", "details": "..."},
#   "ai": {"status": "success", "details": "..."}
# }
```

**Success Criteria:** All three infrastructure components pass integration test

---

## Regression Checks (Before Completion)

Before marking Phase 0 complete, verify:

- [ ] All Ears existing features still work (`npm run dev` → test music player, search, navigation)
- [ ] No new console errors unrelated to journey feature
- [ ] No new TypeScript/ESLint errors introduced
- [ ] Existing tests still pass: `npm test`
- [ ] Build succeeds: `npm run build`
- [ ] No increase in bundle size (check build output)
- [ ] Journey feature flag disabled (journey route not accessible)

**Commands:**
```bash
# Run existing tests
npm test

# Check build
npm run build

# Check bundle size
npm run build | grep "File sizes"
```

---

## Test Results Template

Copy this to PROGRESS.md after completing tests:

```markdown
## Testing Results

| Test Suite | Tests | Passed | Failed | Duration |
|------------|-------|--------|--------|----------|
| Environment & Configuration | 3 | X | X | X min |
| AI Client Functionality | 4 | X | X | X min |
| Database Operations | 4 | X | X | X min |
| KV Cache Operations | 3 | X | X | X min |
| Feature Flags | 2 | X | X | X min |
| Integration Test | 1 | X | X | X min |
| **Total** | **17** | **X** | **X** | **X min** |

### Failed Tests
- [ ] None (or list failed tests with reasons)

### Known Issues
- [ ] None (or list any issues found during testing)
```

---

## Cleanup

After all tests pass:

1. Remove test scripts (`test-ai.js`, `test-component.jsx`)
2. Delete test data from database
3. Clear KV test keys
4. Set feature flag back to `false` if changed
5. Commit test results to PROGRESS.md

---

## Troubleshooting Common Issues

**Issue: AI test times out**
- Check API key is valid
- Verify internet connection
- Try with smaller maxTokens (50 instead of 4096)

**Issue: Database connection fails**
- Run `vercel env pull .env` to refresh
- Check database exists in Vercel dashboard
- Restart dev server

**Issue: KV test fails**
- Check KV_URL in .env is correct
- Verify KV store exists in Vercel
- Try recreating KV store

**Issue: Feature flag doesn't change**
- Restart dev server after changing .env
- Check for typos in env variable name
- Verify process.env is being read correctly

---

## Success Criteria

**Phase 0 testing is complete when:**
- ✅ All 17 tests pass
- ✅ Integration test passes
- ✅ All regression checks pass
- ✅ No failures in test results
- ✅ Test results documented in PROGRESS.md
- ✅ Ready to begin Phase 0.5 (Design System)
