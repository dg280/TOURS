-- Migration: Extended Features (Tiered Pricing & Multi-Category)
-- Description: Adds pricing_tiers for manual overrides and updates category to handle multiple selections.

-- 1. Add pricing_tiers column to tours and default_tours
ALTER TABLE tours 
ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '{}'::jsonb;

ALTER TABLE default_tours 
ADD COLUMN IF NOT EXISTS pricing_tiers JSONB DEFAULT '{}'::jsonb;

-- 2. Update category column to TEXT[] in tours
-- We use a safe conversion if it was previously a string
DO $$ 
BEGIN 
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'category') = 'text' THEN
        ALTER TABLE tours ALTER COLUMN category TYPE TEXT[] USING ARRAY[category];
    END IF;
END $$;

-- 3. Update category column to TEXT[] in default_tours
DO $$ 
BEGIN 
    IF (SELECT data_type FROM information_schema.columns WHERE table_name = 'default_tours' AND column_name = 'category') = 'text' THEN
        ALTER TABLE default_tours ALTER COLUMN category TYPE TEXT[] USING ARRAY[category];
    END IF;
END $$;

-- 4. Ensure reviews table exists and has is_published column
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    location TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Set up RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON reviews FOR SELECT USING (is_published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Admin Management') THEN
        CREATE POLICY "Admin Management" ON reviews FOR ALL TO authenticated USING (true);
    END IF;
END $$;
