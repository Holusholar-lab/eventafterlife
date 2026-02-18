-- Create categories table for managing Library and Community categories
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at BIGINT NOT NULL,
  updated_at BIGINT NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Insert default categories (matching Community discussion categories)
INSERT INTO categories (id, name, description, icon, created_at, updated_at)
VALUES 
  ('leadership', 'Leadership & Management', 'Discussions on leading teams, management...', '🎯', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, EXTRACT(EPOCH FROM NOW())::BIGINT * 1000),
  ('politics', 'Politics & Governance', 'Policy, governance, civic engagement...', '🏛️', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, EXTRACT(EPOCH FROM NOW())::BIGINT * 1000),
  ('innovation', 'Innovation & Tech', 'Technology, innovation, digital transformation...', '💡', EXTRACT(EPOCH FROM NOW())::BIGINT * 1000, EXTRACT(EPOCH FROM NOW())::BIGINT * 1000)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) - allow read for all, write for authenticated users
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

-- Policy: Only authenticated users can insert/update/delete (admin check should be done in application)
CREATE POLICY "Authenticated users can manage categories"
  ON categories FOR ALL
  USING (auth.role() = 'authenticated');
