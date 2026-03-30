'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CalendarPlus, Check } from "lucide-react";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

const eventTypeColors: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  festival: {
    bg: "bg-temple-gold/10",
    text: "text-temple-maroon",
    dot: "bg-temple-gold",
  },
  regular_pooja: {
    bg: "bg-temple-red/10",
    text: "text-temple-red",
    dot: "bg-temple-red",
  },
  community: {
    bg: "bg-temple-gold/5",
    text: "text-temple-maroon",
    dot: "bg-temple-gold/70",
  },
  class: { bg: "bg-temple-cream", text: "text-temple-maroon", dot: "bg-temple-gold/60" },
};

const eventTypeLabels: Record<string, string> = {
  festival: "Festival",
  regular_pooja: "Regular Pooja",
  community: "Community",
  class: "Class",
};

function buildGoogleCalendarUrl(event: Event): string {
  const startDate = event.start_date.replace(/-/g, "");
  const endDate = event.end_date
    ? event.end_date.replace(/-/g, "")
    : startDate;

  // BUG FIX: use endDate fallback consistently (was already set above but duplicated logic)
  let dates = `${startDate}/${endDate}`;
  if (event.start_time && event.end_time) {
    const startTime = event.start_time.replace(/:/g, "") + "00";
    const endTime = event.end_time.replace(/:/g, "") + "00";
    dates = `${startDate}T${startTime}/${endDate}T${endTime}`;
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates,
    details: event.description || "",
    location: event.location || "Rudra Narayana Hindu Temple, 2025 Rushing Ranch Path, Georgetown, TX 78628",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function EventCard({ event }: { event: Event }) {
  const [rsvpd, setRsvpd] = useState(false);
  const colors =
    eventTypeColors[event.event_type] || eventTypeColors.community;

  return (
    <article className="card overflow-hidden group hover:shadow-gold-glow">
      <div
        className={`flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${colors.dot}`} aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {eventTypeLabels[event.event_type]}
        </span>
        {event.is_recurring && (
          <span className="ml-auto text-xs opacity-60">Recurring</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-temple-red transition-colors">
          {event.title}
        </h3>
        {event.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {event.description}
          </p>
        )}
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>
                {event.start_time}
                {event.end_time && ` - ${event.end_time}`}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {event.rsvp_enabled && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="h-4 w-4" aria-hidden="true" />
                {event.rsvp_count} attending
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {!event.is_recurring && (
              <a
                href={buildGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                aria-label={`Add ${event.title} to Google Calendar`}
              >
                <CalendarPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Add to Cal</span>
              </a>
            )}
            {event.rsvp_enabled && (
              <button
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${rsvpd ? 'bg-green-600 text-white' : 'bg-temple-red text-white hover:bg-temple-red-dark'}`}
                onClick={() => setRsvpd(!rsvpd)}
              >
                {rsvpd ? <><Check className="inline h-3 w-3 mr-1" />Going</> : 'RSVP'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
