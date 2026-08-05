import React from "react";

interface Props{

search:string;

setSearch:(v:string)=>void;

}

export default function ScrapedFilters({
search,
setSearch
}:Props){

return(

<div className="glass-card p-5 flex flex-wrap gap-4">

<input

className="input-field flex-1"

placeholder="Search Company"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>

<select className="input-field">

<option>All Sources</option>

<option>LinkedIn</option>

<option>Company Career</option>

<option>Internshala</option>

<option>Wellfound</option>

</select>

<select className="input-field">

<option>Status</option>

<option>Pending</option>

<option>Approved</option>

<option>Rejected</option>

</select>

<button className="btn btn-primary">

Refresh Feed

</button>

</div>

);

}