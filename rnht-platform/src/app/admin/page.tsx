"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Image,
} from "lucide-react";
import { sampleServices, sampleEvents } from "@/lib/sample-data";

const stats = [
  {
    label: "Total Bookings",
    value: "47",
    change: "+12%",
    icon: BookOpen,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Revenue (MTD)",
    value: "$3,245",
    change: "+8%",
    icon: DollarSign,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Active Services",
    value: String(sampleServices.filter((s) => s.is_active).length),
    change: "",
    icon: LayoutDashboard,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Upcoming Events",
    value: String(sampleEvents.length),
    change: "",
    icon: Calendar,
    color: "text-amber-600 bg-amber-50",
  },
];

const recentBookings = [
  {
    id: "RNHT-A1B2C",
    service: "Ganapathi Homam",
    devotee: "Ramesh Kumar",
    date: "2026-03-15",
    amount: 101,
    status: "confirmed",
  },
  {
    id: "RNHT-D3E4F",
    service: "Abhishekam",
    devotee: "Lakshmi Devi",
    date: "2026-03-14",
    amount: 51,
    status: "confirmed",
  },
  {
    id: "RNHT-G5H6I",
    service: "Archana",
    devotee: "Suresh Patel",
    date: "2026-03-13",
    amount: 11,
    status: "completed",
  },
  {
    id: "RNHT-J7K8L",
    service: "Gruhapravesam",
    devotee: "Priya Sharma",
    date: "2026-03-16",
    amount: 351,
    status: "pending",
  },
  {
    id: "RNHT-M9N0O",
    service: "Satyanarayana Vratam",
    devotee: "Venkat Rao",
    date: "2026-03-12",
    amount: 51,
    status: "completed",
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-heading flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-temple-red" />
            Admin Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Manage temple services, bookings, and events
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            {stat.change && (
              <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                {stat.change} from last month
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/slideshow"
          className="card flex items-center gap-4 p-5 hover:border-temple-gold"
        >
          <Image className="h-8 w-8 text-temple-gold" />
          <div>
            <p className="font-semibold text-gray-900">Hero Slideshow</p>
            <p className="text-sm text-gray-500">
              Manage homepage banner photos & videos
            </p>
          </div>
        </Link>
        <Link
          href="/admin/services"
          className="card flex items-center gap-4 p-5 hover:border-temple-gold"
        >
          <LayoutDashboard className="h-8 w-8 text-temple-gold" />
          <div>
            <p className="font-semibold text-gray-900">Manage Services</p>
            <p className="text-sm text-gray-500">
              Add, edit, or remove pooja services
            </p>
          </div>
        </Link>
        <Link
          href="/admin/bookings"
          className="card flex items-center gap-4 p-5 hover:border-temple-gold"
        >
          <BookOpen className="h-8 w-8 text-temple-gold" />
          <div>
            <p className="font-semibold text-gray-900">View Bookings</p>
            <p className="text-sm text-gray-500">
              Manage and track all service bookings
            </p>
          </div>
        </Link>
        <Link
          href="/admin/events"
          className="card flex items-center gap-4 p-5 hover:border-temple-gold"
        >
          <Calendar className="h-8 w-8 text-temple-gold" />
          <div>
            <p className="font-semibold text-gray-900">Manage Events</p>
            <p className="text-sm text-gray-500">
              Create and manage calendar events
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Bookings */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-heading font-bold text-gray-900">
            Recent Bookings
          </h2>
          <Link
            href="/admin/bookings"
            className="text-sm text-temple-red hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
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
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {recentBookings.map((booking) => (
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
                    {booking.date}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ${booking.amount}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[booking.status]}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="mt-8">
        <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Today&apos;s Schedule
        </h2>
        <div className="mt-4 space-y-3">
          {[
            { time: "9:00 AM", event: "Temple Opening & Morning Aarti", type: "regular" },
            { time: "10:00 AM", event: "Ganapathi Homam - Ramesh Kumar", type: "booking" },
            { time: "11:00 AM", event: "Abhishekam - Lakshmi Devi", type: "booking" },
            { time: "12:00 PM", event: "Midday Aarti & Prasadam", type: "regular" },
            { time: "5:00 PM", event: "Temple Reopening & Evening Aarti", type: "regular" },
            { time: "6:00 PM", event: "Archana - Walk-in Available", type: "regular" },
            { time: "8:00 PM", event: "Temple Closing", type: "regular" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-lg border border-gray-200 p-3"
            >
              <span className="w-20 text-sm font-semibold text-gray-600">
                {item.time}
              </span>
              <div
                className={`h-2 w-2 rounded-full ${item.type === "booking" ? "bg-temple-red" : "bg-gray-400"}`}
              />
              <span className="text-sm text-gray-900">{item.event}</span>
              {item.type === "booking" && (
                <span className="ml-auto rounded-full bg-red-50 px-2 py-0.5 text-xs text-temple-red">
                  Booking
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
