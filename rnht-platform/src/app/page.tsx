import Link from "next/link";
import Image from "next/image";
import {
  sampleCategories,
  sampleServices,
  sampleEvents,
  samplePanchangam,
} from "@/lib/sample-data";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PanchangamWidget } from "@/components/panchangam/PanchangamWidget";
import { EventCard } from "@/components/calendar/EventCard";
import { HeroSlideshow } from "@/components/slideshow/HeroSlideshow";
import {
  BookOpen,
  HeartHandshake,
  Video,
  Users,
  Camera,
  FileText,
  Gift,
  Star,
  Phone,
  MessageCircle,
  Calendar,
  MapPin,
  Quote,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const testimonials = [
  {
    name: "Srinivas R.",
    location: "Round Rock, TX",
    text: "Pandit Aditya ji performed our Gruhapravesam with such devotion and attention to detail. The entire family felt blessed. Highly recommend RNHT for all Vedic ceremonies.",
  },
  {
    name: "Lakshmi P.",
    location: "Kyle, TX",
    text: "We had our son's Upanayanam done by RNHT priests. They explained every step of the ritual beautifully. A truly authentic Vedic experience.",
  },
  {
    name: "Venkat K.",
    location: "Austin, TX",
    text: "The Navagraha Homam was performed with proper Vedic procedures. Pandit Raghurama Sharma's knowledge of mantras is exceptional. Very professional and punctual.",
  },
];

export default function HomePage() {
  const featuredServices = sampleServices.slice(0, 4);
  const upcomingEvents = sampleEvents
    .filter((e) => !e.is_recurring)
    .slice(0, 3);

  return (
    <div className="bg-temple-ivory">
      {/* Hero Split — banner top half + slideshow bottom half, fills viewport */}
      <div className="flex flex-col h-[calc(100vh-62px)]">
        {/* Hero Banner — top half */}
        <section className="relative w-full h-1/2 overflow-hidden">
          <Image
            src="/RNHT_Homepage_Hero_1920x560_112.png"
            alt="Rudra Narayana Hindu Temple - Dharmo Rakshati Rakshitaha"
            width={1920}
            height={560}
            className="w-full h-full object-cover object-center"
            priority
          />
          {/* Premium gold accent line at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-temple-gold to-transparent" />
        </section>

        {/* Hero Slideshow — bottom half */}
        <section className="relative w-full h-1/2">
          <HeroSlideshow />
        </section>
      </div>

      {/* Quick Info Bar */}
      <section className="bg-gradient-to-r from-temple-maroon-deep via-temple-maroon to-temple-maroon-deep text-white border-b-2 border-temple-gold/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-3.5 text-sm sm:gap-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-temple-gold-light" />
            <span className="font-medium">Austin, Texas</span>
          </div>
          <a
            href="tel:+15125450473"
            className="flex items-center gap-2 transition-colors hover:text-temple-gold-light"
          >
            <Phone className="h-4 w-4 text-temple-gold-light" />
            <span className="font-medium">(512) 545-0473</span>
          </a>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-temple-gold-light" />
            <span>9 AM – 12 PM &amp; 5 PM – 8 PM</span>
          </div>
          <Link
            href="/donate"
            className="flex items-center gap-2 rounded-full bg-temple-gold/20 px-4 py-1 font-semibold text-temple-gold-light transition-colors hover:bg-temple-gold/30"
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Support the Temple</span>
          </Link>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="relative bg-gradient-to-b from-[#FFF8E7] via-white to-white section-gold-border overflow-hidden">
        <div className="gold-particles" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-14 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { value: "Est. 2022", label: "Serving the Community", icon: "🙏" },
            { value: "26+", label: "Vedic Services Offered", icon: "🪔" },
            { value: "2", label: "Experienced Priests", icon: "📿" },
            { value: "12+", label: "Texas Cities Served", icon: "📍" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-temple-gold/10 border border-temple-gold/20 text-xl transition-all duration-300 group-hover:bg-temple-gold/20 group-hover:scale-110 animate-pulse-glow">
                {stat.icon}
              </div>
              <p className="font-heading text-3xl font-bold text-gold-gradient sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm font-accent text-temple-maroon/70 tracking-wide font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Panchangam Widget */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <PanchangamWidget panchangam={samplePanchangam} compact />
      </section>

      {/* Service Categories */}
      <section className="relative py-20 overflow-hidden section-gold-border">
        {/* Subtle bg pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-temple-cream via-[#FFF8E7]/50 to-white" />
        <div className="gold-particles" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-accent text-sm font-semibold tracking-[0.2em] uppercase text-temple-gold">Pooja &amp; Rituals</p>
            <h2 className="mt-2 section-heading">Our Sacred Services</h2>
            <div className="ornament-divider"><span>&#x2733;</span></div>
            <p className="mx-auto max-w-xl text-gray-600 font-accent text-lg">
              Book authentic Vedic poojas, homams, and spiritual services
            </p>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {sampleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${category.slug}`}
                className="card flex flex-col items-center gap-3 p-6 text-center hover:border-temple-gold/30 group"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {category.icon}
                </span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-temple-maroon transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14">
            <h3 className="text-xl font-heading font-bold text-temple-maroon mb-8">
              Popular Services
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
                View All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RNHT */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="gold-particles" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-accent text-sm font-semibold tracking-[0.2em] uppercase text-temple-gold">Our Promise</p>
            <h2 className="mt-2 section-heading">Why Choose RNHT</h2>
            <div className="ornament-divider"><span>&#x2733;</span></div>
            <p className="mx-auto max-w-xl text-gray-600 font-accent text-lg">
              Trusted by families across Texas for authentic Vedic ceremonies
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Authentic Vedic Rituals",
                desc: "Our priests follow traditional Vedic procedures with proper mantras from Krishna Yajurvedam, ensuring the sanctity of every ceremony.",
              },
              {
                title: "Experienced Priests",
                desc: "Over 35 years of combined experience. Both priests are trained in traditional Vedic knowledge with expertise in all 16 Samskaras.",
              },
              {
                title: "Home & Temple Services",
                desc: "We come to you. All ceremonies can be performed at your home, office, or any venue across Texas — not just at the temple.",
              },
              {
                title: "Personalized Attention",
                desc: "Every ceremony is customized to your family's traditions. We explain each step so you understand the spiritual significance.",
              },
              {
                title: "Multilingual Priests",
                desc: "Services conducted in English, Telugu, Tamil, Hindi, and Sanskrit to ensure every devotee feels at home.",
              },
              {
                title: "Tax-Deductible Donations",
                desc: "RNHT is a registered 501(c)(3) nonprofit. All donations and service contributions are tax-deductible.",
              },
            ].map((item) => (
              <div key={item.title} className="gold-corners flex gap-4 p-6 rounded-2xl bg-gradient-to-br from-temple-ivory/80 to-[#FFF8E7]/60 border border-temple-gold/10 transition-all duration-300 hover:shadow-gold-glow hover:border-temple-gold/25 hover:-translate-y-1">
                <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-temple-gold" />
                <div>
                  <h3 className="font-heading font-bold text-temple-maroon text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 bg-temple-maroon-deep overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-accent text-sm font-semibold tracking-[0.2em] uppercase text-temple-gold-light">Testimonials</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem] tracking-tight">What Devotees Say</h2>
            <div className="ornament-divider"><span className="!text-temple-gold-light">&#x2733;</span></div>
            <p className="mx-auto max-w-xl font-accent text-lg text-gray-300">
              Hear from families who have experienced our services
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="gold-corners rounded-2xl bg-white/5 backdrop-blur border border-temple-gold/10 p-8 transition-all duration-300 hover:bg-white/10 hover:border-temple-gold/40 hover:shadow-[0_0_30px_rgba(197,151,62,0.15)]">
                <Quote className="h-8 w-8 text-temple-gold/70" />
                <p className="mt-4 text-[15px] text-gray-200 leading-relaxed font-accent italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-heading font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-temple-gold-light mt-0.5">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Floating Om watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-temple-gold/[0.03] pointer-events-none select-none animate-rotate-slow" aria-hidden="true">&#x0950;</div>
        <div className="gold-particles" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-accent text-sm font-semibold tracking-[0.2em] uppercase text-temple-gold">Discover More</p>
            <h2 className="mt-2 section-heading">Explore RNHT</h2>
            <div className="ornament-divider"><span>&#x2733;</span></div>
            <p className="mx-auto max-w-xl text-gray-600 font-accent text-lg">
              Everything our temple community has to offer
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Video,
                label: "Live Darshan",
                desc: "Watch daily aarti and special ceremonies",
                href: "/streaming",
                color: "bg-red-50 text-red-600 group-hover:bg-red-100",
              },
              {
                icon: Camera,
                label: "Gallery",
                desc: "Photos & videos from temple events",
                href: "/gallery",
                color: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
              },
              {
                icon: BookOpen,
                label: "Education",
                desc: "Vedic school, dance, music, and yoga",
                href: "/education",
                color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
              },
              {
                icon: HeartHandshake,
                label: "Volunteer",
                desc: "Seva opportunities and Annadanam",
                href: "/community",
                color: "bg-green-50 text-green-600 group-hover:bg-green-100",
              },
              {
                icon: Users,
                label: "Our Priests",
                desc: "Meet our learned priests",
                href: "/priests",
                color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
              },
              {
                icon: Gift,
                label: "Sponsorship",
                desc: "Festival & deity ornament sponsorship",
                href: "/sponsorship",
                color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100",
              },
              {
                icon: Star,
                label: "Dollar A Day",
                desc: "Support the temple daily for just $1",
                href: "/donate",
                color: "bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100",
              },
              {
                icon: FileText,
                label: "Transparency",
                desc: "Financial statements and donor wall",
                href: "/transparency",
                color: "bg-teal-50 text-teal-600 group-hover:bg-teal-100",
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="card flex items-start gap-4 p-6 hover:border-temple-gold/20 group"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.color} transition-all duration-300`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-heading font-semibold text-temple-maroon">{item.label}</p>
                  <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-temple-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-accent text-sm font-semibold tracking-[0.2em] uppercase text-temple-gold">Calendar</p>
              <h2 className="mt-2 section-heading">Upcoming Events</h2>
              <p className="mt-3 text-gray-600 font-accent">
                Festivals, celebrations, and community gatherings
              </p>
            </div>
            <Link
              href="/calendar"
              className="btn-outline hidden sm:inline-flex items-center gap-2"
            >
              Full Calendar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/calendar" className="btn-outline">
              View Full Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="relative py-20 bg-gradient-to-b from-white to-[#FFF8E7]/50 overflow-hidden section-gold-border">
        <div className="gold-particles" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-temple-gold/10 border border-temple-gold/20">
              <MapPin className="h-7 w-7 text-temple-gold" />
            </div>
            <h2 className="mt-4 section-heading">Serving All of Texas</h2>
            <div className="ornament-divider"><span>&#x2733;</span></div>
            <p className="mx-auto max-w-xl text-gray-600 font-accent text-lg">
              Our priests travel to your home, office, or venue across the greater Texas area
            </p>
          </div>
          <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-3">
            {[
              "Austin", "Kyle", "Manor", "Round Rock", "Georgetown", "Lakeway",
              "Bee Cave", "Leander", "Dripping Springs", "San Antonio",
              "Dallas", "Houston", "Lago Vista", "Liberty Hill",
            ].map((city) => (
              <span
                key={city}
                className="rounded-full bg-temple-cream border border-temple-gold/15 px-5 py-2 text-sm font-medium text-temple-maroon transition-all hover:bg-temple-gold/10 hover:border-temple-gold/30"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dollar A Day CTA */}
      <section className="relative py-20 overflow-hidden section-gold-border">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8E7] via-temple-gold/8 to-[#FFF3D6]" />
        <div className="absolute inset-0 bg-gold-shimmer animate-gold-shimmer" />
        <div className="gold-particles" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-temple-gold/15 border border-temple-gold/30 animate-pulse-glow">
            <Sparkles className="h-8 w-8 text-temple-gold" />
          </div>
          <h2 className="mt-4 section-heading">Dollar A Day</h2>
          <div className="ornament-divider"><span>&#x2733;</span></div>
          <p className="mx-auto mt-2 max-w-2xl text-gray-600 font-accent text-lg">
            Make a lasting impact with just $1 a day. Your recurring donation
            helps maintain daily temple operations, support priests, and serve
            the community.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary text-base px-8 py-4">
              $31/month — Join Now
            </Link>
            <Link href="/donate" className="btn-secondary text-base px-8 py-4">
              $365/year — Save $7
            </Link>
          </div>
          <p className="mt-5 text-xs text-gray-500 font-accent">
            All donations are tax-deductible under 501(c)(3). Cancel anytime.
          </p>
        </div>
      </section>

      {/* Final CTA — WhatsApp + Donate */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-gold-glow-lg">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-temple-maroon-deep via-temple-maroon to-temple-red-dark" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
            {/* Gold border glow */}
            <div className="absolute inset-0 rounded-3xl ring-2 ring-inset ring-temple-gold/25" />
            {/* Corner ornaments */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-temple-gold/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-temple-gold/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-temple-gold/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-temple-gold/30 rounded-br-lg" />

            <div className="relative p-10 text-center sm:p-16">
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl lg:text-5xl tracking-tight">
                Ready to Book a Pooja?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-gray-300 font-accent text-lg leading-relaxed">
                Contact us via WhatsApp for quick booking, or browse our services
                online. We serve the entire Austin metro and greater Texas area.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <a
                  href="https://wa.me/message/55G67NQ6CQENA1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary bg-green-600 text-white hover:bg-green-500 text-base px-8 py-4"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp: (512) 545-0473
                </a>
                <Link href="/donate" className="btn-primary bg-temple-gold text-temple-maroon-deep hover:bg-temple-gold-light text-base px-8 py-4 font-bold">
                  Donate Now
                </Link>
                <Link href="/services" className="btn-primary bg-white/10 text-white backdrop-blur hover:bg-white/20 text-base px-8 py-4">
                  Browse Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
