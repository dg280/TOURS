-- Migration: Fix Missing Columns and Storage Bucket
-- Description: Adds all missing localized fields, itinerary, inclusions/exclusions, and meeting point details to the tours tables. Also creates the tour_images bucket.

-- 1. Update tours table with missing columns
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS subtitle_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS highlights_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS highlights_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS itinerary TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS itinerary_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS itinerary_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS included TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS included_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS included_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS not_included TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS not_included_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS not_included_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS meeting_point TEXT,
ADD COLUMN IF NOT EXISTS meeting_point_en TEXT,
ADD COLUMN IF NOT EXISTS meeting_point_es TEXT,
ADD COLUMN IF NOT EXISTS meeting_point_map_url TEXT;

-- 2. Update default_tours table for consistency
ALTER TABLE default_tours 
ADD COLUMN IF NOT EXISTS title_en TEXT,
ADD COLUMN IF NOT EXISTS title_es TEXT,
ADD COLUMN IF NOT EXISTS subtitle_en TEXT,
ADD COLUMN IF NOT EXISTS subtitle_es TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS description_es TEXT,
ADD COLUMN IF NOT EXISTS highlights_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS highlights_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS itinerary TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS itinerary_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS itinerary_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS included TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS included_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS included_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS not_included TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS not_included_en TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS not_included_es TEXT[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS meeting_point TEXT,
ADD COLUMN IF NOT EXISTS meeting_point_en TEXT,
ADD COLUMN IF NOT EXISTS meeting_point_es TEXT,
ADD COLUMN IF NOT EXISTS meeting_point_map_url TEXT;

-- 3. Create Storage Bucket: tour_images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tour_images', 'tour_images', true) 
ON CONFLICT (id) DO NOTHING;

-- 4. Set up Storage Policies for tour_images
-- Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tour_images');

-- Allow authenticated upload/update/delete (Admin)
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tour_images');
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'tour_images');
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'tour_images');
