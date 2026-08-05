import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { placementEvents } from "../../mockCalendar";
import UpcomingEvents from "./UpcomingEvents";
import { useState } from "react";
import EventForm from "./EventForm";
export default function CalendarPage() {

    const [events,setEvents] = useState(placementEvents);
    

    const [showEventForm, setShowEventForm] = useState(false);
    

    return (


<div className="space-y-6">

<div className="flex justify-between items-center">

<div>

<h1 className="text-3xl font-bold">

Placement Calendar

</h1>

<p className="text-gray-400">

Schedule and manage all placement activities.

</p>

</div>

<button
    className="btn btn-primary"
    onClick={() => setShowEventForm(true)}
>
    + Add Event
</button>

</div>

<div className="grid grid-cols-4 gap-6">

<div className="col-span-3 glass-card p-5 rounded-xl">

<FullCalendar

plugins={[dayGridPlugin, interactionPlugin]}

initialView="dayGridMonth"

height="700px"

events={events}

/>
 <div>
     {/* your calendar content */}

            {showEventForm && (
                <EventForm
    onClose={()=>setShowEventForm(false)}

    onSave={(newEvent)=>{

    setEvents([
        ...events,
        {
            ...newEvent,
            title: `${newEvent.company} - ${newEvent.role}`,
            start: `${newEvent.date}T${newEvent.time}`
        }
    ]);

}}
/>
            )}
 </div>

</div>

<div>

<UpcomingEvents/>

</div>

</div>

</div>



);

}