import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-temple-maroon-deep via-[#1F030A] to-[#150207] text-white overflow-hidden" role="contentinfo">
      {/* Premium double gold line */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-temple-gold to-transparent" />
      <div className="h-px bg-gradient-to-r from-transparent via-temple-gold/30 to-transparent" />

      {/* Decorative gold corner ornaments */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-2 border-l-2 border-temple-gold/15 rounded-tl-xl hidden lg:block" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-temple-gold/15 rounded-tr-xl hidden lg:block" />

      {/* Subtle gold radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-radial-gradient opacity-[0.04]" style={{ background: "radial-gradient(ellipse, rgba(197,151,62,0.15), transparent 70%)" }} />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            {/* Om Symbol + Temple Name */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl text-temple-gold/60">&#x0950;</span>
              <h3 className="font-heading text-xl font-bold text-gold-gradient">
                Rudra Narayana Hindu Temple
              </h3>
            </div>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed font-accent">
              A sacred haven for devotees seeking spiritual growth, peace, and
              connection with the divine. Serving the Austin, Texas area with
              traditional weddings, pujas, and other rituals.
            </p>
            <div className="mt-5 space-y-2 text-sm text-gray-400">
              <p className="font-semibold text-white">Austin, Texas</p>
              <a
                href="https://wa.me/message/55G67NQ6CQENA1"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-400 hover:text-green-300 transition-colors"
              >
                Pt. Aditya Sharma: (512) 545-0473 (WhatsApp)
              </a>
              <a href="tel:+15129980122" className="block hover:text-gray-200 transition-colors">
                Pt. Raghurama Sharma: (512) 998-0122
              </a>
              <a href="mailto:femtomax.inc@gmail.com" className="block hover:text-gray-200 transition-colors">
                femtomax.inc@gmail.com
              </a>
            </div>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-temple-gold/10 border border-temple-gold/20 px-3 py-1.5 text-xs font-medium text-temple-gold-light">
              501(c)(3) Registered Nonprofit
            </p>
          </div>

          <div>
            <h4 className="text-sm font-heading font-semibold text-temple-gold-light tracking-wide uppercase flex items-center gap-2"><span className="inline-block w-6 h-px bg-gradient-to-r from-temple-gold/50 to-transparent" />Services</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/services" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">
                  Book a Pooja
                </Link>
              </li>
              <li>
                <Link href="/services?category=homam-havan" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">
                  Homam / Havan
                </Link>
              </li>
              <li>
                <Link href="/sponsorship" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">
                  Sponsorship &amp; Packages
                </Link>
              </li>
              <li>
                <Link href="/priests" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">
                  Our Priests
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-heading font-semibold text-temple-gold-light tracking-wide uppercase flex items-center gap-2"><span className="inline-block w-6 h-px bg-gradient-to-r from-temple-gold/50 to-transparent" />Temple</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/panchangam" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Daily Panchangam</Link></li>
              <li><Link href="/calendar" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Events Calendar</Link></li>
              <li><Link href="/streaming" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Live Darshan</Link></li>
              <li><Link href="/gallery" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Gallery</Link></li>
              <li><Link href="/donate" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Donate</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-heading font-semibold text-temple-gold-light tracking-wide uppercase flex items-center gap-2"><span className="inline-block w-6 h-px bg-gradient-to-r from-temple-gold/50 to-transparent" />Community</h4>
            <ul className="mt-4 space-y-3">
              <li><Link href="/community" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Volunteer</Link></li>
              <li><Link href="/education" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Education &amp; Classes</Link></li>
              <li><Link href="/transparency" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Financial Transparency</Link></li>
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-400 hover:text-temple-gold-light transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Sanskrit Shloka */}
        <div className="mt-12 text-center">
          <p className="font-accent text-sm italic text-temple-gold/40 tracking-wide">
            &ldquo;Dharmo Rakshati Rakshitaha&rdquo;
          </p>
          <p className="text-xs text-gray-600 mt-1 font-accent">Dharma protects those who protect Dharma</p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-temple-gold/10 pt-8 flex flex-col items-center gap-3">
          {/* Decorative Om */}
          <span className="text-xl text-temple-gold/20">&#x0950;</span>
          <p className="text-sm text-gray-500 font-accent">
            &copy; {new Date().getFullYear()} Rudra Narayana Hindu Temple. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 font-accent">
            A 501(c)(3) nonprofit organization &middot; Tax ID available upon request
          </p>
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="h-px bg-gradient-to-r from-transparent via-temple-gold/20 to-transparent" />
    </footer>
  );
}
