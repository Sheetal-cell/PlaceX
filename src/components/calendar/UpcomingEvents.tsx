import { placementEvents } from "../../mockCalendar";

export default function UpcomingEvents(){

return(

<div className="glass-card p-5 rounded-xl">

<h2 className="text-xl font-bold mb-4">

Upcoming Events

</h2>

{placementEvents.map(event=>(

<div

key={event.id}

className="border-b border-gray-700 py-3"

>

<h3 className="font-semibold">

{event.title}

</h3>

<p className="text-sm text-gray-400">

{event.date}

</p>

<p className="text-sm">

{event.company}

</p>

</div>

))}

</div>

);

}