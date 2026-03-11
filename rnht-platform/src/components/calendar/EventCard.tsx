import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Event } from "@/types/database";
import { formatDate } from "@/lib/utils";

const eventTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
  festival: { bg: "bg-amber-50", text: "text-amber-800", dot: "bg-amber-500" },
  regular_pooja: { bg: "bg-red-50", text: "text-red-800", dot: "bg-red-500" },
  community: {
    bg: "bg-green-50",
    text: "text-green-800",
    dot: "bg-green-500",
  },
  class: { bg: "bg-blue-50", text: "text-blue-800", dot: "bg-blue-500" },
};

const eventTypeLabels: Record<string, string> = {
  festival: "Festival",
  regular_pooja: "Regular Pooja",
  community: "Community",
  class: "Class",
};

export function EventCard({ event }: { event: Event }) {
  const colors = eventTypeColors[event.event_type] || eventTypeColors.community;

  return (
    <div className="card overflow-hidden">
      <div
        className={`flex items-center gap-2 px-4 py-2 ${colors.bg} ${colors.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
        <span className="text-xs font-semibold uppercase tracking-wide">
          {eventTypeLabels[event.event_type]}
        </span>
        {event.is_recurring && (
          <span className="ml-auto text-xs opacity-60">Recurring</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading text-lg font-bold text-gray-900">
          {event.title}
        </h3>
        {event.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-3">
            {event.description}
          </p>
        )}
        <div className="mt-4 space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(event.start_date)}</span>
          </div>
          {event.start_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {event.start_time}
                {event.end_time && ` - ${event.end_time}`}
              </span>
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        {event.rsvp_enabled && (
          <div className="mt-4 flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              {event.rsvp_count} attending
            </span>
            <button className="rounded-lg bg-temple-red px-4 py-1.5 text-xs font-semibold text-white hover:bg-temple-red-dark">
              RSVP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
