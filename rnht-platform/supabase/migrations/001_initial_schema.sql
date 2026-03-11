-- RNHT Platform Database Schema
-- Phase 1 MVP: Services, Bookings, Events, Donations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Service Categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT,
  significance TEXT,
  items_to_bring TEXT[],
  whats_included TEXT[],
  image_url TEXT,
  price DECIMAL(10,2),
  price_type TEXT NOT NULL CHECK (price_type IN ('fixed', 'tiered', 'custom', 'donation')),
  price_tiers JSONB,
  suggested_donation DECIMAL(10,2),
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  location_type TEXT NOT NULL CHECK (location_type IN ('at_temple', 'outside_temple', 'both')),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  devotee_name TEXT NOT NULL,
  devotee_email TEXT NOT NULL,
  devotee_phone TEXT,
  gotra TEXT,
  nakshatra TEXT,
  rashi TEXT,
  special_instructions TEXT,
  family_members JSONB,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('festival', 'regular_pooja', 'community', 'class')),
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  location TEXT,
  image_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule TEXT,
  rsvp_enabled BOOLEAN DEFAULT FALSE,
  rsvp_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  party_size INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, email)
);

-- Donations
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  fund_type TEXT NOT NULL DEFAULT 'general',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'zelle')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  is_recurring BOOLEAN DEFAULT FALSE,
  message TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_email ON bookings(devotee_email);
CREATE INDEX idx_events_date ON events(start_date);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_donations_email ON donations(donor_email);
CREATE INDEX idx_donations_fund ON donations(fund_type);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public can view categories" ON service_categories FOR SELECT USING (true);
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);

-- Public insert policies (for guest checkout)
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create RSVPs" ON event_rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create donations" ON donations FOR INSERT WITH CHECK (true);

-- Seed data for categories
INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES
('Homam / Havan', 'homam-havan', 'Sacred fire rituals and offerings to deities through Agni', '🔥', 1),
('Pooja Services', 'pooja-services', 'Traditional worship rituals and prayers', '🙏', 2),
('Kalyanotsavam', 'kalyanotsavam', 'Celestial wedding ceremonies of deities', '💒', 3),
('Vrata / Katha', 'vrata-katha', 'Sacred fasting and religious discourse services', '📿', 4),
('Astrology & Vastu', 'astrology-vastu', 'Vedic astrology consultations and Vastu guidance', '⭐', 5),
('Temple Services', 'temple-services', 'General temple rituals and darshan services', '🛕', 6);
