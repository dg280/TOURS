-- Create reservations table
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

-- Create reviews table
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

-- Enable RLS (Optional, for public access assuming anon key usage)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Simple public policies (adjust for production)
CREATE POLICY "Public Insert" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Select" ON reservations FOR SELECT USING (true);
CREATE POLICY "Public Update" ON reservations FOR UPDATE USING (true);

CREATE POLICY "Public Select" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON reviews FOR INSERT WITH CHECK (true);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    group_size TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    highlights TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_link TEXT
);

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Select Tours" ON tours FOR SELECT USING (true);
CREATE POLICY "Public Insert Tours" ON tours FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Tours" ON tours FOR UPDATE USING (true);
CREATE POLICY "Public Delete Tours" ON tours FOR DELETE USING (true);
-- Create site_config table for global settings
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_config ENABLE RLS;
CREATE POLICY "Public Select Config" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public Update Config" ON site_config FOR UPDATE USING (true);
CREATE POLICY "Public Insert Config" ON site_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Config" ON site_config FOR DELETE USING (true);
