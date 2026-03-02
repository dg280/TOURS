-- Security fixes: 2026-03-02
-- 0. Add payment_intent_id to reservations for Stripe webhook linking
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;
CREATE INDEX IF NOT EXISTS reservations_payment_intent_id_idx ON reservations (payment_intent_id);

-- 1. Remove public read access on authorized_admins (leaks admin emails)
-- 2. Add is_authorized_admin() helper function
-- 3. Restrict admin-only tables to verified admins (not just any authenticated user)

-- ─── 1. Drop overly permissive public select on authorized_admins ─────────────
DROP POLICY IF EXISTS "Public Select Authorized Admins" ON authorized_admins;

-- ─── 2. Helper function: check if current JWT email is in authorized_admins ───
-- SECURITY DEFINER allows reading authorized_admins even without a direct policy.
CREATE OR REPLACE FUNCTION is_authorized_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM authorized_admins
    WHERE email = lower(trim(auth.jwt() ->> 'email'))
  );
$$;

-- Grant execution to authenticated users only
REVOKE ALL ON FUNCTION is_authorized_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_authorized_admin() TO authenticated;

-- ─── 3. Replace overly broad RLS policies with is_authorized_admin() ──────────

-- RESERVATIONS: keep public insert (booking), restrict read/write to admins
DROP POLICY IF EXISTS "Admin Select Reservations" ON reservations;
DROP POLICY IF EXISTS "Admin Update Reservations" ON reservations;
DROP POLICY IF EXISTS "Admin Delete Reservations" ON reservations;

CREATE POLICY "Admin Select Reservations" ON reservations
  FOR SELECT TO authenticated USING (is_authorized_admin());

CREATE POLICY "Admin Update Reservations" ON reservations
  FOR UPDATE TO authenticated USING (is_authorized_admin());

CREATE POLICY "Admin Delete Reservations" ON reservations
  FOR DELETE TO authenticated USING (is_authorized_admin());

-- TOURS: keep public select (catalog visible to all), restrict writes to admins
DROP POLICY IF EXISTS "Admin All Tours" ON tours;

CREATE POLICY "Admin Write Tours" ON tours
  FOR INSERT TO authenticated WITH CHECK (is_authorized_admin());

CREATE POLICY "Admin Update Tours" ON tours
  FOR UPDATE TO authenticated USING (is_authorized_admin());

CREATE POLICY "Admin Delete Tours" ON tours
  FOR DELETE TO authenticated USING (is_authorized_admin());

-- REVIEWS: keep public insert and public select of published, restrict writes to admins
DROP POLICY IF EXISTS "Admin Update Reviews" ON reviews;
DROP POLICY IF EXISTS "Admin Delete Reviews" ON reviews;

CREATE POLICY "Admin Update Reviews" ON reviews
  FOR UPDATE TO authenticated USING (is_authorized_admin());

CREATE POLICY "Admin Delete Reviews" ON reviews
  FOR DELETE TO authenticated USING (is_authorized_admin());

-- SITE CONFIG: restrict writes to admins
DROP POLICY IF EXISTS "Admin All Config" ON site_config;

CREATE POLICY "Admin Write Config" ON site_config
  FOR INSERT TO authenticated WITH CHECK (is_authorized_admin());

CREATE POLICY "Admin Update Config" ON site_config
  FOR UPDATE TO authenticated USING (is_authorized_admin());

CREATE POLICY "Admin Delete Config" ON site_config
  FOR DELETE TO authenticated USING (is_authorized_admin());

-- DEFAULT TOURS: restrict to admins
DROP POLICY IF EXISTS "Public Select Default Tours" ON default_tours;
DROP POLICY IF EXISTS "Admin All Default Tours" ON default_tours;

CREATE POLICY "Admin All Default Tours" ON default_tours
  FOR ALL TO authenticated USING (is_authorized_admin());

-- AUTHORIZED ADMINS: restrict all operations to existing admins
DROP POLICY IF EXISTS "Admin All Authorized Admins" ON authorized_admins;

CREATE POLICY "Admin All Authorized Admins" ON authorized_admins
  FOR ALL TO authenticated USING (is_authorized_admin());
