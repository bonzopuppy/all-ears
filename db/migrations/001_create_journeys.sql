-- Musical Journey: journeys table

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  starting_node_type VARCHAR(50) NOT NULL,
  starting_node_id VARCHAR(255) NOT NULL,
  starting_node_name VARCHAR(255) NOT NULL,
  nodes_visited JSONB DEFAULT '[]'::jsonb,
  tracks JSONB DEFAULT '[]'::jsonb,
  graph JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_public BOOLEAN DEFAULT false,
  share_token VARCHAR(255) UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_journeys_user ON journeys(user_id);
CREATE INDEX IF NOT EXISTS idx_journeys_share ON journeys(share_token);

-- updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_journeys_updated_at ON journeys;
CREATE TRIGGER trg_journeys_updated_at
BEFORE UPDATE ON journeys
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
