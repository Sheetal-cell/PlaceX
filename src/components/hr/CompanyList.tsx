import { companies,type Company } from "../../mockHR";
import CompanyCard from "./CompanyCard";

interface Props{

onSelect:(company:Company)=>void;

}

export default function CompanyList({onSelect}:Props){

return(

<div>

<input

placeholder="Search Company..."

className="input-field mb-4 w-full"

/>

{

companies.map(company=>(

<CompanyCard

key={company.id}

company={company}

onSelect={onSelect}

/>

))

}

</div>

);

}