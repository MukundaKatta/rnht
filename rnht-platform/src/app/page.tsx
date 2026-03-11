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

      {/* Upcoming Events */}
      <section className="py-16">
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

      {/* Donation CTA */}
      <section className="bg-gradient-to-r from-temple-gold/10 to-temple-cream py-16">
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
          </div>
        </div>
      </section>
    </div>
  );
}
