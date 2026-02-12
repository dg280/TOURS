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
CREATE POLICY "Public Update" ON reviews FOR UPDATE USING (true);
