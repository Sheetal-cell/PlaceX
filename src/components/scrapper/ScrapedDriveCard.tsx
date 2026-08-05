//import React from "react";
import {ExternalLink} from "lucide-react";

export default function ScrapedDriveCard({

drive,

onView

}:any){

return(

<div className="glass-card p-5 hover:scale-[1.02] transition-all">

<div className="flex justify-between">

<div>

<h2 className="text-xl font-bold">

{drive.company}

</h2>

<p className="text-indigo-400">

{drive.role}

</p>

</div>

<span className="badge badge-warning">

{drive.status}

</span>

</div>

<div className="mt-4 text-sm text-gray-400">

<p>📍 {drive.location}</p>

<p>💰 {drive.salary}</p>

<p>🌐 {drive.source}</p>

<p>🕒 {drive.posted}</p>

</div>

<div className="flex gap-3 mt-6">

<button

className="btn btn-secondary"

onClick={()=>onView(drive)}

>

View

</button>

<button className="btn btn-success">

Approve

</button>

<button className="btn btn-danger">

Reject

</button>

<a

href={drive.applyLink}

target="_blank"

rel="noreferrer"

className="btn btn-primary"

>

<ExternalLink size={15}/>

</a>

</div>

</div>

);

}