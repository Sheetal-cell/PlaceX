import type { Company } from "../../mockHR";

interface Props{

company:Company;

onSelect:(company:Company)=>void;

}

export default function CompanyCard({company,onSelect}:Props){

return(

<div

onClick={()=>onSelect(company)}

className="glass-card rounded-xl p-4 cursor-pointer hover:scale-[1.02] transition-all mb-3"

>

<div className="flex items-center gap-3">

<img

src={company.logo}

className="w-12 h-12 rounded-full"

/>

<div>

<h3 className="font-semibold">

{company.name}

</h3>

<p className="text-sm text-gray-400">

{company.hr}

</p>

<p className="text-xs">

{company.status}

</p>

</div>

</div>

</div>

);

}