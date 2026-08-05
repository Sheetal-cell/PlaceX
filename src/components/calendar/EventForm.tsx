//import React from "react";

interface Props {
    onClose: () => void;
}

export default function EventForm({ onClose }: Props) {

    return (

<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

<div className="bg-slate-800 rounded-xl p-6 w-150">

<h2 className="text-2xl font-bold mb-5">

Add Placement Event

</h2>

<div className="grid grid-cols-2 gap-4">

<input placeholder="Company" className="input-field"/>

<input placeholder="Role" className="input-field"/>

<select className="input-field">

<option>PPT</option>

<option>Online Assessment</option>

<option>Technical Interview</option>

<option>HR Interview</option>

<option>Deadline</option>

</select>

<input type="date" className="input-field"/>

<input type="time" className="input-field"/>

<input placeholder="Venue" className="input-field"/>

<input placeholder="Coordinator" className="input-field"/>

<input placeholder="Eligible Branches" className="input-field"/>

</div>

<textarea

className="input-field mt-4 w-full"

rows={4}

placeholder="Description"

/>

<div className="flex justify-end gap-3 mt-6">

<button

className="btn btn-secondary"

onClick={onClose}

>

Cancel

</button>

<button className="btn btn-primary">

Save Event

</button>

</div>

</div>

</div>

    );

}