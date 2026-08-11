import { useState } from "react";

interface Props {
    onClose: () => void;
    onSave: (event: any) => void;
}

export default function EventForm({ onClose, onSave }: Props) {

    const [eventData, setEventData] = useState({
        company: "",
        role: "",
        type: "PPT",
        date: "",
        time: "",
        venue: "",
        coordinator: "",
        branches: "",
        description: ""
    });


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value
        });
    };


    const handleSave = () => {

        if (!eventData.company || !eventData.role || !eventData.date) {
            alert("Please fill required fields");
            return;
        }

        onSave(eventData);

        onClose();
    };


    return (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">

<div className="bg-slate-800 rounded-xl p-6 w-full max-w-xl mx-auto">

<h2 className="text-2xl font-bold mb-5">
Add Placement Event
</h2>


<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">


<input
name="company"
placeholder="Company"
className="input-field"
onChange={handleChange}
/>


<input
name="role"
placeholder="Role"
className="input-field"
onChange={handleChange}
/>


<select
name="type"
className="input-field"
onChange={handleChange}
>

<option>PPT</option>
<option>Online Assessment</option>
<option>Technical Interview</option>
<option>HR Interview</option>
<option>Deadline</option>

</select>


<input
name="date"
type="date"
className="input-field"
onChange={handleChange}
/>


<input
name="time"
type="time"
className="input-field"
onChange={handleChange}
/>


<input
name="venue"
placeholder="Venue"
className="input-field"
onChange={handleChange}
/>


<input
name="coordinator"
placeholder="Coordinator"
className="input-field"
onChange={handleChange}
/>


<input
name="branches"
placeholder="Eligible Branches"
className="input-field"
onChange={handleChange}
/>


</div>


<textarea

name="description"

className="input-field mt-4 w-full"

rows={4}

placeholder="Description"

onChange={handleChange}

/>



<div className="flex justify-end gap-3 mt-6">


<button
className="btn btn-secondary"
onClick={onClose}
>
Cancel
</button>


<button
className="btn btn-primary"
onClick={handleSave}
>
Save Event
</button>


</div>


</div>

</div>

    );
}