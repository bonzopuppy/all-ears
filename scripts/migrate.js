/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { sql } = require('@vercel/postgres');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'db', 'migrations');

async function run() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`[migrate] found ${files.length} migration(s)`);

  for (const file of files) {
    const fullPath = path.join(MIGRATIONS_DIR, file);
    const sqlText = fs.readFileSync(fullPath, 'utf8');

    console.log(`[migrate] running ${file}...`);
    // NOTE: @vercel/postgres `sql` is a tagged template; passing a full SQL string
    // via interpolation executes as a single query.
    await sql`${sqlText}`;
  }

  console.log('[migrate] done');
}

run().catch((e) => {
  console.error('[migrate] error', e);
  process.exit(1);
});
