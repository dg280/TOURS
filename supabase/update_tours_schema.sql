-- Migration to add detailed tour fields
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS itinerary TEXT[],
ADD COLUMN IF NOT EXISTS included TEXT[],
ADD COLUMN IF NOT EXISTS not_included TEXT[],
ADD COLUMN IF NOT EXISTS meeting_point TEXT;
