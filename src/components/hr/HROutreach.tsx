import { useState } from "react";
import type { Company } from "../../mockHR";

import CompanyList from "./CompanyList";
import EmailComposer from "./EmailComposer";
import EmailTemplates from "./EmailTemplates";
import OutreachStats from "./OutreachStats";

export default function HROutreach(){

const [selected,setSelected]=useState<Company|null>(null);

return(

<div className="space-y-6">

<div>

<h1 className="text-3xl font-bold">

📧 Recruiter Relationship Management

</h1>

<p className="text-gray-400">

Manage recruiter communication and outreach.

</p>

</div>

<OutreachStats/>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-3">

<CompanyList

onSelect={setSelected}

/>

</div>

<div className="col-span-6">

<EmailComposer

selected={selected}

/>

</div>

<div className="col-span-3">

<EmailTemplates/>

</div>

</div>

</div>

);

}