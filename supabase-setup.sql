-- Create bouquets table
CREATE TABLE IF NOT EXISTS bouquets (
  id BIGSERIAL PRIMARY KEY,
  short_id TEXT UNIQUE NOT NULL,
  mode TEXT,
  flowers JSONB,
  letter TEXT,
  timestamp TIMESTAMPTZ,
  greenery JSONB,
  flower_order JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- If you already have a table with 'flowerOrder', rename the column
-- Uncomment the line below if you need to migrate existing data:
-- ALTER TABLE bouquets RENAME COLUMN "flowerOrder" TO flower_order;

-- Enable Row Level Security
ALTER TABLE bouquets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert and read bouquets
CREATE POLICY "Anyone can insert bouquets" ON bouquets
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read bouquets" ON bouquets
  FOR SELECT USING (true);

-- Create index on short_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_bouquets_short_id ON bouquets(short_id);
