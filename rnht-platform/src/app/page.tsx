import Link from "next/link";
import {
  sampleCategories,
  sampleServices,
  sampleEvents,
  samplePanchangam,
} from "@/lib/sample-data";
import { ServiceCard } from "@/components/services/ServiceCard";
import { PanchangamWidget } from "@/components/panchangam/PanchangamWidget";
import { EventCard } from "@/components/calendar/EventCard";
import {
  BookOpen,
  HeartHandshake,
  Video,
  Users,
  Camera,
  FileText,
  Gift,
  Star,
} from "lucide-react";

export default function HomePage() {
  const featuredServices = sampleServices.slice(0, 4);
  const upcomingEvents = sampleEvents
    .filter((e) => !e.is_recurring)
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-temple-maroon via-temple-red-dark to-temple-red">
        <div className="absolute inset-0 bg-[url('/om-pattern.svg')] opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Rudra Narayana
              <span className="block text-temple-gold-light">Hindu Temple</span>
            </h1>
            <p className="mt-6 text-lg text-gray-200">
              Your spiritual home in Las Vegas. Experience the divine through
              traditional Vedic rituals, community programs, and daily worship
              services.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/services" className="btn-primary bg-temple-gold text-temple-maroon hover:bg-temple-gold-light">
                Book a Pooja
              </Link>
              <Link href="/streaming" className="btn-primary bg-white/10 text-white backdrop-blur hover:bg-white/20">
                Live Darshan
              </Link>
              <Link href="/calendar" className="btn-primary bg-white/10 text-white backdrop-blur hover:bg-white/20">
                View Calendar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="border-b border-gray-200 bg-temple-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-4 text-sm sm:gap-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-temple-maroon">
            <span className="text-lg">🙏</span>
            <span>
              <strong>Temple Hours:</strong> 9 AM - 12 PM & 5 PM - 8 PM
            </span>
          </div>
          <div className="flex items-center gap-2 text-temple-maroon">
            <span className="text-lg">📞</span>
            <span>
              <strong>Phone:</strong> (512) 545-0473
            </span>
          </div>
          <Link
            href="/donate"
            className="flex items-center gap-2 text-temple-red font-semibold hover:underline"
          >
            <span className="text-lg">❤️</span>
            <span>Support the Temple</span>
          </Link>
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
                className="card flex flex-col items-center gap-3 p-5 text-center hover:border-temple-gold"
              >
                <span className="text-3xl">{category.icon}</span>
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
              <Link href="/services" className="btn-secondary">
                View All Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links — New Features */}
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
              { icon: Video, label: "Live Darshan", desc: "Watch daily aarti and special ceremonies", href: "/streaming", color: "bg-red-50 text-red-600" },
              { icon: Camera, label: "Gallery", desc: "Photos & videos from temple events", href: "/gallery", color: "bg-purple-50 text-purple-600" },
              { icon: BookOpen, label: "Education", desc: "Vedic school, dance, music, and yoga", href: "/education", color: "bg-blue-50 text-blue-600" },
              { icon: HeartHandshake, label: "Volunteer", desc: "Seva opportunities and Annadanam", href: "/community", color: "bg-green-50 text-green-600" },
              { icon: Users, label: "Our Priests", desc: "Meet our learned priests", href: "/priests", color: "bg-amber-50 text-amber-600" },
              { icon: Gift, label: "Sponsorship", desc: "Festival & deity ornament sponsorship", href: "/sponsorship", color: "bg-pink-50 text-pink-600" },
              { icon: Star, label: "Dollar A Day", desc: "Support the temple daily for just $1", href: "/donate", color: "bg-yellow-50 text-yellow-600" },
              { icon: FileText, label: "Transparency", desc: "Financial statements and donor wall", href: "/transparency", color: "bg-teal-50 text-teal-600" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="card flex items-start gap-4 p-5 hover:border-temple-gold"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
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
            <Link href="/calendar" className="btn-outline hidden sm:inline-flex">
              Full Calendar
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

      {/* Dollar A Day CTA */}
      <section className="py-16 bg-gradient-to-r from-temple-gold/10 to-temple-cream">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Star className="mx-auto h-8 w-8 text-temple-gold" />
          <h2 className="mt-4 section-heading">Dollar A Day</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Make a lasting impact with just $1 a day. Your recurring donation helps
            maintain daily temple operations, support priests, and serve the community.
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

      {/* Donation CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="section-heading">Support Our Temple</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Your generous contributions help maintain the temple, support
            community programs, and preserve our sacred traditions. All donations
            are tax-deductible under 501(c)(3).
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/donate" className="btn-primary">
              Donate Now
            </Link>
            <Link href="/donate#zelle" className="btn-secondary">
              Donate via Zelle
            </Link>
            <Link href="/sponsorship" className="btn-outline">
              Sponsorship Options
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
