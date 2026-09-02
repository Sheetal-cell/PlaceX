import type { CalendarEvent } from "../../api/types";
import { INITIAL_CALENDAR_EVENTS } from "../../mockCalendar";
import { Calendar, MapPin, Clock, Building2 } from "lucide-react";

interface UpcomingEventsProps {
  events?: CalendarEvent[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const displayEvents = events && events.length > 0 ? events : INITIAL_CALENDAR_EVENTS;

  return (
    <div className="glass-card p-5 rounded-xl flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Calendar className="text-sky-400" size={20} />
        <h2 className="text-lg font-bold text-white font-display">
          Upcoming Events
        </h2>
      </div>

      {displayEvents.length === 0 ? (
        <p className="text-xs text-gray-400 py-4 text-center">No upcoming events scheduled.</p>
      ) : (
        <div className="flex flex-col gap-3 max-h-125 overflow-y-auto pr-1">
          {displayEvents.map((event) => (
            <div
              key={String(event.id)}
              className="p-3 bg-white/5 border border-white/5 rounded-lg hover:border-sky-500/30 transition-all flex flex-col gap-1.5"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-xs text-white leading-snug">
                  {event.title}
                </h3>
                {event.eventType && (
                  <span className="badge badge-info text-[10px] py-0.5 px-1.5 shrink-0">
                    {event.eventType}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-sky-400 font-medium">
                <Building2 size={12} className="shrink-0" />
                <span>{event.companyName || event.company || "TPO Event"}</span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-0.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <Calendar size={11} className="shrink-0 text-gray-500" />
                  <span>{event.scheduledDate}</span>
                </div>
                {event.startTime && (
                  <div className="flex items-center gap-1">
                    <Clock size={11} className="shrink-0 text-gray-500" />
                    <span>{event.startTime}</span>
                  </div>
                )}
              </div>

              {(event.location || event.venue) && (
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <MapPin size={11} className="shrink-0 text-gray-500" />
                  <span>{event.location || event.venue}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}