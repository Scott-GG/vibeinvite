-- VibeInvite Initial Schema Migration
-- Run this in Supabase SQL Editor or via Supabase CLI

-- 1. Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('wedding', 'gala', 'party')),
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location_name TEXT,
  location_address TEXT,
  registry_url TEXT,
  cover_image_url TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Guests
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  plus_one_allowed BOOLEAN DEFAULT false,
  plus_one_count INT DEFAULT 0,
  dietary_restrictions TEXT,
  custom_responses JSONB DEFAULT '{}'::jsonb,
  access_token UUID DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tables (Seating — Phase 2)
CREATE TABLE tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  table_name TEXT NOT NULL,
  capacity INT NOT NULL
);

ALTER TABLE guests ADD COLUMN table_id UUID REFERENCES tables(id) ON DELETE SET NULL;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Events: owners have full access
CREATE POLICY "Owners can manage events" ON events
  FOR ALL USING (auth.uid() = user_id);

-- Guests: event owners can manage guests; guests can view/update via access_token
CREATE POLICY "Event owners can manage guests" ON guests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = guests.event_id AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Guests can view own record via token" ON guests
  FOR SELECT USING (access_token IS NOT NULL);

CREATE POLICY "Guests can update own record via token" ON guests
  FOR UPDATE USING (access_token IS NOT NULL);

-- Tables: event owners have full access
CREATE POLICY "Owners can manage tables" ON tables
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM events WHERE events.id = tables.event_id AND events.user_id = auth.uid()
    )
  );

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_guests_event_id ON guests(event_id);
CREATE INDEX idx_guests_access_token ON guests(access_token);
CREATE INDEX idx_tables_event_id ON tables(event_id);
