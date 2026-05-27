-- VibeInvite Scheduled Send Migration
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Add scheduled_send_at to events for timed email delivery
ALTER TABLE events ADD COLUMN IF NOT EXISTS scheduled_send_at TIMESTAMP WITH TIME ZONE;

-- Add 'sent' to guests status so we can track which guests have been emailed
ALTER TABLE guests DROP CONSTRAINT IF EXISTS guests_status_check;
ALTER TABLE guests ADD CONSTRAINT guests_status_check
  CHECK (status IN ('pending', 'accepted', 'declined', 'sent'));
