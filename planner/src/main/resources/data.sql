-- Migration: Add checked_in column to guest_group and guest if not exists
-- This runs on every startup safely via IF NOT EXISTS

ALTER TABLE guest_group
  ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE guest
  ADD COLUMN IF NOT EXISTS checked_in BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE wedding
  ADD COLUMN IF NOT EXISTS notification_email VARCHAR(255);
