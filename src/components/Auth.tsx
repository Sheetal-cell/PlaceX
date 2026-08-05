import React, { useState } from 'react';
import { Shield, GraduationCap, ArrowRight, LogIn, UserPlus, Mail, Database, Eye, EyeOff, Loader2, Building2 } from 'lucide-react';
import type { Student, Recruiter } from '../mockData';
import { Footer } from './Footer';

interface AuthProps {
  students: Student[];
  recruiters: Recruiter[];
  onLogin: (role: 'student' | 'admin' | 'recruiter', id?: string) => void;
  onRegister: (newStudent: Student) => void;
  onRegisterRecruiter: (newRecruiter: Recruiter) => void;
  onSeedData: () => void;
}

export const Auth: React.FC<AuthProps> = ({ students, recruiters, onLogin, onRegister, onRegisterRecruiter, onSeedData }) => {
  const [activeTab, setActiveTab] = useState<'student' | 'recruiter' | 'admin'>('student');
  const [studentAuthMode, setStudentAuthMode] = useState<'login' | 'register'>('login');
  const [recruiterAuthMode, setRecruiterAuthMode] = useState<'login' | 'register'>('login');

  // Student Login Fields
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  // Student Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBranch, setRegBranch] = useState<'Computer Science' | 'Information Technology' | 'Electronics' | 'Mechanical' | 'Electrical'>('Computer Science');
  const [regCgpa, setRegCgpa] = useState('8.0');
  const [regBacklogs, setRegBacklogs] = useState('0');
  const [regSkills, setRegSkills] = useState('React, TypeScript, JavaScript');
  const [regProjects, setRegProjects] = useState('2');
  const [regResume, setRegResume] = useState('Enthusiastic developer skilled in frontend applications.');

  // Recruiter Login Fields
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');

  // Recruiter Register Fields
  const [recName, setRecName] = useState('');
  const [recCompany, setRecCompany] = useState('');
  const [recDesignation, setRecDesignation] = useState('Technical Recruiter');
  const [recIndustry, setRecIndustry] = useState('Technology');
  const [recEmail, setRecEmail] = useState('');
  const [recPassword, setRecPassword] = useState('');

  // Admin Credentials
  const [adminEmail, setAdminEmail] = useState('admin@university.edu');
  const [adminPassword, setAdminPassword] = useState('admin123');

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentAuthMode === 'login') {
      setIsSubmitting(true);
      window.setTimeout(() => {
        const student = students.find(
          (s) => s.email.toLowerCase().trim() === studentEmail.toLowerCase().trim()
        );
        if (student && student.password === studentPassword) {
          setError('');
          onLogin('student', student.id);
        } else {
          setError('Invalid student credentials. Please check email/password.');
        }
        setIsSubmitting(false);
      }, 450);
      return;
    } else {
      // Validate registration
      if (!regName || !regEmail || !regPassword) {
        setError('Please fill in all required fields.');
        return;
      }
      if (students.some((s) => s.email.toLowerCase().trim() === regEmail.toLowerCase().trim())) {
        setError('A student with this email is already registered.');
        return;
      }
      const cgpaNum = parseFloat(regCgpa);
      if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
        setError('CGPA must be a number between 0 and 10.');
        return;
      }
      const backlogsNum = parseInt(regBacklogs);
      if (isNaN(backlogsNum) || backlogsNum < 0) {
        setError('Backlogs cannot be negative.');
        return;
      }

      const newStudent: Student = {
        id: `std_${Math.random().toString(36).substr(2, 9)}`,
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        branch: regBranch,
        cgpa: cgpaNum,
        backlogs: backlogsNum,
        placementStatus: 'Unplaced',
        resumeScore: 0,
        skills: regSkills.split(',').map(s => s.trim()).filter(Boolean),
        projectsCount: parseInt(regProjects) || 0,
        resumeText: regResume,
        applications: []
      };

      onRegister(newStudent);
      setStudentEmail(newStudent.email);
      setStudentPassword(newStudent.password || '');
      setStudentAuthMode('login');
      setError('');
    }
  };

  const handleRecruiterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recruiterAuthMode === 'login') {
      setIsSubmitting(true);
      window.setTimeout(() => {
        const recruiter = recruiters.find(
          (r) => r.email.toLowerCase().trim() === recruiterEmail.toLowerCase().trim()
        );
        if (recruiter && recruiter.password === recruiterPassword) {
          setError('');
          onLogin('recruiter', recruiter.id);
        } else {
          setError('Invalid recruiter credentials. Please check email/password.');
        }
        setIsSubmitting(false);
      }, 450);
      return;
    } else {
      if (!recName || !recCompany || !recEmail || !recPassword) {
        setError('Please fill in all required fields.');
        return;
      }
      if (recruiters.some((r) => r.email.toLowerCase().trim() === recEmail.toLowerCase().trim())) {
        setError('A recruiter with this email is already registered.');
        return;
      }

      const newRecruiter: Recruiter = {
        id: `rec_${Math.random().toString(36).substr(2, 9)}`,
        name: recName.trim(),
        email: recEmail.trim(),
        password: recPassword,
        companyName: recCompany.trim(),
        designation: recDesignation.trim() || 'Recruiter',
        industry: recIndustry
      };

      onRegisterRecruiter(newRecruiter);
      setRecruiterEmail(newRecruiter.email);
      setRecruiterPassword(newRecruiter.password || '');
      setRecruiterAuthMode('login');
      setError('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    window.setTimeout(() => {
      if (adminEmail === 'admin@university.edu' && adminPassword === 'admin123') {
        setError('');
        onLogin('admin');
      } else {
        setError('Invalid admin credentials. Use: admin@university.edu / admin123');
      }
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div className="flex flex-col min-h-screen">
    <div className="auth-layout">
      {/* Background glow effects built into page */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb bg-glow-orb-1"></div>
        <div className="bg-glow-orb bg-glow-orb-2"></div>
      </div>
      <div className="auth-hero">
        <span className="hero-badge">
          AI Powered Placement Management
        </span>

        <h1>
          Transform Campus Placements
        </h1>

        <p>
          Track students, manage drives, analyze resumes,
          conduct mock interviews and improve placement rates.
        </p>

        <div className="hero-stats">
          <div>
            <h2>5000+</h2>
            <span>Students</span>
          </div>

          <div>
            <h2>300+</h2>
            <span>Companies</span>
          </div>

          <div>
            <h2>95%</h2>
            <span>Success Rate</span>
          </div>
        </div>
      </div>

      <div className="auth-card animate-slide-in">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/15 rounded-2xl text-indigo-400 mb-3 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <GraduationCap size={32} />
          </div>
          <h1 className="auth-title">TPOHelper</h1>
          <p className="text-sm text-gray-400 mt-1">University Placement & Training Portal</p>
        </div>

        {/* Auth Role Tabs */}
        <div className="role-switch">
          <button
            onClick={() => {
              setActiveTab('student');
              setError('');
            }}
            className={`role-btn ${activeTab === 'student' ? 'active' : ''
              }`}
          >
            <GraduationCap size={18} strokeWidth={2.2} />
            Student
          </button>

          <button
            onClick={() => {
              setActiveTab('recruiter');
              setError('');
            }}
            className={`role-btn ${activeTab === 'recruiter' ? 'active' : ''
              }`}
          >
            <Building2 size={18} strokeWidth={2.2} />
            Recruiter
          </button>

          <button
            onClick={() => {
              setActiveTab('admin');
              setError('');
            }}
            className={`role-btn ${activeTab === 'admin' ? 'active' : ''
              }`}
          >
            <Shield size={18} />
            TPO Admin
          </button>
        </div>
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-lg p-3 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            {error}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'student' ? (
          <div className="animate-slide-in">
            {/* Student Auth Mode Switcher */}
            <div className="auth-mode-tabs">
              <button
                type="button"
                onClick={() => {
                  setStudentAuthMode('login');
                  setError('');
                }}
                className={studentAuthMode === 'login' ? 'active' : ''}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setStudentAuthMode('register');
                  setError('');
                }}
                className={studentAuthMode === 'register' ? 'active' : ''}
              >
                Register New Account
              </button>
            </div>

            <form onSubmit={handleStudentSubmit} className="flex flex-col gap-4">
              {studentAuthMode === 'login' ? (
                <>
                  <div className="input-group">
                    <label className="input-label">Student Email</label>

                    <div className="input-box">
                      <Mail size={18} />
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="student@univ.edu"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-box">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Signing In…
                      </>
                    ) : (
                      <>
                        Sign In as Student
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="max-h-[520px] overflow-y-auto pr-1 flex flex-col gap-2">
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Aravind Sharma"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Email Address</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="aravind@univ.edu"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Password</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Branch</label>
                      <select
                        value={regBranch}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setRegBranch(e.target.value as typeof regBranch)
                        }
                        className="input-field"
                      >
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Electrical">Electrical</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="input-group">
                      <label className="input-label">CGPA</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={regCgpa}
                        onChange={(e) => setRegCgpa(e.target.value)}
                        placeholder="8.5"
                        min="0"
                        max="10"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Backlogs</label>
                      <input
                        type="number"
                        required
                        value={regBacklogs}
                        onChange={(e) => setRegBacklogs(e.target.value)}
                        placeholder="0"
                        min="0"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Projects Count</label>
                      <input
                        type="number"
                        required
                        value={regProjects}
                        onChange={(e) => setRegProjects(e.target.value)}
                        placeholder="2"
                        min="0"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Skills (comma-separated)</label>
                    <input
                      type="text"
                      required
                      value={regSkills}
                      onChange={(e) => setRegSkills(e.target.value)}
                      placeholder="React, TypeScript, SQL"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Resume Plain Text summary</label>
                    <textarea
                      rows={3}
                      required
                      value={regResume}
                      onChange={(e) => setRegResume(e.target.value)}
                      placeholder="Summary of experience and projects..."
                      className="input-field resize-none text-xs"
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 mt-2 shrink-0" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating Profile…
                      </>
                    ) : (
                      <>
                        Register Profile
                        <UserPlus size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : activeTab === 'recruiter' ? (
          <div className="animate-slide-in">
            {/* Recruiter Auth Mode Switcher */}
            <div className="auth-mode-tabs">
              <button
                type="button"
                onClick={() => {
                  setRecruiterAuthMode('login');
                  setError('');
                }}
                className={recruiterAuthMode === 'login' ? 'active' : ''}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecruiterAuthMode('register');
                  setError('');
                }}
                className={recruiterAuthMode === 'register' ? 'active' : ''}
              >
                Register Company
              </button>
            </div>

            <form onSubmit={handleRecruiterSubmit} className="flex flex-col gap-4">
              {recruiterAuthMode === 'login' ? (
                <>
                  <div className="input-group">
                    <label className="input-label">Work Email</label>
                    <div className="input-box">
                      <Mail size={18} />
                      <input
                        type="email"
                        required
                        value={recruiterEmail}
                        onChange={(e) => setRecruiterEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-box">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={recruiterPassword}
                        onChange={(e) => setRecruiterPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 mt-2" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Signing In…
                      </>
                    ) : (
                      <>
                        Sign In as Recruiter
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="max-h-[520px] overflow-y-auto pr-1 flex flex-col gap-2">
                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Full Name</label>
                      <input
                        type="text"
                        required
                        value={recName}
                        onChange={(e) => setRecName(e.target.value)}
                        placeholder="Ananya Iyer"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Company Name</label>
                      <input
                        type="text"
                        required
                        value={recCompany}
                        onChange={(e) => setRecCompany(e.target.value)}
                        placeholder="e.g. Google"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Work Email</label>
                      <input
                        type="email"
                        required
                        value={recEmail}
                        onChange={(e) => setRecEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Password</label>
                      <input
                        type="password"
                        required
                        value={recPassword}
                        onChange={(e) => setRecPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="input-group">
                      <label className="input-label">Designation</label>
                      <input
                        type="text"
                        value={recDesignation}
                        onChange={(e) => setRecDesignation(e.target.value)}
                        placeholder="e.g. Technical Recruiter"
                        className="input-field"
                      />
                    </div>
                    <div className="input-group">
                      <label className="input-label">Industry</label>
                      <select
                        value={recIndustry}
                        onChange={(e) => setRecIndustry(e.target.value)}
                        className="input-field"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Consulting">Consulting</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3 mt-2 shrink-0" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating Account…
                      </>
                    ) : (
                      <>
                        Register Company
                        <UserPlus size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        ) : (
          <form onSubmit={handleAdminSubmit} className="animate-slide-in">
            <div className="input-group">
              <label className="input-label">Admin Email Address</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@university.edu"
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Admin Password</label>
              <div className="input-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="text-gray-500 hover:text-gray-300 transition-colors shrink-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-info-card">
              <div className="flex justify-between">
                <span>Default Admin Email:</span>
                <span className="font-mono text-white font-medium">admin@university.edu</span>
              </div>
              <div className="flex justify-between">
                <span>Default Password:</span>
                <span className="font-mono text-white font-medium">admin123</span>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  Authenticate Admin
                  <LogIn size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Database Seeder banner */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-col items-center gap-3">
          <p className="text-[10px] text-gray-500 text-center leading-relaxed">
            Evaluation Mode: Start with a clean system, or seed the interactive placement database instantly.
          </p>
          <button
            type="button"
            onClick={onSeedData}
            className="btn btn-secondary btn-sm flex items-center gap-2 text-indigo-300 hover:text-indigo-200 border-indigo-500/20 hover:border-indigo-500/40"
          >
            <Database size={14} />
            Seed Sample Data
          </button>
        </div>
      </div>
    </div>

      <Footer />
    </div>
  );
};
