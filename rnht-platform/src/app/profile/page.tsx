"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Users,
  Calendar,
  Heart,
  Star,
  Bell,
  Settings,
  Plus,
  Trash2,
  Download,
  BookOpen,
  Clock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type Tab = "profile" | "family" | "bookings" | "donations" | "preferences";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "My Profile", icon: User },
  { id: "family", label: "Family", icon: Users },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "donations", label: "Donations", icon: Heart },
  { id: "preferences", label: "Preferences", icon: Settings },
];

const nakshatras = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni",
  "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha",
  "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana",
  "Dhanishtha", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const rashis = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)",
  "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)",
  "Tula (Libra)", "Vrischika (Scorpio)", "Dhanu (Sagittarius)",
  "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)",
];

const sampleBookings = [
  { id: "BK-2026-001", service: "Ganapathi Homam", date: "2026-03-15", time: "10:00 AM", status: "confirmed" as const, amount: 101, priest: "Pandit Sharma" },
  { id: "BK-2026-002", service: "Abhishekam", date: "2026-03-20", time: "9:00 AM", status: "pending" as const, amount: 51, priest: "Pandit Sharma" },
  { id: "BK-2025-015", service: "Satyanarayana Vratam", date: "2025-12-25", time: "10:00 AM", status: "completed" as const, amount: 51, priest: "Pandit Iyer" },
  { id: "BK-2025-010", service: "Archana", date: "2025-11-14", time: "11:00 AM", status: "completed" as const, amount: 11, priest: "Pandit Sharma" },
];

const sampleDonations = [
  { id: "DN-2026-001", fund: "General Temple Fund", date: "2026-03-01", amount: 101, method: "Stripe", recurring: true },
  { id: "DN-2026-002", fund: "Annadanam Fund", date: "2026-02-15", amount: 51, method: "Zelle", recurring: false },
  { id: "DN-2025-010", fund: "Festival Fund", date: "2025-10-20", amount: 251, method: "Stripe", recurring: false },
  { id: "DN-2025-005", fund: "Building Fund", date: "2025-08-01", amount: 501, method: "PayPal", recurring: false },
];

type FamilyMember = {
  id: string;
  name: string;
  relationship: string;
  gotra: string;
  nakshatra: string;
  rashi: string;
  dob: string;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "fm-1", name: "Priya Sharma", relationship: "Spouse", gotra: "Bharadwaja", nakshatra: "Rohini", rashi: "Vrishabha (Taurus)", dob: "1992-06-15" },
    { id: "fm-2", name: "Aarav Sharma", relationship: "Son", gotra: "Bharadwaja", nakshatra: "Pushya", rashi: "Karka (Cancer)", dob: "2018-03-22" },
  ]);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<"all" | "upcoming" | "completed">("all");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRelationship, setNewMemberRelationship] = useState("");
  const [newMemberGotra, setNewMemberGotra] = useState("");
  const [newMemberNakshatra, setNewMemberNakshatra] = useState("");
  const [newMemberRashi, setNewMemberRashi] = useState("");
  const [newMemberDob, setNewMemberDob] = useState("");
  const [bookings, setBookings] = useState(sampleBookings);

  const closeAddFamily = () => {
    setShowAddFamily(false);
    setNewMemberName("");
    setNewMemberRelationship("");
    setNewMemberGotra("");
    setNewMemberNakshatra("");
    setNewMemberRashi("");
    setNewMemberDob("");
  };

  const addFamilyMember = () => {
    if (!newMemberName.trim() || !newMemberRelationship) return;
    setFamilyMembers((prev) => [...prev, {
      id: `fm-${Date.now()}`,
      name: newMemberName.trim(),
      relationship: newMemberRelationship,
      gotra: newMemberGotra,
      nakshatra: newMemberNakshatra,
      rashi: newMemberRashi,
      dob: newMemberDob,
    }]);
    closeAddFamily();
  };

  const filteredBookings = bookingFilter === "all"
    ? bookings
    : bookings.filter((b) => bookingFilter === "upcoming" ? b.status !== "completed" : b.status === "completed");

  const totalDonated = sampleDonations.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-temple-red text-3xl font-heading font-bold text-white">
          RS
        </div>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Rajesh Sharma
          </h1>
          <p className="text-gray-600">rajesh.sharma@email.com | +1 (555) 123-4567</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-temple-cream px-3 py-1 text-xs font-medium text-temple-maroon">
              <Star className="h-3 w-3" /> Gotra: Bharadwaja
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Nakshatra: Pushya
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              Rashi: Karka
            </span>
          </div>
        </div>
        <Link href="/login" className="btn-outline text-sm">
          Sign Out
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-temple-red">{sampleBookings.length}</p>
          <p className="text-xs text-gray-500">Total Bookings</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalDonated)}</p>
          <p className="text-xs text-gray-500">Total Donated</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{familyMembers.length}</p>
          <p className="text-xs text-gray-500">Family Members</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-temple-gold">12</p>
          <p className="text-xs text-gray-500">Seva Points</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-temple-red shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="card p-6">
            <h2 className="font-heading text-lg font-bold text-gray-900">
              Personal Details
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" className="input-field mt-1" defaultValue="Rajesh Sharma" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="input-field mt-1" defaultValue="rajesh.sharma@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" className="input-field mt-1" defaultValue="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" className="input-field mt-1" defaultValue="1990-01-15" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" className="input-field mt-1" defaultValue="123 Desert View Dr, Las Vegas, NV 89101" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gotra</label>
                <input type="text" className="input-field mt-1" defaultValue="Bharadwaja" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nakshatra</label>
                <select className="input-field mt-1" defaultValue="Pushya">
                  <option value="">Select...</option>
                  {nakshatras.map((n) => (<option key={n} value={n}>{n}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rashi</label>
                <select className="input-field mt-1" defaultValue="Karka (Cancer)">
                  <option value="">Select...</option>
                  {rashis.map((r) => (<option key={r} value={r}>{r}</option>))}
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button className="btn-primary" onClick={() => { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 3000); }}>
                {profileSaved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* Family Tab */}
        {activeTab === "family" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Add family members for quick Sankalp during pooja bookings.
              </p>
              <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowAddFamily(true)}>
                <Plus className="h-4 w-4" /> Add Member
              </button>
            </div>
            {familyMembers.map((member) => (
              <div key={member.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                  </div>
                  <button onClick={() => setFamilyMembers((prev) => prev.filter((m) => m.id !== member.id))} className="rounded p-1 text-gray-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
                  <div><span className="text-gray-500">Gotra:</span> <span className="font-medium">{member.gotra}</span></div>
                  <div><span className="text-gray-500">Nakshatra:</span> <span className="font-medium">{member.nakshatra}</span></div>
                  <div><span className="text-gray-500">Rashi:</span> <span className="font-medium">{member.rashi}</span></div>
                  <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{member.dob}</span></div>
                </div>
              </div>
            ))}
            {/* Spiritual Milestones */}
            <div className="card p-5">
              <h3 className="font-heading text-lg font-bold text-gray-900">
                Family Spiritual Dashboard
              </h3>
              <p className="mt-1 text-sm text-gray-500">Track spiritual milestones for your family</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-green-50 p-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">Aarav&apos;s Aksharabhyasam</p>
                    <p className="text-xs text-green-700">Completed on March 15, 2023</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600">Done</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">Aarav&apos;s Upanayanam</p>
                    <p className="text-xs text-amber-700">Upcoming — consult priest for Muhoortham</p>
                  </div>
                  <Link href="/services?category=astrology-vastu" className="text-xs font-semibold text-temple-red hover:underline">Book</Link>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Rajesh&apos;s Shasti Poorthi (60th Birthday)</p>
                    <p className="text-xs text-gray-500">In 2050 — we&apos;ll remind you when it&apos;s time!</p>
                  </div>
                </div>
              </div>
            </div>
            {showAddFamily && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) closeAddFamily(); }}>
                <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                  <h3 className="font-heading text-lg font-bold">Add Family Member</h3>
                  <div className="mt-4 space-y-3">
                    <input type="text" className="input-field" placeholder="Full Name *" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} />
                    <select className="input-field" value={newMemberRelationship} onChange={(e) => setNewMemberRelationship(e.target.value)}>
                      <option value="">Relationship *</option>
                      <option>Spouse</option><option>Son</option><option>Daughter</option>
                      <option>Father</option><option>Mother</option><option>Other</option>
                    </select>
                    <input type="text" className="input-field" placeholder="Gotra" value={newMemberGotra} onChange={(e) => setNewMemberGotra(e.target.value)} />
                    <select className="input-field" value={newMemberNakshatra} onChange={(e) => setNewMemberNakshatra(e.target.value)}>
                      <option value="">Nakshatra</option>
                      {nakshatras.map((n) => (<option key={n} value={n}>{n}</option>))}
                    </select>
                    <select className="input-field" value={newMemberRashi} onChange={(e) => setNewMemberRashi(e.target.value)}>
                      <option value="">Rashi</option>
                      {rashis.map((r) => (<option key={r} value={r}>{r}</option>))}
                    </select>
                    <input type="date" className="input-field" value={newMemberDob} onChange={(e) => setNewMemberDob(e.target.value)} />
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button className="btn-outline" onClick={closeAddFamily}>Cancel</button>
                    <button className="btn-primary" disabled={!newMemberName.trim() || !newMemberRelationship} onClick={addFamilyMember}>Add Member</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["all", "upcoming", "completed"] as const).map((f) => (
                <button key={f} onClick={() => setBookingFilter(f)} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${bookingFilter === f ? "bg-temple-red text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                    <p className="text-sm text-gray-500">{booking.id} | Priest: {booking.priest}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                    booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {booking.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {booking.time}</span>
                  <span className="font-semibold text-temple-red">{formatCurrency(booking.amount)}</span>
                </div>
                {booking.status === "confirmed" && (
                  <div className="mt-3 flex gap-2">
                    <a href={`https://wa.me/15125450473?text=${encodeURIComponent(`Namaste! I need to reschedule my booking ${booking.id} (${booking.service}) on ${booking.date}. Please help.`)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Reschedule</a>
                    <button className="text-xs text-red-600 hover:underline" onClick={() => { if (confirm(`Cancel booking ${booking.id}?`)) setBookings((prev) => prev.map((b) => b.id === booking.id ? { ...b, status: "completed" as const } : b)); }}>Cancel</button>
                  </div>
                )}
                {booking.status === "completed" && (
                  <Link href="/services" className="mt-2 inline-block text-xs text-temple-red hover:underline">Rebook this service</Link>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            <div className="card bg-gradient-to-r from-green-50 to-emerald-50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Donations (2025-2026)</p>
                  <p className="text-3xl font-bold text-green-700">{formatCurrency(totalDonated)}</p>
                  <p className="mt-1 text-xs text-gray-500">Tax-deductible under 501(c)(3)</p>
                </div>
                <a href="https://wa.me/15125450473?text=Namaste!%20I%20would%20like%20to%20request%20my%20tax%20summary%20for%202025-2026.%20Please%20share." target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4" /> Tax Summary
                </a>
              </div>
            </div>
            {sampleDonations.map((d) => (
              <div key={d.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{d.fund}</h3>
                    <p className="text-sm text-gray-500">{d.id} | via {d.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(d.amount)}</p>
                    {d.recurring && <span className="text-xs text-blue-600">Monthly</span>}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" /> {d.date}
                  <a href={`https://wa.me/15125450473?text=${encodeURIComponent(`Namaste! I would like the donation receipt for ${d.id} (${d.fund}, ${formatCurrency(d.amount)}).`)}`} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-temple-red hover:underline">Download Receipt</a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div className="card p-5">
              <h3 className="font-heading text-lg font-bold text-gray-900">Preferred Language</h3>
              <select className="input-field mt-3 max-w-xs">
                <option>English</option>
                <option>Telugu</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Kannada</option>
                <option>Marathi</option>
                <option>Malayalam</option>
                <option>Gujarati</option>
                <option>Bengali</option>
                <option>Punjabi</option>
              </select>
            </div>
            <div className="card p-5">
              <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                <Bell className="h-5 w-5" /> Communication Preferences
              </h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Push Notifications", desc: "Daily panchangam, event reminders, booking updates" },
                  { label: "Email Notifications", desc: "Booking confirmations, donation receipts, newsletters" },
                  { label: "SMS Alerts", desc: "Booking reminders, festival alerts" },
                  { label: "WhatsApp Updates", desc: "Temple announcements, community news" },
                ].map((item) => (
                  <label key={item.label} className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1 rounded text-temple-red" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-heading text-lg font-bold text-gray-900 flex items-center gap-2">
                <Star className="h-5 w-5" /> Spiritual Preferences
              </h3>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Deities</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Lord Ganesha", "Lord Vishnu", "Lord Shiva", "Goddess Lakshmi", "Lord Hanuman", "Lord Rama"].map((deity) => (
                      <label key={deity} className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm">
                        <input type="checkbox" className="rounded text-temple-red" />
                        {deity}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dietary Restrictions (for Prasadam)</label>
                  <select className="input-field mt-1 max-w-xs">
                    <option>None</option>
                    <option>Vegan</option>
                    <option>No Nuts</option>
                    <option>No Dairy</option>
                    <option>Gluten Free</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="card border-red-200 p-5">
              <h3 className="font-heading text-lg font-bold text-red-700">Data & Privacy</h3>
              <p className="mt-2 text-sm text-gray-600">
                You can export or delete your data at any time. GDPR compliant.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="https://wa.me/15125450473?text=Namaste!%20I%20would%20like%20to%20request%20an%20export%20of%20my%20data.%20Please%20assist." target="_blank" rel="noopener noreferrer" className="btn-outline text-sm flex items-center gap-2">
                  <Download className="h-4 w-4" /> Export My Data
                </a>
                <a href="https://wa.me/15125450473?text=Namaste!%20I%20would%20like%20to%20request%20account%20deletion.%20Please%20assist." target="_blank" rel="noopener noreferrer" className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Delete Account
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
