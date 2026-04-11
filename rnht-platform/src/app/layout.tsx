import type { Metadata, Viewport } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackgroundMusic } from "@/components/effects/BackgroundMusic";
import { WhatsAppButton } from "@/components/effects/WhatsAppButton";
import { CapacitorInit } from "@/components/CapacitorInit";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://rnht-platform.web.app";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#C41E3A",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Rudra Narayana Hindu Temple - Austin, TX | Pooja & Vedic Services",
    template: "%s | Rudra Narayana Hindu Temple",
  },
  description:
    "Austin's premier Hindu temple offering traditional Vedic poojas, homams, weddings, samskaras, and spiritual services. Serving Kyle, Manor, Round Rock, and greater Texas area. Book online or call (512) 545-0473.",
  keywords: [
    "Hindu Temple Austin",
    "Pooja Services Texas",
    "Vedic Rituals Austin TX",
    "Homam Austin",
    "Hindu Wedding Texas",
    "Panchangam",
    "RNHT",
    "Rudra Narayana Hindu Temple",
    "Telugu Priest Austin",
    "Upanayanam Texas",
    "Gruhapravesam Austin",
    "Satyanarayan Pooja",
  ],
  authors: [{ name: "Rudra Narayana Hindu Temple" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Rudra Narayana Hindu Temple",
    title: "Rudra Narayana Hindu Temple - Austin, TX",
    description:
      "Traditional Vedic poojas, homams, weddings & spiritual services in Austin, Texas. Book online today.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudra Narayana Hindu Temple - Austin, TX",
    description:
      "Traditional Vedic poojas, homams, weddings & spiritual services in Austin, Texas.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  metadataBase: new URL(siteUrl),
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  name: "Rudra Narayana Hindu Temple",
  alternateName: "RNHT",
  description:
    "Traditional Hindu temple serving the Austin, Texas area with Vedic poojas, homams, weddings, and spiritual services.",
  url: siteUrl,
  telephone: "+15125450473",
  email: "femtomax.inc@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Austin",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: [
    "Austin", "Kyle", "Manor", "Round Rock", "Georgetown",
    "San Antonio", "Dallas", "Houston", "Lakeway", "Bee Cave",
    "Leander", "Dripping Springs",
  ],
  nonprofitStatus: "Nonprofit501c3",
  openingHours: ["Mo-Su 09:00-12:00", "Mo-Su 17:00-20:00"],
  sameAs: [
    "https://wa.me/message/55G67NQ6CQENA1",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-body">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-temple-red focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <CapacitorInit />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <BackgroundMusic />
      </body>
    </html>
  );
}
