-- 000: BASELINE. Objects the numbered migration set never created.
--
-- QA 2026-09-20: `supabase db push` replays ONLY supabase/migrations/, and that
-- folder never created public.profiles, public.slides or public.activities, nor
-- handle_new_user()/on_auth_user_created. They were applied from un-numbered
-- files at supabase/ root, so 002 died on its first line ("relation
-- public.profiles does not exist") and the temple could not rebuild its own
-- database from the repo. This file carries those objects, numbered so it runs
-- FIRST, and is written to be safe on the existing production database
-- (CREATE TABLE IF NOT EXISTS / CREATE OR REPLACE only, no drops, no data).
--
-- The historical root files are kept in supabase/legacy/ for reference only.

create table if not exists public.slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  link_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

create table if not exists public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  avatar_url TEXT,
  gotra TEXT,
  nakshatra TEXT,
  rashi TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  family_members JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

create table if not exists public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('booking', 'donation', 'login', 'profile_update')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  amount NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.email, '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

drop trigger if exists on_auth_user_created on auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- The numbered 001 created donations and bookings WITHOUT user_id, while 002's
-- index and the 012/019 back-link triggers require it. Add it here so a rebuilt
-- database can link a devotee's giving history to their account.
alter table public.donations add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.bookings  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.profiles   enable row level security;
alter table public.slides     enable row level security;
alter table public.activities enable row level security;
