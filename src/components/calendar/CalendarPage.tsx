import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { CalendarEvent } from "../../api/types";
import UpcomingEvents from "./UpcomingEvents";
import EventForm from "./EventForm";

import { useState } from "react";

export default function CalendarPage() {
  // Existing mock events are used initially.
  // Later these can be replaced with backend API data.
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Controls the Add Event form
  const [showEventForm, setShowEventForm] = useState(false);

  // Handle saving a new event from EventForm
  const handleSaveEvent = (newEvent: any) => {
    const calendarEvent = {
      ...newEvent,

      // FullCalendar needs a title
      title: `${newEvent.company} - ${newEvent.role}`,

      // FullCalendar needs a valid start date/time
      start: `${newEvent.date}T${newEvent.time}`,
    };

    setEvents((prevEvents) => [
      ...prevEvents,
      calendarEvent,
    ]);

    // Close the form after saving
    setShowEventForm(false);
  };

  const calendarEvents = events.map((event: CalendarEvent) => ({
  id: String(event.id),
  title: event.title,
  start: `${event.scheduledDate}T${event.startTime}`,
  end: `${event.scheduledDate}T${event.endTime}`,
}));

  return (
    <div className="space-y-6">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-bold">
            Placement Calendar
          </h1>

          <p className="text-gray-400">
            Schedule and manage all placement activities.
          </p>
        </div>

        {/* ADD EVENT BUTTON */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowEventForm(true)}
        >
          + Add Event
        </button>

      </div>


      {/* =========================
          CALENDAR + UPCOMING EVENTS
      ========================== */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* =========================
            MAIN CALENDAR
        ========================== */}
        <div className="col-span-1 lg:col-span-3 glass-card p-5 rounded-xl">

          <FullCalendar
            plugins={[
              dayGridPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            height="700px"
            events={calendarEvents}
          />

        </div>


        {/* =========================
            UPCOMING EVENTS
        ========================== */}
        <div>
          <UpcomingEvents />
        </div>

      </div>


      {/* =========================
          ADD EVENT MODAL
      ========================== */}
      {showEventForm && (
        <EventForm
          onClose={() => setShowEventForm(false)}

          onSave={handleSaveEvent}
        />
      )}

    </div>
  );
}