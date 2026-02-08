import { sql } from '@vercel/postgres';

/**
 * Lightweight db wrapper.
 *
 * Vercel Postgres provides the connection via POSTGRES_URL / POSTGRES_PRISMA_URL
 * and friends. In local dev you can point POSTGRES_URL to your db.
 */
export { sql };
