import {useState} from "react";

import {scrapedDrives} from "../../mockScrapedDrives";

import ScrapedStats from "./ScrapedStats";

import ScrapedFilters from "./ScrapedFilters";

import ScrapedDriveCard from "./ScrapedDriveCard";

import ScrapedDriveModal from "./ScrapedDriveModal";

export function ScrapedDrives(){

const[search,setSearch]=useState("");

const[selected,setSelected]=useState<any>(null);

const filtered=scrapedDrives.filter(d=>

d.company.toLowerCase().includes(search.toLowerCase())

);

return(

<div className="flex flex-col gap-6">

<div>

<h1 className="text-3xl font-bold">

🌐 Recruitment Feed

</h1>

<p className="text-gray-400 mt-2">

Jobs collected automatically from different recruitment portals.

</p>

</div>

<ScrapedStats

pending={18}

approved={42}

rejected={5}

today={12}

/>

<ScrapedFilters

search={search}

setSearch={setSearch}

/>

<div className="grid lg:grid-cols-2 gap-6">

{filtered.map(drive=>(

<ScrapedDriveCard

key={drive.id}

drive={drive}

onView={setSelected}

/>

))}

</div>

<ScrapedDriveModal

drive={selected}

onClose={()=>setSelected(null)}

/>

</div>

);

}