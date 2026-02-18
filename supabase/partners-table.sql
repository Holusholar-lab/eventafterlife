-- Create partners table for managing partner companies displayed on home page
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  description TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_partners_order ON partners("order");
CREATE INDEX IF NOT EXISTS idx_partners_active ON partners(is_active);

-- Enable Row Level Security (RLS) - allow read for all, write for authenticated users
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active partners
CREATE POLICY "Partners are viewable by everyone"
  ON partners FOR SELECT
  USING (is_active = true);

-- Policy: Only authenticated users can insert/update/delete (admin check should be done in application)
CREATE POLICY "Authenticated users can manage partners"
  ON partners FOR ALL
  USING (auth.role() = 'authenticated');
