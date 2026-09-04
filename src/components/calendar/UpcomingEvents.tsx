import type { CalendarEvent } from "../../api/types";
import { INITIAL_CALENDAR_EVENTS } from "../../mockCalendar";
import { Calendar, MapPin, Clock, Building2 } from "lucide-react";
import { getEventColor } from "./CalendarPage";

interface UpcomingEventsProps {
  events?: CalendarEvent[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const displayEvents = events && events.length > 0 ? events : INITIAL_CALENDAR_EVENTS;

  return (
    <div className="glass-card p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2.5">
          <Calendar className="text-blue-600" size={20} />
          Upcoming Events
        </h2>
        <span className="sp-badge sp-badge-primary">{displayEvents.length} Scheduled</span>
      </div>

      {displayEvents.length === 0 ? (
        <p className="text-xs text-slate-400 py-8 text-center font-medium">No upcoming events scheduled.</p>
      ) : (
        <div className="p-1 flex flex-col gap-4 max-h-[640px] overflow-y-auto pr-2">
          {displayEvents.map((event) => {
            const color = getEventColor(event);
            return (
              <div
                key={String(event.id)}
                className="p-5 bg-slate-50/90 border border-slate-200/90 rounded-2xl hover:border-blue-300 hover:bg-white transition-all flex flex-col gap-3 shadow-2xs"
                style={{ borderLeftWidth: '4px', borderLeftColor: color.bg }}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug font-display">
                    {event.title}
                  </h3>
                  {event.eventType && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 text-white shadow-2xs"
                      style={{ backgroundColor: color.bg }}
                    >
                      {event.eventType}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold">
                  <Building2 size={14} className="shrink-0 text-blue-600" />
                  <span>{event.companyName || event.company || "TPO Event"}</span>
                </div>

                <div className="flex items-center gap-3.5 text-[11px] text-slate-500 font-semibold pt-2 border-t border-slate-200/60 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} className="shrink-0 text-blue-600" />
                    <span>{event.scheduledDate}</span>
                  </div>
                  {event.startTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="shrink-0 text-blue-600" />
                      <span>{event.startTime}</span>
                    </div>
                  )}
                  {(event.location || event.venue) && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin size={13} className="shrink-0 text-slate-400" />
                      <span>{event.location || event.venue}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}