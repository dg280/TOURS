-- Migration: LiveTour Feature
-- Description: Adds tables and fields for real-time tour experience.

-- 1. Modify tours table
ALTER TABLE tours ADD COLUMN IF NOT EXISTS stops JSONB DEFAULT '[]'::jsonb;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS stripe_tip_link TEXT;

-- 2. Create live_sessions table
CREATE TABLE IF NOT EXISTS live_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id TEXT REFERENCES tours(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    current_stop_index INTEGER DEFAULT 0,
    urgent_message TEXT,
    session_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create live_echoes table (Guestbook/Comments)
CREATE TABLE IF NOT EXISTS live_echoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_name TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'echo' CHECK (type IN ('echo', 'feedback')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create live_media table (Participant shared photos)
CREATE TABLE IF NOT EXISTS live_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES live_sessions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    uploaded_by TEXT NOT NULL, -- User name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('live_photos', 'live_photos', true) 
ON CONFLICT (id) DO NOTHING;

-- 6. RLS Policies

ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_echoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_media ENABLE ROW LEVEL SECURITY;

-- 5.1 live_sessions: Public read by code, Admin all
CREATE POLICY "Public Select Sessions" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Admin All Sessions" ON live_sessions FOR ALL TO authenticated USING (true);

-- 5.2 live_echoes: Public insert/read, Admin manage
CREATE POLICY "Public Select Echoes" ON live_echoes FOR SELECT USING (true);
CREATE POLICY "Public Insert Echoes" ON live_echoes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Echoes" ON live_echoes FOR ALL TO authenticated USING (true);

-- 5.3 live_media: Public insert/read, Admin manage
CREATE POLICY "Public Select Media" ON live_media FOR SELECT USING (true);
CREATE POLICY "Public Insert Media" ON live_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Manage Media" ON live_media FOR ALL TO authenticated USING (true);

-- Enable Realtime for live_sessions
ALTER PUBLICATION supabase_realtime ADD TABLE live_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE live_echoes;
ALTER PUBLICATION supabase_realtime ADD TABLE live_media;
