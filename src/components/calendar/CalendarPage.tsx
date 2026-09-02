import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../api/types";
import UpcomingEvents from "./UpcomingEvents";
import EventForm from "./EventForm";
import { INITIAL_CALENDAR_EVENTS } from "../../mockCalendar";
import { calendarApi } from "../../api/calendarApi";
import { useState, useEffect } from "react";

interface CalendarPageProps {
  readOnly?: boolean;
  events?: CalendarEvent[];
  onAddEvent?: (newEvent: CalendarEvent) => void;
}

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

  const calendarEvents = events.map((event: CalendarEvent) => ({
    id: String(event.id),
    title: event.title || `${event.companyName || event.company || ''} ${event.eventType ? `(${event.eventType})` : ''}`,
    start: event.scheduledDate && event.startTime
      ? (event.startTime.includes('T') ? event.startTime : `${event.scheduledDate}T${event.startTime.slice(0, 5)}:00`)
      : event.scheduledDate,
    end: event.scheduledDate && event.endTime
      ? (event.endTime.includes('T') ? event.endTime : `${event.scheduledDate}T${event.endTime.slice(0, 5)}:00`)
      : undefined,
  }));

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">
            Placement Calendar
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {readOnly
              ? "View all scheduled campus placement drives, assessments, pre-placement talks, and interviews."
              : "Schedule and manage all placement activities across campus drives."}
          </p>
        </div>

        {/* ADD EVENT BUTTON (TPO Admin only) */}
        {!readOnly && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowEventForm(true)}
          >
            + Add Event
          </button>
        )}
      </div>

      {/* CALENDAR + UPCOMING EVENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* MAIN CALENDAR */}
        <div className="col-span-1 lg:col-span-3 glass-card p-5 rounded-xl">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="700px"
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