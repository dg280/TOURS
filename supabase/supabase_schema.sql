-- 1. Create tables first (idempotent)
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    tour_id TEXT NOT NULL,
    tour_name TEXT NOT NULL,
    date DATE NOT NULL,
    participants INTEGER NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    message TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    tour_id TEXT,
    is_published BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    title_en TEXT,
    title_es TEXT,
    subtitle TEXT NOT NULL,
    subtitle_en TEXT,
    subtitle_es TEXT,
    description TEXT NOT NULL,
    description_en TEXT,
    description_es TEXT,
    duration TEXT NOT NULL,
    group_size TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    highlights TEXT[] NOT NULL,
    highlights_en TEXT[],
    highlights_es TEXT[],
    included TEXT[] NOT NULL DEFAULT '{}',
    included_en TEXT[],
    included_es TEXT[],
    not_included TEXT[] NOT NULL DEFAULT '{}',
    not_included_en TEXT[],
    not_included_es TEXT[],
    itinerary TEXT[] NOT NULL DEFAULT '{}',
    itinerary_en TEXT[],
    itinerary_es TEXT[],
    meeting_point TEXT,
    meeting_point_en TEXT,
    meeting_point_es TEXT,
    meeting_point_map_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_link TEXT
);

CREATE TABLE IF NOT EXISTS default_tours (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    title_en TEXT,
    title_es TEXT,
    subtitle TEXT NOT NULL,
    subtitle_en TEXT,
    subtitle_es TEXT,
    description TEXT NOT NULL,
    description_en TEXT,
    description_es TEXT,
    duration TEXT NOT NULL,
    group_size TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    highlights TEXT[] NOT NULL,
    highlights_en TEXT[],
    highlights_es TEXT[],
    included TEXT[] NOT NULL DEFAULT '{}',
    included_en TEXT[],
    included_es TEXT[],
    not_included TEXT[] NOT NULL DEFAULT '{}',
    not_included_en TEXT[],
    not_included_es TEXT[],
    itinerary TEXT[] NOT NULL DEFAULT '{}',
    itinerary_en TEXT[],
    itinerary_es TEXT[],
    meeting_point TEXT,
    meeting_point_en TEXT,
    meeting_point_es TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_link TEXT
);

CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS authorized_admins (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed initial authorized admins
INSERT INTO authorized_admins (email) 
VALUES ('info@toursandetours.com'), ('dg@xinus.net')
ON CONFLICT (email) DO NOTHING;

-- 2. Clean up existing policies safely
DROP POLICY IF EXISTS "Public Insert" ON reservations;
DROP POLICY IF EXISTS "Public Select" ON reservations;
DROP POLICY IF EXISTS "Public Update" ON reservations;
DROP POLICY IF EXISTS "Public Select" ON reviews;
DROP POLICY IF EXISTS "Public Insert" ON reviews;
DROP POLICY IF EXISTS "Public Select Tours" ON tours;
DROP POLICY IF EXISTS "Public Insert Tours" ON tours;
DROP POLICY IF EXISTS "Public Update Tours" ON tours;
DROP POLICY IF EXISTS "Public Delete Tours" ON tours;
DROP POLICY IF EXISTS "Public Select Config" ON site_config;
DROP POLICY IF EXISTS "Public Update Config" ON site_config;
DROP POLICY IF EXISTS "Public Insert Config" ON site_config;
DROP POLICY IF EXISTS "Public Delete Config" ON site_config;
DROP POLICY IF EXISTS "Public Select Default Tours" ON default_tours;
DROP POLICY IF EXISTS "Public Insert Default Tours" ON default_tours;
DROP POLICY IF EXISTS "Public Update Default Tours" ON default_tours;
DROP POLICY IF EXISTS "Public Delete Default Tours" ON default_tours;

-- 3. Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE default_tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE authorized_admins ENABLE ROW LEVEL SECURITY;

-- 4. Create policies

-- RESERVATIONS: Anyone can insert (book), but only ADMIN (authenticated) can see/edit
CREATE POLICY "Public Insert Reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Select Reservations" ON reservations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin Update Reservations" ON reservations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Reservations" ON reservations FOR DELETE TO authenticated USING (true);

-- REVIEWS: Anyone can insert, public can only see PUBLISHED reviews, admin sees all
CREATE POLICY "Public Select Reviews" ON reviews FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');
CREATE POLICY "Public Insert Reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Update Reviews" ON reviews FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Reviews" ON reviews FOR DELETE TO authenticated USING (true);

-- TOURS: Public select, admin edit
CREATE POLICY "Public Select Tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Admin All Tours" ON tours FOR ALL TO authenticated USING (true);

-- SITE CONFIG: Admin edit, public select (only non-sensitive keys)
CREATE POLICY "Public Select Config" ON site_config FOR SELECT USING (key IN ('main_config', 'guide_profile'));
CREATE POLICY "Admin All Config" ON site_config FOR ALL TO authenticated USING (true);

-- DEFAULT TOURS: Admin only
CREATE POLICY "Public Select Default Tours" ON default_tours FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin All Default Tours" ON default_tours FOR ALL TO authenticated USING (true);

-- AUTHORIZED ADMINS: Admin only (to manage the list)
CREATE POLICY "Admin All Authorized Admins" ON authorized_admins FOR ALL TO authenticated USING (true);
CREATE POLICY "Public Select Authorized Admins" ON authorized_admins FOR SELECT USING (true); -- Needed for login check before auth
