-- Add pickup and billing fields to reservations table
-- Run this migration on Supabase: SQL Editor > paste > Run

ALTER TABLE reservations ADD COLUMN IF NOT EXISTS pickup_address TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS pickup_time TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS billing_city TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS billing_zip TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS billing_country TEXT;
