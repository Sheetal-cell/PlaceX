import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowLeft, Sparkles, Briefcase, Users } from 'lucide-react';
import { Footer } from './Footer';

interface AlumniPortalProps {
  onLogout?: () => void;
}

export const AlumniPortal: React.FC<AlumniPortalProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] text-[hsl(var(--text-primary))]">
      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto w-full">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center justify-center mb-6 shadow-md animate-bounce">
          <Award size={32} />
        </div>

        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-700 border border-amber-500/25 mb-4">
          <Sparkles size={14} /> Alumni Mentorship & Networking
        </span>

        <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 mb-4 leading-tight">
          Alumni Portal — Coming Soon
        </h1>

        <p className="text-slate-600 text-base max-w-xl mb-8 leading-relaxed">
          We are currently expanding PlaceX to include dedicated Alumni Mentorship features, referral networks, and direct corporate recruitment connections.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-10 text-left">
          <div className="glass-card p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Users size={22} className="text-amber-600 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Student Mentorship</h4>
            <p className="text-xs text-slate-600">Guide junior candidates through mock technical interviews.</p>
          </div>

          <div className="glass-card p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Briefcase size={22} className="text-amber-600 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Internal Job Referrals</h4>
            <p className="text-xs text-slate-600">Post referral links and open opportunities at your company.</p>
          </div>

          <div className="glass-card p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <Award size={22} className="text-amber-600 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">Placement Hall of Fame</h4>
            <p className="text-xs text-slate-600">Track institutional placement legacy and success stories.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => navigate('/student')}
            className="btn btn-primary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
          >
            Go to Student Portal
          </button>

          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
