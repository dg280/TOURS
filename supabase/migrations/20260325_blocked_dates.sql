-- Blocked dates: admin can mark specific dates as unavailable per tour
-- 2026-03-25

CREATE TABLE IF NOT EXISTS blocked_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id TEXT NOT NULL,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tour_id, date)
);

-- Index for fast lookup by tour + date range
CREATE INDEX IF NOT EXISTS blocked_dates_tour_date_idx ON blocked_dates (tour_id, date);

-- RLS: public can read (needed for booking calendar), only admin can write
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read blocked_dates"
  ON blocked_dates FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can insert blocked_dates"
  ON blocked_dates FOR INSERT
  TO authenticated
  WITH CHECK (is_authorized_admin());

CREATE POLICY "Admin can delete blocked_dates"
  ON blocked_dates FOR DELETE
  TO authenticated
  USING (is_authorized_admin());
