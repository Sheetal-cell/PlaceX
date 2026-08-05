const templates=[

"Campus Recruitment",

"Internship Invitation",

"Placement Drive Reminder",

"Follow-up Email",

"Thank You Email"

];

export default function EmailTemplates(){

return(

<div className="glass-card rounded-xl p-5">

<h2 className="font-bold text-lg mb-4">

Templates

</h2>

{

templates.map(template=>(

<div

key={template}

className="border-b border-gray-700 py-3 cursor-pointer hover:text-blue-400"

>

{template}

</div>

))

}

</div>

);

}