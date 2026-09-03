import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileCheck2,
  BarChart2,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Footer } from './Footer';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileCheck2 size={32} className="text-blue-600" />,
      title: 'AI ATS Resume Scorer',
      badge: 'AI Engine',
      description: 'Parses resumes in real-time against company job descriptions to provide keyword matching, skill gap analysis, and ATS score optimization.',
      highlights: ['Keyword density extraction', 'Skill gap suggestions', 'ATS formatting compliance']
    },
    {
      icon: <BarChart2 size={32} className="text-purple-600" />,
      title: 'Multi-Stage Pipeline Visualizer',
      badge: 'Recruitment CRM',
      description: 'Track candidate progression stage-by-stage from Online Assessments and Technical Interviews to HR rounds and offer letters.',
      highlights: ['Visual candidate Kanban', 'Stage promotion buttons', 'Rejection feedback logs']
    },
    {
      icon: <Building2 size={32} className="text-emerald-600" />,
      title: 'Recruiter CRM & Drive Portal',
      badge: 'Corporate Suite',
      description: 'Empowers corporate recruiters to launch placement drives, set eligibility filters, evaluate applications, and export reports.',
      highlights: ['Custom drive creation', 'Branch & CGPA filters', 'CSV/Excel applicant export']
    },
    {
      icon: <Calendar size={32} className="text-amber-600" />,
      title: 'Automated Placement Calendar',
      badge: 'Event Operations',
      description: 'Schedule pre-placement talks, coding tests, deadline reminders, and interview slots with automated student notifications.',
      highlights: ['Real-time deadline alerts', 'Interactive calendar view', 'Sync across all portals']
    },
    {
      icon: <TrendingUp size={32} className="text-sky-600" />,
      title: 'TPO Analytics & Department Insights',
      badge: 'Admin Intelligence',
      description: 'Real-time department-wise placement statistics, package distribution graphs, company participation rates, and unplaced student tracking.',
      highlights: ['Branch placement ratio', 'Package range distribution', 'Unplaced student filter']
    },
    {
      icon: <Users size={32} className="text-indigo-600" />,
      title: 'Alumni Mentorship & Referral Network',
      badge: 'Network Hub',
      description: 'Connect verified alumni with current batches for internal referral programs, mock interview sessions, and career guidance.',
      highlights: ['Alumni directory access', 'Referral request routing', 'Mock interview scheduling']
    }
  ];

  return (
    <div className="flex flex-col min-h-screen relative w-full bg-[#F8FAFC] text-[hsl(var(--text-primary))] py-6">
      {/* Hero Section Banner */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[hsl(var(--color-primary)/10%)] text-[hsl(var(--color-primary))] border border-[hsl(var(--color-primary)/25%)] mb-4">
          <Sparkles size={15} /> Platform Features
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display text-[hsl(var(--text-primary))] mb-4">
          Everything You Need to Scale Placements
        </h1>
        <p className="text-[hsl(var(--text-secondary))] text-lg max-w-2xl mx-auto leading-relaxed">
          Comprehensive placement management tools designed specifically for Students, TPO Administrators, Corporate Recruiters, and Alumni.
        </p>
      </section>

      {/* Grid of 6 Feature Cards */}
      <section className="py-8 px-6 max-w-6xl mx-auto w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="glass-card p-8 flex flex-col justify-between hover:-translate-y-1.5 transition-all duration-300 rounded-2xl bg-white/90 border border-[hsl(var(--border-glass))] shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200">{feat.icon}</div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-100/60 text-blue-800">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-[hsl(var(--text-primary))] mb-2">{feat.title}</h3>
                <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed mb-6">{feat.description}</p>
              </div>

              <div className="border-t border-[hsl(var(--border-glass))] pt-4">
                <ul className="space-y-2">
                  {feat.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="flex items-center gap-2 text-xs text-[hsl(var(--text-secondary))]">
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-12 px-6 max-w-4xl mx-auto w-full mb-16">
        <div className="glass-card p-10 text-center flex flex-col items-center bg-gradient-to-r from-blue-50 via-white to-sky-50 border border-blue-200 rounded-3xl shadow-xl">
          <Zap size={40} className="text-blue-600 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[hsl(var(--text-primary))]">
            Ready to test out the features?
          </h2>
          <p className="text-sm text-[hsl(var(--text-secondary))] max-w-lg mt-2 mb-6">
            Get started by creating your account or exploring our sample demonstration data.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/auth?mode=register')}
              className="btn btn-primary px-7 py-3 text-sm font-bold font-display rounded-xl shadow-md flex items-center gap-2"
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="btn btn-secondary px-7 py-3 text-sm font-bold font-display rounded-xl"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
