# Rudra Narayana Hindu Temple (RNHT)

A modern, full-featured temple management platform built with Next.js, serving the Hindu community in Austin, Texas and beyond.

## Live Sites

- **Firebase Hosting**: Deployed automatically on every push to `main`
- **GitHub Pages**: [https://mukundakatta.github.io/rnht](https://mukundakatta.github.io/rnht)

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom temple theme (gold, maroon, cream)
- **State Management**: Zustand
- **Backend**: Supabase (database, auth, storage)
- **Storage**: Firebase Storage (media uploads)
- **Testing**: Vitest + React Testing Library (1,300+ tests, 99%+ coverage)
- **CI/CD**: GitHub Actions (build & deploy to Firebase + GitHub Pages)

## Features

### Devotee-Facing
- **Home**: Hero slideshow with animated panchangam scroll, temple stats, testimonials
- **Services**: 26+ Vedic services with booking, tiered pricing, cart & checkout
- **Panchangam**: Daily Hindu calendar with tithi, nakshatra, yoga, karana
- **Gallery**: Masonry photo grid with lightbox (25+ real temple photos)
- **Donate**: Multiple funds, deity-specific donations, Zelle/Stripe/PayPal, Dollar-A-Day program
- **Calendar**: Events with list & calendar views, category filtering
- **Live Streaming**: Live darshan with chat, upcoming streams, past recordings
- **Education**: 10 programs (Vedic school, dance, music, yoga, languages)
- **Community**: Volunteer sign-up, Annadanam schedule, announcements, seva leaderboard
- **Sponsorship**: Festival tiers, deity ornaments, service bundles
- **Priests**: Detailed profiles for both temple priests
- **Transparency**: Financial statements, building fund progress, donor wall

### Admin
- **Dashboard**: Slideshow manager, bookings, events, services (CRUD)
- **Auth**: Email OTP + Google OAuth via Supabase

### Technical
- **i18n**: 10 languages (English, Telugu, Hindi, Tamil, Kannada, Marathi, Malayalam, Gujarati, Bengali, Punjabi)
- **Mobile-First**: Fully responsive across all pages and modals
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML
- **Performance**: Static export, optimized images, code splitting
- **Decorative**: Animated temple bells, hanging deepam lamps, falling petals, background music

## Project Structure

```
rnht/
  rnht-platform/          # Next.js application
    src/
      app/                 # Pages (App Router)
        admin/             # Admin dashboard
        about/contact/     # Info pages
        calendar/          # Events calendar
        community/         # Volunteer & annadanam
        donate/            # Donation page
        education/         # Classes & programs
        gallery/           # Photo gallery
        panchangam/        # Daily Hindu calendar
        priests/           # Priest profiles
        services/          # Service catalog
        sponsorship/       # Sponsorship tiers
        streaming/         # Live darshan
        transparency/      # Financial reports
      components/          # Reusable components
        layout/            # Header, Footer
        slideshow/         # Hero slideshow
        services/          # ServiceCard, ServiceDetailModal
        panchangam/        # PanchangamWidget
        calendar/          # EventCard
      store/               # Zustand stores (auth, cart, language, slideshow)
      lib/                 # Utilities, Supabase client, Firebase, i18n
      types/               # TypeScript types
    public/                # Static assets (images, gallery photos)
  .github/workflows/       # CI/CD pipeline
```

## Getting Started

```bash
cd rnht-platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `rnht-platform/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Scripts

```bash
npm run dev            # Start dev server
npm run build          # Production build (static export)
npm run lint           # ESLint
npm run test           # Run tests (watch mode)
npm run test:coverage  # Run tests with coverage report
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci-deploy.yml`) runs on every push to `main`:

1. **Build & Deploy to Firebase Hosting** (requires `FIREBASE_SERVICE_ACCOUNT` secret)
2. **Build & Deploy to GitHub Pages** (with `/rnht` base path)

Test job is currently commented out until MVP is ready.

## About RNHT

Rudra Narayana Hindu Temple is a 501(c)(3) registered nonprofit serving the Austin, Texas community since 2022. Founded by Pt. Shri Aditya Sharma, RNHT provides authentic Vedic ceremonies, spiritual education, and community services across the greater Texas area.

- **Phone**: (512) 545-0473
- **WhatsApp**: [Contact Pt. Aditya Sharma](https://wa.me/message/55G67NQ6CQENA1)
