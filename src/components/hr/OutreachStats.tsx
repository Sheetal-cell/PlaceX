import { Building, Mail, MessageSquare, TrendingUp } from "lucide-react";

export default function OutreachStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Companies</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">145</h2>
        </div>
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0">
          <Building size={22} />
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Emails Sent</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">302</h2>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">
          <Mail size={22} />
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Replies</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">57</h2>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center shrink-0">
          <MessageSquare size={22} />
        </div>
      </div>

      <div className="glass-card p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Response Rate</span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">18%</h2>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center shrink-0">
          <TrendingUp size={22} />
        </div>
      </div>
    </div>
  );
}