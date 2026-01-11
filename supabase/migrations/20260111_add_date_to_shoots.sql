-- Migration: Add date column to shoots table
ALTER TABLE shoots ADD COLUMN IF NOT EXISTS date TEXT;

-- Update schema cache (Supabase usually handles this, but good to note)
-- COMMENT ON COLUMN shoots.date IS 'The date the photoshoot took place (ISO string)';
