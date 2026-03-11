import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Globe,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

const priests = [
  {
    id: "priest-1",
    name: "Pandit Venkata Sharma",
    title: "Head Priest",
    image: null,
    initials: "VS",
    experience: "25+ years",
    specialization: "Vedic Rituals, Homams, Kalyanotsavams",
    languages: ["Telugu", "Sanskrit", "Hindi", "English"],
    education: "Shastra Vidwan — Sri Venkateswara Vedic University, Tirupati",
    bio: "Pandit Sharma brings over 25 years of experience in performing Vedic rituals with deep knowledge of Yajur Veda, Sama Veda, and various Agama traditions. He has performed 900+ house inaugurations and 500+ wedding ceremonies across the United States.",
    services: ["All Homams & Havans", "Wedding Ceremonies", "Gruhapravesam", "Navagraha Shanti", "Satyanarayana Vratam", "Muhoortham Calculation"],
    availability: { atTemple: true, outsideTemple: true, online: false },
    phone: "(512) 545-0473",
    email: "priest@rnht.org",
    stats: { ceremonies: "2,500+", weddings: "500+", homams: "900+" },
  },
  {
    id: "priest-2",
    name: "Pandit Ramesh Iyer",
    title: "Associate Priest",
    image: null,
    initials: "RI",
    experience: "18+ years",
    specialization: "Abhishekams, Archana, Temple Poojas",
    languages: ["Tamil", "Sanskrit", "English"],
    education: "Agama Shastra — Madurai Adheenam",
    bio: "Pandit Iyer specializes in temple rituals with deep expertise in Agama Shastra traditions. His melodious chanting and meticulous attention to ritual details make every ceremony a divine experience. He is especially known for elaborate deity Abhishekams.",
    services: ["All Temple Poojas", "Abhishekams", "Archana", "Deity Alankaram", "Festival Ceremonies", "Vrata & Katha"],
    availability: { atTemple: true, outsideTemple: true, online: false },
    phone: "(512) 545-0473",
    email: "priest@rnht.org",
    stats: { ceremonies: "1,800+", abhishekams: "3,000+", festivals: "200+" },
  },
  {
    id: "priest-3",
    name: "Jyotish Acharya Subramaniam",
    title: "Vedic Astrologer",
    image: null,
    initials: "SA",
    experience: "20+ years",
    specialization: "Jyotish Shastra, Vastu, Muhoortham",
    languages: ["Telugu", "Hindi", "Sanskrit", "English"],
    education: "Jyotish Acharya — Banaras Hindu University",
    bio: "Acharya Subramaniam is a renowned Vedic astrologer with deep expertise in Jyotish Shastra, Vastu Shastra, and Muhoortham calculations. He provides personalized horoscope readings, compatibility analysis for marriages, and Vastu consultations for homes and businesses.",
    services: ["Horoscope Reading", "Kundali Matching", "Muhoortham Calculation", "Vastu Consultation", "Navagraha Remedies", "Yantra Pooja"],
    availability: { atTemple: true, outsideTemple: true, online: true },
    phone: "(512) 545-0473",
    email: "astrology@rnht.org",
    stats: { consultations: "5,000+", muhoorthams: "1,200+", vastu: "300+" },
  },
];

export default function PriestsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <BookOpen className="mx-auto h-10 w-10 text-temple-red" />
        <h1 className="mt-4 section-heading">Our Priests</h1>
        <p className="mt-3 mx-auto max-w-2xl text-gray-600">
          Our learned priests bring decades of Vedic knowledge and experience.
          Available for temple services, home ceremonies, and online consultations.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        {priests.map((priest) => (
          <div key={priest.id} className="card overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left — Profile */}
              <div className="flex flex-col items-center bg-gradient-to-b from-temple-cream to-white p-8 md:w-72">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-temple-red text-3xl font-heading font-bold text-white">
                  {priest.initials}
                </div>
                <h2 className="mt-4 text-center font-heading text-xl font-bold text-gray-900">
                  {priest.name}
                </h2>
                <p className="text-sm text-temple-red font-semibold">{priest.title}</p>
                <p className="mt-1 text-xs text-gray-500">{priest.experience} experience</p>

                <div className="mt-4 flex flex-wrap justify-center gap-1">
                  {priest.languages.map((lang) => (
                    <span key={lang} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                      {lang}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {Object.entries(priest.stats).map(([key, val]) => (
                    <div key={key}>
                      <p className="text-lg font-bold text-temple-maroon">{val}</p>
                      <p className="text-[10px] text-gray-500 capitalize">{key}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-500 w-full">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {priest.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {priest.email}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {priest.availability.atTemple && (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Temple
                    </span>
                  )}
                  {priest.availability.outsideTemple && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Home
                    </span>
                  )}
                  {priest.availability.online && (
                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700 flex items-center gap-1">
                      <Globe className="h-3 w-3" /> Online
                    </span>
                  )}
                </div>
              </div>

              {/* Right — Details */}
              <div className="flex-1 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Education
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{priest.education}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Specialization
                  </p>
                  <p className="mt-1 text-sm text-gray-700">{priest.specialization}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    About
                  </p>
                  <p className="mt-1 text-sm text-gray-600 leading-relaxed">{priest.bio}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Services Offered
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {priest.services.map((service) => (
                      <span key={service} className="rounded-lg bg-temple-cream px-3 py-1 text-xs font-medium text-temple-maroon">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <Link
                    href="/services"
                    className="btn-primary text-sm"
                  >
                    Book with {priest.name.split(" ")[1]}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
