import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-heading text-lg font-bold text-temple-maroon">
              Rudra Narayana Hindu Temple
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Serving the Hindu community in Las Vegas with devotion, tradition,
              and spiritual guidance.
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Las Vegas, Nevada
              <br />
              Phone: (512) 545-0473
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Services</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Book a Pooja
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=homam-havan"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Homam / Havan
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=astrology-vastu"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Astrology & Vastu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Temple</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/panchangam"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Daily Panchangam
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Connect</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://rnht.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Website
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@rnht.org"
                  className="text-sm text-gray-600 hover:text-temple-red"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Rudra Narayana Hindu Temple. All
            rights reserved.
          </p>
          <p className="mt-1">
            A 501(c)(3) nonprofit organization. EIN: XX-XXXXXXX
          </p>
        </div>
      </div>
    </footer>
  );
}
