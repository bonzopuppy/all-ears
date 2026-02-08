/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@vercel/postgres');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'db', 'migrations');

async function run() {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`[migrate] found ${files.length} migration(s)`);

  const client = createClient();
  await client.connect();

  try {
    for (const file of files) {
      const fullPath = path.join(MIGRATIONS_DIR, file);
      const sqlText = fs.readFileSync(fullPath, 'utf8');

      console.log(`[migrate] running ${file}...`);
      // Use simple query protocol (allows multiple statements per file).
      await client.query(sqlText);
    }

    console.log('[migrate] done');
  } finally {
    await client.end();
  }
}

run().catch((e) => {
  console.error('[migrate] error', e);
  process.exit(1);
});
