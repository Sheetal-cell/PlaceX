import React from "react";

import {X} from "lucide-react";

export default function ScrapedDriveModal({

drive,

onClose

}:any){

if(!drive) return null;

return(

<div className="modal-overlay">

<div className="glass-card modal-content p-6">

<div className="flex justify-between">

<h2 className="text-2xl font-bold">

{drive.company}

</h2>

<X

className="cursor-pointer"

onClick={onClose}

/>

</div>

<div className="mt-6 space-y-3">

<p><b>Role:</b> {drive.role}</p>

<p><b>Location:</b> {drive.location}</p>

<p><b>Salary:</b> {drive.salary}</p>

<p><b>Deadline:</b> {drive.deadline}</p>

<p><b>Source:</b> {drive.source}</p>

<p><b>Description:</b></p>

<p>{drive.description}</p>

<div className="flex flex-wrap gap-2">

{drive.skills.map((skill:string)=>(

<span

key={skill}

className="badge badge-info"

>

{skill}

</span>

))}

</div>

<div className="flex gap-3 mt-6">

<button className="btn btn-success">

Approve

</button>

<button className="btn btn-danger">

Reject

</button>

</div>

</div>

</div>

</div>

);

}