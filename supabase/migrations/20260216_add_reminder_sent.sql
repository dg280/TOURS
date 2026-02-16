-- Migration to support email reminders
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;
