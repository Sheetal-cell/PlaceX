import { useState } from "react";
import { companies, type Company } from "../../mockHR";
import CompanyCard from "./CompanyCard";
import { Search } from "lucide-react";

interface Props {
  onSelect: (company: Company) => void;
  selectedId?: number;
}

export default function CompanyList({ onSelect, selectedId }: Props) {
  const [search, setSearch] = useState("");

  const filtered = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hr.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Company..."
          className="input-field pl-10"
        />
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>

      <div className="flex flex-col gap-3">
        {filtered.map((company) => (
          <CompanyCard
            key={company.id}
            company={company}
            isSelected={company.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}