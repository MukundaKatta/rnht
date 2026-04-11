-- =============================================
-- RNHT Supabase Migration 002: Feature Package
--
-- Adds admin role, phone verification, per-year tax-receipt flag,
-- and the following new tables:
--   donation_types         - admin-managed donation categories
--   news_posts             - CMS for festivals/announcements
--   priests                - single source of truth for priest data
--   volunteer_opportunities- volunteer groups with WhatsApp links
--   service_pdfs           - uploaded/generated services PDFs
--   panditji_routing       - which priest gets "Contact Panditji" clicks
--
-- Run this in Supabase SQL Editor after migration-001.
-- =============================================

-- ===== profiles additions =====
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin) WHERE is_admin = true;

-- ===== donations additions =====
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS tax_receipt_sent BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- ===== donation_types =====
CREATE TABLE IF NOT EXISTS public.donation_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  -- JSON schema describing optional custom fields the donor can fill in.
  -- Shape: [{ "key": "in_honor_of", "label": "In honor of", "type": "text", "required": false }]
  custom_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Seed with the current hardcoded fund types so /donate still works after migration.
INSERT INTO public.donation_types (name, slug, description, sort_order) VALUES
  ('General Temple Fund', 'general',   'Unrestricted contribution supporting all temple activities', 1),
  ('Building Fund',       'building',  'Temple construction and maintenance',                        2),
  ('Priest Fund',         'priest',    'Support our temple priests and their families',              3),
  ('Annadanam Fund',      'annadanam', 'Community meal service program',                             4),
  ('Festival Fund',       'festival',  'Temple festivals and celebrations',                          5),
  ('Education Fund',      'education', 'Vedic school and children''s programs',                      6)
ON CONFLICT (slug) DO NOTHING;

-- ===== news_posts =====
CREATE TABLE IF NOT EXISTS public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT,
  category TEXT NOT NULL DEFAULT 'announcement' CHECK (category IN ('announcement', 'festival', 'update', 'event')),
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_news_posts_published ON public.news_posts(is_published, published_at DESC);

-- ===== priests =====
CREATE TABLE IF NOT EXISTS public.priests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Priest',
  bio TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  phone TEXT,
  whatsapp_url TEXT,
  email TEXT,
  years_experience INT,
  specializations TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  is_head BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Only one head priest at a time.
CREATE UNIQUE INDEX IF NOT EXISTS idx_priests_one_head ON public.priests(is_head) WHERE is_head = true;

-- Seed with the two existing priests so nothing breaks on first deploy.
INSERT INTO public.priests (name, title, bio, whatsapp_url, phone, years_experience, specializations, languages, is_head, sort_order) VALUES
  (
    'Pt. Aditya Sharma',
    'Founder & Head Priest',
    'Highly respected Hindu priest with over 20 years of experience, serving the Austin, Texas community since 2013.',
    'https://wa.me/15125450473',
    '+15125450473',
    20,
    ARRAY['Krishna Yajurveda','Yajurveda Smartam','Vastu','Astrology'],
    ARRAY['English','Telugu','Tamil','Hindi','Sanskrit'],
    true,
    1
  ),
  (
    'Pt. Raghurama Sharma',
    'Senior Priest',
    'Distinguished Vedic scholar with a rich background in Krishna Yajurveda and Smartha traditions.',
    'https://wa.me/15129980112',
    '+15129980112',
    15,
    ARRAY['Krishna Yajurveda','Smartha Traditions','Panchadasa Karmas'],
    ARRAY['Telugu','Tamil','English'],
    false,
    2
  )
ON CONFLICT DO NOTHING;

-- ===== volunteer_opportunities =====
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  whatsapp_group_url TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  schedule TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== service_pdfs =====
CREATE TABLE IF NOT EXISTS public.service_pdfs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  -- Path within the "service-pdfs" Supabase Storage bucket, e.g. "2026/services-april.pdf"
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Only one "current" PDF at a time so /services knows which to link.
CREATE UNIQUE INDEX IF NOT EXISTS idx_service_pdfs_one_current
  ON public.service_pdfs(is_current) WHERE is_current = true;

-- ===== panditji_routing =====
-- Singleton row holding the current "default" priest for Contact Panditji clicks.
CREATE TABLE IF NOT EXISTS public.panditji_routing (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  priest_id UUID REFERENCES public.priests(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Default routing to the head priest.
INSERT INTO public.panditji_routing (id, priest_id)
SELECT 1, (SELECT id FROM public.priests WHERE is_head = true LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- ===== Enable RLS on new tables =====
ALTER TABLE public.donation_types           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_posts               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.priests                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pdfs             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.panditji_routing         ENABLE ROW LEVEL SECURITY;

-- Also enable on existing public-read tables so admin-only write works consistently.
ALTER TABLE public.services                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides                   ENABLE ROW LEVEL SECURITY;

-- ===== Admin predicate function =====
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ===== RLS policies =====

-- donation_types: public read active, admin full CRUD
DROP POLICY IF EXISTS "Anyone can view active donation_types" ON public.donation_types;
DROP POLICY IF EXISTS "Admins can manage donation_types"      ON public.donation_types;
CREATE POLICY "Anyone can view active donation_types"
  ON public.donation_types FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage donation_types"
  ON public.donation_types FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- news_posts: public read published, admin full CRUD
DROP POLICY IF EXISTS "Anyone can view published news_posts" ON public.news_posts;
DROP POLICY IF EXISTS "Admins can manage news_posts"         ON public.news_posts;
CREATE POLICY "Anyone can view published news_posts"
  ON public.news_posts FOR SELECT
  USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins can manage news_posts"
  ON public.news_posts FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- priests: public read active, admin full CRUD
DROP POLICY IF EXISTS "Anyone can view active priests" ON public.priests;
DROP POLICY IF EXISTS "Admins can manage priests"      ON public.priests;
CREATE POLICY "Anyone can view active priests"
  ON public.priests FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage priests"
  ON public.priests FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- volunteer_opportunities: public read active, admin full CRUD
DROP POLICY IF EXISTS "Anyone can view active volunteer_opportunities" ON public.volunteer_opportunities;
DROP POLICY IF EXISTS "Admins can manage volunteer_opportunities"      ON public.volunteer_opportunities;
CREATE POLICY "Anyone can view active volunteer_opportunities"
  ON public.volunteer_opportunities FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage volunteer_opportunities"
  ON public.volunteer_opportunities FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- service_pdfs: public read active+current, admin full CRUD
DROP POLICY IF EXISTS "Anyone can view current service_pdfs" ON public.service_pdfs;
DROP POLICY IF EXISTS "Admins can manage service_pdfs"       ON public.service_pdfs;
CREATE POLICY "Anyone can view current service_pdfs"
  ON public.service_pdfs FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage service_pdfs"
  ON public.service_pdfs FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- panditji_routing: public read, admin update
DROP POLICY IF EXISTS "Anyone can read panditji_routing" ON public.panditji_routing;
DROP POLICY IF EXISTS "Admins can update panditji_routing" ON public.panditji_routing;
CREATE POLICY "Anyone can read panditji_routing"
  ON public.panditji_routing FOR SELECT
  USING (true);
CREATE POLICY "Admins can update panditji_routing"
  ON public.panditji_routing FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- services & categories & events & slides: public read, admin write
DROP POLICY IF EXISTS "Anyone can view active services"         ON public.services;
DROP POLICY IF EXISTS "Admins can manage services"              ON public.services;
CREATE POLICY "Anyone can view active services"
  ON public.services FOR SELECT
  USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage services"
  ON public.services FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view service_categories"      ON public.service_categories;
DROP POLICY IF EXISTS "Admins can manage service_categories"    ON public.service_categories;
CREATE POLICY "Anyone can view service_categories"
  ON public.service_categories FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage service_categories"
  ON public.service_categories FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view events"   ON public.events;
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Anyone can view events"
  ON public.events FOR SELECT
  USING (true);
CREATE POLICY "Admins can manage events"
  ON public.events FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Anyone can view active slides" ON public.slides;
DROP POLICY IF EXISTS "Admins can manage slides"      ON public.slides;
CREATE POLICY "Anyone can view active slides"
  ON public.slides FOR SELECT
  USING (active = true OR public.is_admin());
CREATE POLICY "Admins can manage slides"
  ON public.slides FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin-only read-all on donations (for /admin/donations inflow tab).
DROP POLICY IF EXISTS "Admins can view all donations" ON public.donations;
CREATE POLICY "Admins can view all donations"
  ON public.donations FOR SELECT
  USING (public.is_admin());

-- Admin-only read-all on bookings (for /admin/donations inflow tab).
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT
  USING (public.is_admin());

-- Admin-only read-all on profiles so donor listings can resolve names.
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

-- ===== Updated_at triggers for new tables =====
DROP TRIGGER IF EXISTS donation_types_updated_at      ON public.donation_types;
DROP TRIGGER IF EXISTS news_posts_updated_at          ON public.news_posts;
DROP TRIGGER IF EXISTS priests_updated_at             ON public.priests;
DROP TRIGGER IF EXISTS volunteer_opportunities_updated_at ON public.volunteer_opportunities;
DROP TRIGGER IF EXISTS panditji_routing_updated_at    ON public.panditji_routing;

CREATE TRIGGER donation_types_updated_at
  BEFORE UPDATE ON public.donation_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER news_posts_updated_at
  BEFORE UPDATE ON public.news_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER priests_updated_at
  BEFORE UPDATE ON public.priests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER volunteer_opportunities_updated_at
  BEFORE UPDATE ON public.volunteer_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER panditji_routing_updated_at
  BEFORE UPDATE ON public.panditji_routing
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ===== Indexes =====
CREATE INDEX IF NOT EXISTS idx_news_posts_category         ON public.news_posts(category);
CREATE INDEX IF NOT EXISTS idx_donation_types_active       ON public.donation_types(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_active ON public.volunteer_opportunities(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_donations_created_at        ON public.donations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_user_year         ON public.donations(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at         ON public.bookings(created_at DESC);
