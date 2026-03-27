-- Migration: Add missing columns referenced by AdminApp save logic
-- Fixes: "Could not find the 'max_capacity' column of 'tours' in the schema cache"

-- 1. Add missing columns to tours table
ALTER TABLE tours
ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS departure_time TEXT,
ADD COLUMN IF NOT EXISTS estimated_duration TEXT,
ADD COLUMN IF NOT EXISTS good_to_know TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS good_to_know_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS good_to_know_es TEXT[] DEFAULT '{}'::text[];

-- 2. Add same columns to default_tours for consistency
ALTER TABLE default_tours
ADD COLUMN IF NOT EXISTS max_capacity INTEGER DEFAULT 8,
ADD COLUMN IF NOT EXISTS departure_time TEXT,
ADD COLUMN IF NOT EXISTS estimated_duration TEXT,
ADD COLUMN IF NOT EXISTS good_to_know TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS good_to_know_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS good_to_know_es TEXT[] DEFAULT '{}'::text[];
