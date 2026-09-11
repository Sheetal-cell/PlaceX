import { FileText, ArrowRight } from "lucide-react";

const templates = [
  "Campus Recruitment",
  "Internship Invitation",
  "Placement Drive Reminder",
  "Follow-up Email",
  "Thank You Email"
];

interface Props {
  onSelectTemplate?: (templateName: string) => void;
}

export default function EmailTemplates({ onSelectTemplate }: Props) {
  return (
    <div className="glass-card bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col gap-5">
      <h2 className="font-bold text-base sm:text-lg text-slate-900 font-display flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <FileText size={20} className="text-blue-600 shrink-0" />
        Email Templates
      </h2>

      <div className="flex flex-col gap-2.5">
        {templates.map((template) => (
          <button
            type="button"
            key={template}
            onClick={() => onSelectTemplate?.(template)}
            className="py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-700 hover:text-blue-700 bg-slate-50/80 hover:bg-blue-50/70 rounded-2xl transition-all cursor-pointer flex items-center justify-between border border-slate-200/80 hover:border-blue-300 text-left w-full group shadow-2xs"
          >
            <span className="truncate pr-2 font-display">{template}</span>
            <span className="px-2.5 py-1 rounded-xl bg-white group-hover:bg-blue-600 text-blue-600 group-hover:text-white text-xs font-extrabold flex items-center gap-1 shrink-0 transition-all shadow-2xs border border-slate-200/60 group-hover:border-blue-600">
              Use <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}