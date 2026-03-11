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
    <div>
      {/* Hero Banner */}
      <section className="w-full">
        <Image
          src="/RNHT_Homepage_Hero_1920x560_112.png"
          alt="Rudra Narayana Hindu Temple - Dharmo Rakshati Rakshitaha"
          width={1920}
          height={560}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* Hero Slideshow */}
      <HeroSlideshow />

      {/* Quick Info Bar */}
      <section className="border-b border-gray-200 bg-temple-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-4 text-sm sm:gap-10 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-temple-maroon">
            <MapPin className="h-4 w-4" />
            <span><strong>Austin, Texas</strong></span>
          </div>
          <a
            href="tel:+15125450473"
            className="flex items-center gap-2 text-temple-maroon hover:text-temple-red"
          >
            <Phone className="h-4 w-4" />
            <span><strong>(512) 545-0473</strong></span>
          </a>
          <div className="flex items-center gap-2 text-temple-maroon">
            <Calendar className="h-4 w-4" />
            <span>9 AM – 12 PM & 5 PM – 8 PM</span>
          </div>
          <Link
            href="/donate"
            className="flex items-center gap-2 text-temple-red font-semibold hover:underline"
          >
            <HeartHandshake className="h-4 w-4" />
            <span>Support the Temple</span>
          </Link>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            { value: "Est. 2022", label: "Serving the Community" },
            { value: "26+", label: "Vedic Services Offered" },
            { value: "2", label: "Experienced Priests" },
            { value: "12+", label: "Texas Cities Served" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-temple-red sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Panchangam Widget */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PanchangamWidget panchangam={samplePanchangam} compact />
      </section>

      {/* Service Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-heading">Our Services</h2>
            <p className="mt-3 text-gray-600">
              Book poojas, homams, and spiritual services online
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {sampleCategories.map((category) => (
              <Link
                key={category.id}
                href={`/services?category=${category.slug}`}
                className="card flex flex-col items-center gap-3 p-5 text-center hover:border-temple-gold group"
              >
                <span className="text-3xl transition-transform duration-200 group-hover:scale-110">
                  {category.icon}
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">
              Popular Services
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
                View All Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose RNHT */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-heading">Why Choose RNHT</h2>
            <p className="mt-3 text-gray-600">
              Trusted by families across Texas for authentic Vedic ceremonies
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div key={item.title} className="flex gap-4">
                <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />
                <div>
                  <h3 className="font-heading font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-temple-cream/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-heading">What Devotees Say</h2>
            <p className="mt-3 text-gray-600">
              Hear from families who have experienced our services
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card bg-white p-6">
                <Quote className="h-8 w-8 text-temple-gold/40" />
                <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-heading">Explore RNHT</h2>
            <p className="mt-3 text-gray-600">
              Discover everything our temple community has to offer
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Video,
                label: "Live Darshan",
                desc: "Watch daily aarti and special ceremonies",
                href: "/streaming",
                color: "bg-red-50 text-red-600",
              },
              {
                icon: Camera,
                label: "Gallery",
                desc: "Photos & videos from temple events",
                href: "/gallery",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: BookOpen,
                label: "Education",
                desc: "Vedic school, dance, music, and yoga",
                href: "/education",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: HeartHandshake,
                label: "Volunteer",
                desc: "Seva opportunities and Annadanam",
                href: "/community",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: Users,
                label: "Our Priests",
                desc: "Meet our learned priests",
                href: "/priests",
                color: "bg-amber-50 text-amber-600",
              },
              {
                icon: Gift,
                label: "Sponsorship",
                desc: "Festival & deity ornament sponsorship",
                href: "/sponsorship",
                color: "bg-pink-50 text-pink-600",
              },
              {
                icon: Star,
                label: "Dollar A Day",
                desc: "Support the temple daily for just $1",
                href: "/donate",
                color: "bg-yellow-50 text-yellow-600",
              },
              {
                icon: FileText,
                label: "Transparency",
                desc: "Financial statements and donor wall",
                href: "/transparency",
                color: "bg-teal-50 text-teal-600",
              },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="card flex items-start gap-4 p-5 hover:border-temple-gold group"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color} transition-transform duration-200 group-hover:scale-110`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="section-heading">Upcoming Events</h2>
              <p className="mt-2 text-gray-600">
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

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <MapPin className="mx-auto h-8 w-8 text-temple-red" />
            <h2 className="mt-4 section-heading">Serving All of Texas</h2>
            <p className="mt-3 text-gray-600">
              Our priests travel to your home, office, or venue across the greater Texas area
            </p>
          </div>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
            {[
              "Austin", "Kyle", "Manor", "Round Rock", "Georgetown", "Lakeway",
              "Bee Cave", "Leander", "Dripping Springs", "San Antonio",
              "Dallas", "Houston", "Lago Vista", "Liberty Hill",
            ].map((city) => (
              <span
                key={city}
                className="rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dollar A Day CTA */}
      <section className="py-16 bg-gradient-to-r from-temple-gold/10 to-temple-cream">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Star className="mx-auto h-8 w-8 text-temple-gold" />
          <h2 className="mt-4 section-heading">Dollar A Day</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Make a lasting impact with just $1 a day. Your recurring donation
            helps maintain daily temple operations, support priests, and serve
            the community.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary">
              $31/month — Join Now
            </Link>
            <Link href="/donate" className="btn-secondary">
              $365/year — Save $7
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            All donations are tax-deductible under 501(c)(3). Cancel anytime.
          </p>
        </div>
      </section>

      {/* Final CTA — WhatsApp + Donate */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-temple-maroon to-temple-red p-8 text-center sm:p-12">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Ready to Book a Pooja?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-gray-200">
              Contact us via WhatsApp for quick booking, or browse our services
              online. We serve the entire Austin metro and greater Texas area.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/message/55G67NQ6CQENA1"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary bg-green-600 text-white hover:bg-green-700"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp: (512) 545-0473
              </a>
              <Link href="/donate" className="btn-primary bg-temple-gold text-temple-maroon hover:bg-temple-gold-light">
                Donate Now
              </Link>
              <Link href="/services" className="btn-primary bg-white/10 text-white backdrop-blur hover:bg-white/20">
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
