-- Musical Journey: journey_nodes_cache table

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS journey_nodes_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_type VARCHAR(50) NOT NULL,
  node_id VARCHAR(255) NOT NULL,
  pathways JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  cache_expires_at TIMESTAMPTZ,
  UNIQUE(node_type, node_id)
);

CREATE INDEX IF NOT EXISTS idx_cache_node ON journey_nodes_cache(node_type, node_id);
