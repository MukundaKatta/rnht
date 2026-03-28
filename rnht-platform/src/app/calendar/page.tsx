"use client";

import { useState, useMemo } from "react";
import { sampleEvents } from "@/lib/sample-data";
import { EventCard } from "@/components/calendar/EventCard";
import type { Event } from "@/types/database";

function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getNextOccurrence(event: Event): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rule = event.recurrence_rule;

  if (rule === "weekly-saturday") {
    const d = new Date(today);
    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat
    const daysUntil = (6 - dayOfWeek + 7) % 7 || 7;
    d.setDate(d.getDate() + daysUntil);
    return formatLocalDate(d);
  }

  if (rule === "weekly-sunday") {
    const d = new Date(today);
    const dayOfWeek = d.getDay();
    const daysUntil = (7 - dayOfWeek) % 7 || 7;
    d.setDate(d.getDate() + daysUntil);
    return formatLocalDate(d);
  }

  if (rule === "monthly-purnima") {
    const d = new Date(today);
    d.setDate(d.getDate() + 30);
    return formatLocalDate(d);
  }

  if (rule === "monthly-4th-sunday") {
    const findFourthSunday = (year: number, month: number): Date => {
      const d = new Date(year, month, 1);
      d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
      d.setDate(d.getDate() + 21);
      return d;
    };

    let candidate = findFourthSunday(today.getFullYear(), today.getMonth());
    if (candidate <= today) {
      const nextMonth = today.getMonth() === 11 ? 0 : today.getMonth() + 1;
      const nextYear = today.getMonth() === 11 ? today.getFullYear() + 1 : today.getFullYear();
      candidate = findFourthSunday(nextYear, nextMonth);
    }
    return formatLocalDate(candidate);
  }

  return event.start_date;
}

const eventTypes = [
  { value: "all", label: "All Events" },
  { value: "festival", label: "Festivals" },
  { value: "regular_pooja", label: "Regular Poojas" },
  { value: "community", label: "Community" },
  { value: "class", label: "Classes" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarPage() {
  const [filterType, setFilterType] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear] = useState(new Date().getFullYear());
  const [view, setView] = useState<"list" | "calendar">("list");

  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return sampleEvents
      .filter((event) => {
        if (filterType !== "all" && event.event_type !== filterType) return false;
        return true;
      })
      .map((event) => {
        if (event.is_recurring && event.recurrence_rule) {
          const eventDate = new Date(event.start_date + "T00:00:00");
          if (eventDate < today) {
            return { ...event, start_date: getNextOccurrence(event) };
          }
        }
        return event;
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }, [filterType]);

  // Calendar grid
  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOfMonth + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return dayNum;
  });

  const getEventsForDay = (day: number) => {
    const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredEvents.filter((e) => e.start_date === dateStr);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="section-heading">Temple Calendar</h1>
        <p className="mt-3 text-gray-600">
          Stay connected with festivals, poojas, community events, and classes
        </p>
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filterType === type.value
                  ? "bg-temple-red text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              view === "list"
                ? "bg-temple-red text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              view === "calendar"
                ? "bg-temple-red text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {view === "calendar" && (
        <div className="mt-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                setSelectedMonth((m) => (m === 0 ? 11 : m - 1))
              }
              className="btn-outline px-3 py-1"
            >
              &larr;
            </button>
            <h3 className="text-xl font-heading font-bold">
              {months[selectedMonth]} {selectedYear}
            </h3>
            <button
              onClick={() =>
                setSelectedMonth((m) => (m === 11 ? 0 : m + 1))
              }
              className="btn-outline px-3 py-1"
            >
              &rarr;
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
            <div className="grid grid-cols-7 bg-gray-50 text-center text-xs font-semibold text-gray-600">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2">
                  <span className="sm:hidden">{d[0]}</span><span className="hidden sm:inline">{d}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {calendarDays.map((day, idx) => {
                const events = day ? getEventsForDay(day) : [];
                return (
                  <div
                    key={idx}
                    className={`min-h-[48px] sm:min-h-[80px] bg-white p-1 ${!day ? "bg-gray-50" : ""}`}
                  >
                    {day && (
                      <>
                        <span className="text-xs sm:text-sm text-gray-700">{day}</span>
                        <div className="mt-1 space-y-1">
                          {events.map((event) => (
                            <div
                              key={event.id}
                              className={`truncate rounded px-1 py-0.5 text-[10px] sm:text-[11px] font-medium ${
                                event.event_type === "festival"
                                  ? "bg-amber-100 text-amber-800"
                                  : event.event_type === "regular_pooja"
                                    ? "bg-red-100 text-red-800"
                                    : event.event_type === "community"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {event.title}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Event List */}
      {view === "list" && (
        filteredEvents.length === 0 ? (
          <div className="mt-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 text-gray-500">No events match this filter.</p>
          </div>
        ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        )
      )}
    </div>
  );
}
