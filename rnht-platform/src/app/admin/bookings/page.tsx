"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const bookings = [
  { id: "RNHT-A1B2C", service: "Ganapathi Homam", devotee: "Ramesh Kumar", email: "ramesh@email.com", phone: "(555) 111-2222", date: "2026-03-15", time: "10:00 AM", amount: 101, status: "confirmed", gotra: "Bharadwaja", nakshatra: "Ashwini" },
  { id: "RNHT-D3E4F", service: "Abhishekam", devotee: "Lakshmi Devi", email: "lakshmi@email.com", phone: "(555) 333-4444", date: "2026-03-14", time: "11:00 AM", amount: 51, status: "confirmed", gotra: "Kashyapa", nakshatra: "Rohini" },
  { id: "RNHT-G5H6I", service: "Archana", devotee: "Suresh Patel", email: "suresh@email.com", phone: "(555) 555-6666", date: "2026-03-13", time: "9:00 AM", amount: 11, status: "completed", gotra: "Vasishtha", nakshatra: "Pushya" },
  { id: "RNHT-J7K8L", service: "Gruhapravesam (Standard)", devotee: "Priya Sharma", email: "priya@email.com", phone: "(555) 777-8888", date: "2026-03-16", time: "9:00 AM", amount: 351, status: "pending", gotra: "Atri", nakshatra: "Uttara" },
  { id: "RNHT-M9N0O", service: "Satyanarayana Vratam", devotee: "Venkat Rao", email: "venkat@email.com", phone: "(555) 999-0000", date: "2026-03-12", time: "10:00 AM", amount: 51, status: "completed", gotra: "Gautama", nakshatra: "Swati" },
  { id: "RNHT-P1Q2R", service: "Navagraha Homam", devotee: "Anitha Reddy", email: "anitha@email.com", phone: "(555) 123-4567", date: "2026-03-17", time: "9:00 AM", amount: 151, status: "confirmed", gotra: "Jamadagni", nakshatra: "Moola" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminBookingsPage() {
  const [bookingsData, setBookingsData] = useState(bookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<
    (typeof bookings)[0] | null
  >(null);

  // Escape key handler and body scroll lock for booking modal
  useEffect(() => {
    if (!selectedBooking) return;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedBooking(null);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [selectedBooking]);

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    setBookingsData((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    setSelectedBooking((prev) =>
      prev && prev.id === bookingId ? { ...prev, status: newStatus } : prev
    );
  };

  const filteredBookings = bookingsData.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (
      searchQuery &&
      !b.devotee.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.service.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-temple-red"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Note:</strong> Showing sample data. Real booking data integration coming soon.
      </div>

      <h1 className="mt-4 section-heading">Booking Management</h1>

      {/* Search & Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or service..."
            className="input-field pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="input-field w-40"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Booking ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                Devotee
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-900">
                  {booking.id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {booking.service}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                  {booking.devotee}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">
                  {booking.date} at {booking.time}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                  {formatCurrency(booking.amount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[booking.status]}`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className="text-sm text-temple-red hover:underline"
                    aria-label={`View booking ${booking.id}`}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" onClick={() => setSelectedBooking(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-gray-900">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500">Booking ID</span>
                  <p className="font-mono font-semibold">
                    {selectedBooking.id}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Status</span>
                  <p>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[selectedBooking.status]}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </p>
                </div>
              </div>
              <hr />
              <div>
                <span className="text-gray-500">Service</span>
                <p className="font-semibold">{selectedBooking.service}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500">Date</span>
                  <p>{selectedBooking.date}</p>
                </div>
                <div>
                  <span className="text-gray-500">Time</span>
                  <p>{selectedBooking.time}</p>
                </div>
              </div>
              <hr />
              <div>
                <span className="text-gray-500">Devotee</span>
                <p className="font-semibold">{selectedBooking.devotee}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500">Email</span>
                  <p>{selectedBooking.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Phone</span>
                  <p>{selectedBooking.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500">Gotra</span>
                  <p>{selectedBooking.gotra}</p>
                </div>
                <div>
                  <span className="text-gray-500">Nakshatra</span>
                  <p>{selectedBooking.nakshatra}</p>
                </div>
              </div>
              <hr />
              <div>
                <span className="text-gray-500">Amount</span>
                <p className="text-xl font-bold text-temple-red">
                  {formatCurrency(selectedBooking.amount)}
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              {selectedBooking.status === "pending" && (
                <button
                  className="btn-primary flex-1"
                  onClick={() => updateBookingStatus(selectedBooking.id, "confirmed")}
                >
                  Confirm
                </button>
              )}
              {selectedBooking.status === "confirmed" && (
                <button
                  className="btn-primary flex-1"
                  onClick={() => updateBookingStatus(selectedBooking.id, "completed")}
                >
                  Mark Completed
                </button>
              )}
              {selectedBooking.status !== "cancelled" &&
                selectedBooking.status !== "completed" && (
                  <button
                    className="btn-outline flex-1 text-red-600 border-red-300 hover:bg-red-50"
                    onClick={() => updateBookingStatus(selectedBooking.id, "cancelled")}
                  >
                    Cancel
                  </button>
                )}
              <button
                className="btn-outline flex-1"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
