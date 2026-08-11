import type { Company } from "../../mockHR";

interface Props{

selected:Company|null;

}

export default function EmailComposer({selected}:Props){

if(!selected)

return(

<div className="glass-card p-8 rounded-xl">

Select a company to compose an email.

</div>

);

return(

<div className="glass-card rounded-xl p-6">

<h2 className="text-xl font-bold mb-5">

Compose Email

</h2>

<input

value={selected.email}

readOnly

className="input-field mb-4 w-full"

/>

<input

placeholder="Subject"

defaultValue={`Invitation for Campus Recruitment - ${selected.name}`}

className="input-field mb-4 w-full"

/>

<textarea

rows={12}

className="input-field w-full"

defaultValue={`Dear ${selected.hr},

Greetings from XYZ Institute.

The Training and Placement Cell cordially invites ${selected.name} to participate in our campus recruitment drive for the academic year 2026-27.

We would be delighted to host your recruitment team.

Regards,

Training & Placement Office`}

/>

<div className="flex flex-wrap justify-end gap-3 mt-5">

<button className="btn btn-secondary">

Save Draft

</button>

<button className="btn btn-warning">

Generate AI Draft

</button>

<button className="btn btn-primary">

Send

</button>

</div>

</div>

);

}