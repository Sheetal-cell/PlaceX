import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../api/types";
import UpcomingEvents from "./UpcomingEvents";
import EventForm from "./EventForm";
import { INITIAL_CALENDAR_EVENTS } from "../../mockCalendar";
import { calendarApi } from "../../api/calendarApi";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

interface CalendarPageProps {
  readOnly?: boolean;
  events?: CalendarEvent[];
  onAddEvent?: (newEvent: CalendarEvent) => void;
}

export const EVENT_COLOR_PALETTE = [
  { bg: '#2563EB', border: '#1D4ED8', text: '#FFFFFF', name: 'Blue' },
  { bg: '#7C3AED', border: '#6D28D9', text: '#FFFFFF', name: 'Purple' },
  { bg: '#059669', border: '#047857', text: '#FFFFFF', name: 'Emerald' },
  { bg: '#D97706', border: '#B45309', text: '#FFFFFF', name: 'Amber' },
  { bg: '#DB2777', border: '#BE185D', text: '#FFFFFF', name: 'Pink' },
  { bg: '#0284C7', border: '#0369A1', text: '#FFFFFF', name: 'Sky' },
  { bg: '#4F46E5', border: '#4338CA', text: '#FFFFFF', name: 'Indigo' },
  { bg: '#E11D48', border: '#BE123C', text: '#FFFFFF', name: 'Rose' }
];

export const getEventColor = (event: { id?: string | number; title?: string; eventType?: string }) => {
  if (event.eventType) {
    const type = event.eventType.toLowerCase();
    if (type.includes('talk') || type.includes('ppt')) return EVENT_COLOR_PALETTE[0];
    if (type.includes('tech') || type.includes('coding')) return EVENT_COLOR_PALETTE[1];
    if (type.includes('offer') || type.includes('final')) return EVENT_COLOR_PALETTE[2];
    if (type.includes('aptitude') || type.includes('test')) return EVENT_COLOR_PALETTE[3];
    if (type.includes('hr') || type.includes('interview')) return EVENT_COLOR_PALETTE[4];
  }
  
  const str = String(event.id || event.title || 'event');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EVENT_COLOR_PALETTE.length;
  return EVENT_COLOR_PALETTE[index];
};

export default function CalendarPage({
  readOnly = false,
  events: propEvents,
  onAddEvent
}: CalendarPageProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(
    propEvents && propEvents.length > 0 ? propEvents : INITIAL_CALENDAR_EVENTS
  );
  const [showEventForm, setShowEventForm] = useState(false);

  useEffect(() => {
    if (propEvents && propEvents.length > 0) {
      setEvents(propEvents);
    }
  }, [propEvents]);

  useEffect(() => {
    if (!propEvents || propEvents.length === 0) {
      calendarApi.getAll()
        .then((data: any) => {
          if (Array.isArray(data) && data.length > 0) {
            setEvents(data);
          }
        })
        .catch(() => {
          // Fallback to INITIAL_CALENDAR_EVENTS
        });
    }
  }, [propEvents]);

  const handleSaveEvent = (newEvent: any) => {
    const calendarEvent: CalendarEvent = {
      id: Date.now(),
      title: `${newEvent.company} - ${newEvent.role} (${newEvent.type})`,
      eventType: newEvent.type,
      companyName: newEvent.company,
      company: newEvent.company,
      role: newEvent.role,
      scheduledDate: newEvent.date,
      startTime: newEvent.time,
      location: newEvent.venue,
      venue: newEvent.venue,
      description: newEvent.description,
      status: "SCHEDULED",
      branches: newEvent.branches ? newEvent.branches.split(',').map((b: string) => b.trim()) : [],
    };

    if (onAddEvent) {
      onAddEvent(calendarEvent);
    } else {
      setEvents((prevEvents) => [calendarEvent, ...prevEvents]);
    }
    setShowEventForm(false);

    calendarApi.create({
      title: calendarEvent.title,
      eventType: calendarEvent.eventType,
      scheduledDate: calendarEvent.scheduledDate,
      startTime: calendarEvent.startTime,
      location: calendarEvent.location,
      description: calendarEvent.description
    }).catch(() => {
      // Ignored for mock mode
    });
  };

  const calendarEvents = events.map((event: CalendarEvent) => {
    const color = getEventColor(event);
    return {
      id: String(event.id),
      title: event.title || `${event.companyName || event.company || ''} ${event.eventType ? `(${event.eventType})` : ''}`,
      start: event.scheduledDate && event.startTime
        ? (event.startTime.includes('T') ? event.startTime : `${event.scheduledDate}T${event.startTime.slice(0, 5)}:00`)
        : event.scheduledDate,
      end: event.scheduledDate && event.endTime
        ? (event.endTime.includes('T') ? event.endTime : `${event.scheduledDate}T${event.endTime.slice(0, 5)}:00`)
        : undefined,
      backgroundColor: color.bg,
      borderColor: color.border,
      textColor: color.text,
    };
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* PAGE HEADER */}
      <div className="sp-page-header">
        <div>
          <h1 className="sp-page-title">
            <CalendarIcon size={28} className="text-blue-600" />
            Placement Calendar
          </h1>
          <p className="sp-page-subtitle">
            {readOnly
              ? "View all scheduled campus placement drives, assessments, pre-placement talks, and interviews."
              : "Schedule and manage all placement activities across campus drives."}
          </p>
        </div>

        {/* ADD EVENT BUTTON (TPO Admin only) */}
        {!readOnly && (
          <button
            type="button"
            className="btn btn-primary h-11 px-5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 self-start sm:self-center cursor-pointer"
            onClick={() => setShowEventForm(true)}
          >
            <Plus size={18} />
            <span>Add Event</span>
          </button>
        )}
      </div>

      {/* CALENDAR + UPCOMING EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* MAIN CALENDAR */}
        <div className="col-span-1 lg:col-span-3 glass-card p-6 sm:p-7 rounded-2xl border border-slate-200 bg-white shadow-xs">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="720px"
            events={calendarEvents}
          />
        </div>

        {/* UPCOMING EVENTS */}
        <div>
          <UpcomingEvents events={events} />
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      {!readOnly && showEventForm && (
        <EventForm
          onClose={() => setShowEventForm(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}