# RNHT Platform

Rudra Narayana Hindu Temple (RNHT) is a temple website and hybrid app for showcasing services, managing bookings, collecting donations, sharing events, and giving devotees a polished digital experience across web and mobile.

Live site: [https://mukundakatta.github.io/rnht](https://mukundakatta.github.io/rnht)

## Project layout

The repository root is mostly a wrapper. The actual application lives in [`rnht-platform`](./rnht-platform).

```text
.
├── README.md
├── index.html
├── Procfile
├── .github/workflows/
└── rnht-platform/
    ├── src/app/              # Next.js App Router pages
    ├── src/components/       # Reusable UI pieces
    ├── src/store/            # Zustand client stores
    ├── src/lib/              # Supabase, Stripe, PayPal, Firebase helpers
    ├── public/               # Static assets
    ├── supabase/             # SQL migration(s)
    ├── android/              # Capacitor Android project
    └── ios/                  # Capacitor iOS project
```

## What the app includes

- Temple marketing site with a rich landing page and branded content
- Service discovery for poojas, homams, samskaras, weddings, and consultations
- Panchangam, event calendar, gallery, streaming, education, priest, and community pages
- Cart and checkout flows for service bookings
- Donation flow with recurring donation options and multiple fund types
- OTP-based authentication backed by Supabase
- Devotee profile, bookings, donations, and family-member data in client state
- Admin screens for bookings, events, services, and slideshow management
- Static-export deployment for GitHub Pages and Firebase Hosting
- Capacitor wrappers for iOS and Android distribution
- Vitest coverage across stores, pages, utilities, and components

## Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Supabase
- Stripe
- PayPal
- Firebase Hosting
- Capacitor
- Vitest + Testing Library

## How the app currently works

The public site is built to work even when some backend integrations are missing. A lot of content is sourced from sample data under `src/lib/sample-data.ts`, and the Supabase client is intentionally nullable so static builds do not crash when environment variables are absent.

That said, the richer features need real credentials and backend services:

- Supabase powers auth and user/bookings profile storage
- Stripe and PayPal power payment flows
- API routes under `src/app/api` support checkout, donations, and webhooks during server-backed deployments

One important deployment detail: the CI workflows remove `src/app/api` before static export builds. That means GitHub Pages and Firebase Hosting get the front end, but not the server routes. If you need live checkout or donation processing in production, you will need a server-capable deployment target or a separate backend for those endpoints.

## Local development

### Prerequisites

- Node.js 20+ recommended
- npm
- Optional: Supabase project, Stripe account, PayPal developer account
- Optional: Xcode and/or Android Studio for native builds

### Install

```bash
cd rnht-platform
npm install
```

### Configure environment variables

Copy the example file and fill in the values you need:

```bash
cp .env.local.example .env.local
```

Supported variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_MODE=sandbox

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_PATH=
```

### Run the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Scripts

Run these from `rnht-platform/`:

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:run
npm run test:coverage
```

## Main routes

The app already includes these major sections:

- `/` home
- `/about`
- `/services`
- `/calendar`
- `/donate`
- `/cart`
- `/checkout`
- `/gallery`
- `/streaming`
- `/education`
- `/community`
- `/priests`
- `/profile`
- `/dashboard`
- `/admin`
- `/contact`
- `/privacy`
- `/terms`
- `/transparency`
- `/panchangam`

## Data and backend notes

- Sample catalog and event content currently live in `src/lib/sample-data.ts`
- Supabase client setup is in `src/lib/supabase.ts`
- Auth state lives in `src/store/auth.ts`
- Cart, language, and slideshow state are managed with Zustand stores
- An initial SQL migration is available at `supabase/migration-001-profiles-and-user-data.sql`

## Deployment

GitHub Actions currently handle two deployment targets on pushes to `main`:

1. Firebase Hosting
2. GitHub Pages

Both workflows:

- install dependencies in `rnht-platform`
- remove `src/app/api` before static export
- run `next build`
- publish the generated `out/` directory

GitHub Pages also sets:

```bash
NEXT_PUBLIC_BASE_PATH=/rnht
```

This matches the live site path under the GitHub Pages repository URL.

## Mobile app notes

The repo includes Capacitor projects for both platforms:

- `rnht-platform/ios`
- `rnht-platform/android`

Typical flow:

```bash
cd rnht-platform
npm run build
npx cap sync
```

Additional iOS submission notes already exist in [`rnht-platform/APP_STORE_SUBMISSION.md`](./rnht-platform/APP_STORE_SUBMISSION.md).

## Testing

The codebase includes Vitest tests for:

- Zustand stores
- page rendering
- utilities and sample data
- layout and admin screens

To run the suite once:

```bash
cd rnht-platform
npm run test:run
```

## Known caveats

- The repository root is not the runnable app; `rnht-platform/` is
- Static-export deployments do not ship Next.js API routes
- Some admin and dashboard views still use sample/mock data
- Payment flows require real secrets and a server-capable environment to function end-to-end
- Supabase-dependent features degrade gracefully, but not every feature is fully production-wired yet

## Recommended next steps

- Move placeholder/sample-backed admin data to Supabase
- Decide on a production backend strategy for checkout and donation APIs
- Re-enable CI test execution once the MVP is ready
- Add architecture diagrams and database schema docs if the team will onboard more contributors
