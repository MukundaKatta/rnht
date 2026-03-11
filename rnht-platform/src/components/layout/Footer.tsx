import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="font-heading text-lg font-bold text-temple-maroon">
              Rudra Narayana Hindu Temple
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              A sacred haven for devotees seeking spiritual growth, peace, and
              connection with the divine. Serving the Austin, Texas area with
              traditional weddings, pujas, and other rituals.
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p className="font-semibold text-gray-700">Austin, Texas</p>
              <a
                href="https://wa.me/message/55G67NQ6CQENA1"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-700 hover:text-green-800"
              >
                Pt. Aditya Sharma: (512) 545-0473 (WhatsApp)
              </a>
              <a href="tel:+15129980122" className="block hover:text-gray-700">
                Pt. Raghurama Sharma: (512) 998-0122
              </a>
              <a href="mailto:femtomax.inc@gmail.com" className="block hover:text-gray-700">
                femtomax.inc@gmail.com
              </a>
            </div>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-800">
              501(c)(3) Registered Nonprofit
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Services</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/services" className="text-sm text-gray-600 hover:text-temple-red">Book a Pooja</Link></li>
              <li><Link href="/services?category=homam-havan" className="text-sm text-gray-600 hover:text-temple-red">Homam / Havan</Link></li>
              <li><Link href="/sponsorship" className="text-sm text-gray-600 hover:text-temple-red">Sponsorship & Packages</Link></li>
              <li><Link href="/priests" className="text-sm text-gray-600 hover:text-temple-red">Our Priests</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Temple</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/panchangam" className="text-sm text-gray-600 hover:text-temple-red">Daily Panchangam</Link></li>
              <li><Link href="/calendar" className="text-sm text-gray-600 hover:text-temple-red">Events Calendar</Link></li>
              <li><Link href="/streaming" className="text-sm text-gray-600 hover:text-temple-red">Live Darshan</Link></li>
              <li><Link href="/gallery" className="text-sm text-gray-600 hover:text-temple-red">Gallery</Link></li>
              <li><Link href="/donate" className="text-sm text-gray-600 hover:text-temple-red">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Community</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/community" className="text-sm text-gray-600 hover:text-temple-red">Volunteer</Link></li>
              <li><Link href="/education" className="text-sm text-gray-600 hover:text-temple-red">Education & Classes</Link></li>
              <li><Link href="/transparency" className="text-sm text-gray-600 hover:text-temple-red">Financial Transparency</Link></li>
              <li><Link href="/about" className="text-sm text-gray-600 hover:text-temple-red">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-600 hover:text-temple-red">Contact Us</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-600 hover:text-temple-red">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-600 hover:text-temple-red">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Rudra Narayana Hindu Temple. All
            rights reserved.
          </p>
          <p className="mt-1">
            A 501(c)(3) nonprofit organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
