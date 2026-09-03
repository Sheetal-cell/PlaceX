import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Zap,
  UserCheck,
  Building2,
  Shield,
  ArrowRight,
  CheckCircle2,
  FileText,
  Send,
  Award,
  PlusCircle,
  Users,
  PieChart
} from 'lucide-react';
import { Footer } from './Footer';

type RoleTab = 'student' | 'tpo' | 'recruiter';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<RoleTab>('student');

  const studentSteps = [
    {
      step: '01',
      title: 'Build Profile & Upload ATS Resume',
      desc: 'Register your account, enter CGPA, skills, and projects. Use our AI ATS Scorer to optimize resume keywords.',
      icon: <FileText size={28} className="text-blue-600" />
    },
    {
      step: '02',
      title: 'Apply to Drives & Track Status',
      desc: 'Browse eligible campus placement drives, submit applications in one click, and track stage promotions live.',
      icon: <Send size={28} className="text-purple-600" />
    },
    {
      step: '03',
      title: 'Get Placed & Guide Juniors',
      desc: 'Receive offer letters, update placement status, and connect with upcoming batches for alumni mentorship.',
      icon: <Award size={28} className="text-emerald-600" />
    }
  ];

  const tpoSteps = [
    {
      step: '01',
      title: 'Seed & Manage Student Roster',
      desc: 'Import or seed student profiles, verify department credentials, CGPA records, and unplaced status.',
      icon: <Users size={28} className="text-blue-600" />
    },
    {
      step: '02',
      title: 'Publish Drives & Calendar Events',
      desc: 'Schedule placement drives, online test dates, pre-placement talks, and application deadlines.',
      icon: <PlusCircle size={28} className="text-amber-600" />
    },
    {
      step: '03',
      title: 'Promote Candidates & Export Insights',
      desc: 'Advance candidates through recruitment rounds, mark offers, and export department placement reports.',
      icon: <PieChart size={28} className="text-indigo-600" />
    }
  ];

  const recruiterSteps = [
    {
      step: '01',
      title: 'Create Recruiter Profile & Post Drives',
      desc: 'Sign in as a corporate hiring partner, define job roles, salary package, location, and CGPA cutoff.',
      icon: <Building2 size={28} className="text-emerald-600" />
    },
    {
      step: '02',
      title: 'Review ATS-Scored Applications',
      desc: 'Filter candidate resumes matched by AI scores, review profiles, and shortlist candidates for tests.',
      icon: <UserCheck size={28} className="text-blue-600" />
    },
    {
      step: '03',
      title: 'Issue Offers & Final Selection',
      desc: 'Conduct interviews, advance selected candidates to final offer stage, and notify campus TPO officers.',
      icon: <Shield size={28} className="text-purple-600" />
    }
  ];

  const currentSteps =
    activeTab === 'student' ? studentSteps : activeTab === 'tpo' ? tpoSteps : recruiterSteps;

  return (
    <div className="flex flex-col min-h-screen relative w-full bg-[#F8FAFC] text-[hsl(var(--text-primary))] py-6">
      {/* Hero Section Banner */}
      <section className="py-16 px-6 max-w-6xl mx-auto w-full text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[hsl(var(--color-primary)/10%)] text-[hsl(var(--color-primary))] border border-[hsl(var(--color-primary)/25%)] mb-4">
          <Zap size={15} /> Guided Execution
        </span>
        <h1 className="text-4xl sm:text-6xl font-black font-display text-[hsl(var(--text-primary))] mb-4">
          How PlaceX Works for Everyone
        </h1>
        <p className="text-[hsl(var(--text-secondary))] text-lg max-w-2xl mx-auto leading-relaxed">
          Select your role to explore the step-by-step workflow tailored specifically for your placement journey.
        </p>
      </section>

      {/* Role Tab Switcher Buttons */}
      <section className="py-4 px-6 max-w-xl mx-auto w-full mb-12">
        <div className="flex p-1.5 rounded-2xl bg-white/90 border border-[hsl(var(--border-glass))] shadow-md gap-2">
          <button
            onClick={() => setActiveTab('student')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'student'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[hsl(var(--text-secondary))] hover:bg-blue-50'
            }`}
          >
            For Students
          </button>
          <button
            onClick={() => setActiveTab('tpo')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'tpo'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[hsl(var(--text-secondary))] hover:bg-blue-50'
            }`}
          >
            For TPOs & Admin
          </button>
          <button
            onClick={() => setActiveTab('recruiter')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold font-display transition-all ${
              activeTab === 'recruiter'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-[hsl(var(--text-secondary))] hover:bg-blue-50'
            }`}
          >
            For Recruiters
          </button>
        </div>
      </section>

      {/* 3 Interactive Steps Display */}
      <section className="py-6 px-6 max-w-6xl mx-auto w-full mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {currentSteps.map((s, idx) => (
            <div
              key={idx}
              className="glass-card p-8 rounded-3xl bg-white/90 border border-[hsl(var(--border-glass))] shadow-lg flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black font-display text-blue-600/30">{s.step}</span>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">{s.icon}</div>
                </div>
                <h3 className="text-xl font-bold font-display text-[hsl(var(--text-primary))] mb-3">{s.title}</h3>
                <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed mb-6">{s.desc}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50/80 px-3 py-2 rounded-xl border border-blue-100">
                <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                <span>Automated Workflow Active</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Bar */}
      <section className="py-10 px-6 max-w-4xl mx-auto w-full mb-16">
        <div className="glass-card p-10 text-center flex flex-col items-center bg-gradient-to-r from-blue-50 via-white to-emerald-50 border border-blue-200 rounded-3xl shadow-xl">
          <Sparkles size={40} className="text-blue-600 mb-3" />
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[hsl(var(--text-primary))]">
            Ready to experience the workflow?
          </h2>
          <p className="text-sm text-[hsl(var(--text-secondary))] max-w-lg mt-2 mb-6">
            Register your role now or log in to access your customized dashboard workspace.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/auth?mode=register')}
              className="btn btn-primary px-8 py-3.5 text-sm font-bold font-display rounded-xl shadow-md flex items-center gap-2"
            >
              Create Account <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="btn btn-secondary px-8 py-3.5 text-sm font-bold font-display rounded-xl"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
