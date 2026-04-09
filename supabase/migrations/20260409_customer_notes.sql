-- Mini CRM: customer_notes table
-- Stores admin-editable overrides + free-form notes per customer (keyed by email).
-- Customer aggregation in the admin reads from `reservations` and joins this
-- table for overrides — the original reservation rows are never modified.
--
-- Approach: lightweight (no FK to reservations, no UUID, just email PK).
-- The admin types the email naturally; if a customer changes email later, they
-- become a new entry. That's fine for v1.

CREATE TABLE IF NOT EXISTS customer_notes (
    email      TEXT PRIMARY KEY,
    phone      TEXT,
    address    TEXT,
    notes      TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on UPDATE
CREATE OR REPLACE FUNCTION update_customer_notes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS customer_notes_updated_at ON customer_notes;
CREATE TRIGGER customer_notes_updated_at
    BEFORE UPDATE ON customer_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_notes_updated_at();

-- RLS: admin only (matches policies in 20260302_security_fixes.sql)
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin All Customer Notes" ON customer_notes;
CREATE POLICY "Admin All Customer Notes" ON customer_notes
    FOR ALL TO authenticated USING (is_authorized_admin());
