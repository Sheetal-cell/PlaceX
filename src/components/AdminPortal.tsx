import React, { useState, useEffect, useMemo } from 'react';
import { studentApi } from "../api/studentApi";
import { jobPostingApi } from "../api/jobPostingApi";

import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitMerge,
  LogOut,
  Plus,
  Search,
  Check,
  X,
  FileText,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import type {
  Student,
  PlacementDrive,
  ResumeFeedback
} from "../mockData";
import type { StudentWithPlacement, DriveWithCompany } from "../api/types";
import { Footer } from './Footer';
import { ScrapedDrives } from "./scrapper/ScrapedDrives";
import CalendarPage from "./calendar/CalendarPage";

import HROutreach from "./hr/HROutreach";


import type { CalendarEvent } from "../api/types";

interface AdminPortalProps {
  students: Student[];
  drives: PlacementDrive[];
  calendarEvents?: CalendarEvent[];
  onAddCalendarEvent?: (newEvent: CalendarEvent) => void;
  onLogout: () => void;
  onAddDrive: (drive: Omit<PlacementDrive, 'id' | 'registeredCount'>) => void;
  onToggleDriveActive: (driveId: string) => void;
  onUpdateStudentStatus: (studentId: string, company?: string, salaryPackage?: string) => void;
  onPromoteStudent: (studentId: string, driveId: string, newRoundIndex: number, isFinalSelection: boolean) => void;
  onRejectStudent: (studentId: string, driveId: string) => void;
  onSeedData?: () => void;
  onSaveFeedback: (
    studentId: string,
    feedback: ResumeFeedback
  ) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  students,
  drives,
  calendarEvents,
  onAddCalendarEvent,
  onSaveFeedback,
  onLogout,
  onAddDrive: _onAddDrive,
  onToggleDriveActive,
  onUpdateStudentStatus,
  onPromoteStudent,
  onRejectStudent,
  onSeedData
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drives' | 'scraped' | 'students' | 'tracker' | 'calendar' | 'hr'>('dashboard');


  // New Drive Form State
  const [showDriveForm, setShowDriveForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [role, setRole] = useState('');
  const [pkg, setPkg] = useState('');
  const [numericPkg, setNumericPkg] = useState(6);
  const [cgpaCutoff, setCgpaCutoff] = useState(7.0);
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [allowedBranches, setAllowedBranches] = useState<string[]>(['Computer Science', 'Information Technology']);
  const [deadline, setDeadline] = useState('2026-06-30');
  const [jobDesc, setJobDesc] = useState('');
  const [skillsRequiredText, setSkillsRequiredText] = useState('React, JavaScript, Node.js');
  // State

  const [roundsText, setRoundsText] = useState('Aptitude Test, Technical Interview, HR Interview');

  // Student Database Filter State
  const [realStudents, setRealStudents] = useState<StudentWithPlacement[] | null>(null);

  // Fetch real student + placement data once on mount
  useEffect(() => {
    studentApi.getAllWithPlacementInfo()
      .then(setRealStudents)
      .catch((err) => console.error("Failed to load students:", err));
  }, []);

  // Real drives (job postings + company info), replacing mock 'drives' once loaded
  const [realDrives, setRealDrives] = useState<DriveWithCompany[] | null>(null);

  useEffect(() => {
    jobPostingApi.getAllWithCompanyInfo()
      .then(setRealDrives)
      .catch((err) => console.error("Failed to load drives:", err));
  }, []);

  // Falls back to mock drives until the real fetch resolves — used everywhere
  // below instead of the raw `drives` prop.
  const effectiveDrives: (DriveWithCompany | PlacementDrive)[] = realDrives ?? drives;

  const [studentSearch, setStudentSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState(5.0);
  const [minAtsFilter, setMinAtsFilter] = useState(0);

  // Selected student for resume view
  const [selectedStudentForResume, setSelectedStudentForResume] = useState<Student | StudentWithPlacement | null>(null);
  const [review, setReview] = useState({

    score: 80,

    status: "Good",

    projects: "",

    skills: "",

    experience: "",

    ats: "",

    overall: ""

  });

  // Manual Status Change state
  const [statusChangeStudentId, setStatusChangeStudentId] = useState<string | null>(null);
  const [placedCompanyInput, setPlacedCompanyInput] = useState('');
  const [placedPackageInput, setPlacedPackageInput] = useState('');

  // Mobile popover details state
  const [activePopoverStudent, setActivePopoverStudent] = useState<Student | StudentWithPlacement | null>(null);

  // Live Round Tracker Selection
  const [trackerDriveId, setTrackerDriveId] = useState<string>(effectiveDrives[0]?.id || '');

  // Combine real backend students with current application student list (including new sign-ups)
  const allStudents = useMemo(() => {
    const baseList = realStudents && realStudents.length > 0 ? realStudents : students;
    const knownKeys = new Set(baseList.map(s => s.registrationNumber?.toLowerCase().trim() || s.email.toLowerCase().trim()));
    const extraStudents = students.filter(s => !knownKeys.has(s.registrationNumber?.toLowerCase().trim() || s.email.toLowerCase().trim()));
    return [...baseList, ...extraStudents];
  }, [realStudents, students]);

  // ----------------------------------------------------
  // Computations for Analytics & KPI
  // ----------------------------------------------------
  const totalStudentsCount = allStudents.length;
  const placedStudents = allStudents.filter(s => s.placementStatus === 'Placed');
  const placedCount = placedStudents.length;
  const placementRate = totalStudentsCount > 0 ? Math.round((placedCount / totalStudentsCount) * 100) : 0;
  const activeDrivesCount = effectiveDrives.filter(d => d.status === 'OPEN').length;

  const totalPackageSum = placedStudents.reduce((sum, s) => {
    if (!s.placedPackage) return sum;
    const num = parseFloat(String(s.placedPackage).replace(/[^\d.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const averagePackage = placedCount > 0 ? (totalPackageSum / placedCount).toFixed(1) : '0.0';

  // Compute Branch Distribution data
  const branches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical'];
  const branchData = branches.map(br => {
    const branchStudents = allStudents.filter(s => s.department === br);
    const branchPlaced = branchStudents.filter(s => s.placementStatus === 'Placed');
    const pct = branchStudents.length > 0 ? Math.round((branchPlaced.length / branchStudents.length) * 100) : 0;
    return { name: br, pct, total: branchStudents.length, placed: branchPlaced.length };
  });

  // Handle new drive submission — creates (or reuses) the company, then posts
  // the job under it via the real backend.
  const handleDriveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !role || !pkg || !companyLocation) return;

    try {
      const newDrive = await jobPostingApi.createDrive(
        companyName,
        companyLocation,
        companyWebsite || undefined,
        {
          title: role,
          description: jobDesc,
          location: jobLocation,
          eligibleCGPACutoff: Number(cgpaCutoff),
          allowedBacklogs: Number(maxBacklogs),
          allowedBranches: allowedBranches.join(', '),
          requiredSkills: skillsRequiredText,
          salary: Number(numericPkg),
          deadline,
        }
      );
      setRealDrives(prev => prev ? [newDrive, ...prev] : [newDrive]);
    } catch (err) {
      console.error("Failed to create drive:", err);
      alert("Failed to create drive — check the console for details.");
      return;
    }

    // Reset Form
    setCompanyName('');
    setCompanyLocation('');
    setCompanyWebsite('');
    setJobLocation('');
    setRole('');
    setPkg('');
    setNumericPkg(6);
    setCgpaCutoff(7.0);
    setMaxBacklogs(0);
    setAllowedBranches(['Computer Science', 'Information Technology']);
    setDeadline('2026-06-30');
    setJobDesc('');
    setSkillsRequiredText('React, JavaScript, Node.js');
    setRoundsText('Aptitude Test, Technical Interview, HR Interview');
    setShowDriveForm(false);
  };

  const handleBranchCheckbox = (branch: string) => {
    if (allowedBranches.includes(branch)) {
      setAllowedBranches(allowedBranches.filter(b => b !== branch));
    } else {
      setAllowedBranches([...allowedBranches, branch]);
    }
  };

  // Filter students roster
  const filteredStudents = allStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
      (student.registrationNumber && student.registrationNumber.toLowerCase().includes(studentSearch.toLowerCase()));
    const matchesBranch = branchFilter === 'All' || student.department === branchFilter;
    const matchesStatus = statusFilter === 'All' || student.placementStatus === statusFilter;
    const matchesCgpa = student.cgpa >= minCgpaFilter;
    const matchesAts = (student.resumeScore ?? 0) >= minAtsFilter;
    return matchesSearch && matchesBranch && matchesStatus && matchesCgpa && matchesAts;
  });

  const handleManualStatusSave = (studentId: string) => {
    if (!placedCompanyInput.trim() || !placedPackageInput.trim()) return;
    onUpdateStudentStatus(studentId, placedCompanyInput.trim(), placedPackageInput.trim() + ' LPA');
    setStatusChangeStudentId(null);
    setPlacedCompanyInput('');
    setPlacedPackageInput('');
  };

  // Toggle a real drive's OPEN/CLOSED status against the backend
  const handleToggleDriveStatus = async (drive: DriveWithCompany | PlacementDrive) => {
    const nextStatus = drive.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    if (!realDrives) {
      // still on mock fallback — just use the original mock toggle
      onToggleDriveActive(drive.id);
      return;
    }
    try {
      await jobPostingApi.updateStatus(Number(drive.id), nextStatus);
      setRealDrives(prev =>
        prev ? prev.map(d => d.id === drive.id ? { ...d, status: nextStatus } : d) : prev
      );
    } catch (err) {
      console.error("Failed to update drive status:", err);
      alert("Failed to update status — check the console for details.");
    }
  };

  // Tracker details
  const activeTrackerDrive = effectiveDrives.find(d => d.id === trackerDriveId);
  const activeTrackerApplications = students.flatMap(s =>
    s.applications
      .filter(app => app.jobPostingId === trackerDriveId && app.status !== 'Rejected' && app.status !== 'Selected')
      .map(app => ({ student: s, app }))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="dashboard-layout dashboard-bg">
        {/* Sidebar navigation */}
        <aside className="side-menu animate-slide-in">
          <div className="admin-profile-card">
            <div className="admin-avatar">
              TA
            </div>

            <h3>TPO Administration</h3>
            <p>University Admin Panel</p>

            <div className="admin-stats">
              <div>
                <span>33%</span>
                <small>Placement Rate</small>
              </div>

              <div>
                <span>5</span>
                <small>Active Drives</small>
              </div>
            </div>
          </div>

          <div className="glass-card flex flex-col gap-1.5 p-3">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('drives')}
              className={`menu-item ${activeTab === 'drives' ? 'active' : ''}`}
            >
              <Briefcase size={18} />
              Recruitment Drives
            </button>
            <button
              onClick={() => setActiveTab("scraped")}
              className={`menu-item ${activeTab === "scraped" ? "active" : ""
                }`}
            >
              🌐
              Recruitment Feed
            </button>

            <button
              onClick={() => setActiveTab("calendar")}
              className={`menu-item ${activeTab === "calendar" ? "active" : ""
                }`}
            >

              Placement Calendar

            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`menu-item ${activeTab === 'students' ? 'active' : ''}`}
            >
              <Users size={18} />
              Student Database
            </button>
            <button
              onClick={() => setActiveTab('tracker')}
              className={`menu-item ${activeTab === 'tracker' ? 'active' : ''}`}
            >
              <GitMerge size={18} />
              Live Round Tracker
            </button>

            <div className="border-t border-white/5 my-3"></div>
            <button
              onClick={() => setActiveTab("hr")}
              className={`menu-item ${activeTab === "hr" ? "active" : ""
                }`}
            >
              📧 HR Outreach
            </button>

            <button
              onClick={onLogout}
              className="menu-item hover:bg-red-500/10 hover:text-red-400 text-gray-400"
            >
              <LogOut size={18} />
              Log Out
            </button>

            {onSeedData && (
              <button
                onClick={onSeedData}
                className="menu-item hover:bg-blue-500/10 hover:text-blue-400 text-gray-400 mt-2"
                title="Reset & Load Sample Data"
              >
                <Plus size={18} />
                Reset & Seed Data
              </button>
            )}
          </div>
        </aside>

        {/* Main content grid */}
        <main className="flex flex-col gap-6 animate-slide-in">

          {/* TAB 1: DASHBOARD & CHARTS */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-6 animate-slide-in">
              <div className="dashboard-hero">
                <div className="hero-icon">
                  <ShieldCheck size={80} />
                </div>

                <div className="hero-content">
                  <span className="hero-badge">
                    ● SYSTEM OPERATIONAL
                  </span>

                  <h1>TPO Dashboard Analytics</h1>

                  <div className="hero-pills">
                    <span>{activeDrivesCount} Active Drives</span>
                    <span>{placedCount} Students Placed</span>
                    <span>Avg Package {averagePackage} LPA</span>
                  </div>

                  <p>
                    Track recruitment drives, oversee student
                    application cycles, update stage transitions,
                    and generate cohort graphs.
                  </p>
                </div>
              </div>





              {/* Dashboard metrics */}
              <div className="metrics-grid">
                <div className="dashboard-stat-card">
                  <div className="metric-icon-box">
                    <Users size={20} />
                  </div>
                  <div className="metric-value text-4xl font-black">{totalStudentsCount}</div>
                  <div className="metric-label">Total Student Roster</div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="metric-icon-box">
                    <Check size={20} />
                  </div>
                  <div className="metric-value text-4xl font-black">{placedCount}</div>
                  <div className="metric-label">Placed Students ({placementRate}%)</div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="metric-icon-box">
                    <Briefcase size={20} />
                  </div>
                  <div className="metric-value text-4xl font-black">{activeDrivesCount}</div>
                  <div className="metric-label">Active Drives Running</div>
                </div>

                <div className="dashboard-stat-card">
                  <div className="metric-icon-box">
                    <TrendingUp size={20} />
                  </div>
                  <div className="metric-value text-4xl font-black">{averagePackage} LPA</div>
                  <div className="metric-label">Average CTC Offered</div>
                </div>
              </div>

              {/* Visual Charts (Custom SVGs) */}
              <div className="content-grid">
                {/* Chart 1: Drives package distribution */}
                <div className="modern-chart-card">
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-400" />
                    Salary Package Distribution (LPA)
                  </h3>

                  <div className="chart-container flex items-end justify-around pt-6 border-b border-l border-white/5 pb-2">
                    {effectiveDrives.map((drive) => {
                      const maxHeight = 160;
                      const pkgNum = typeof drive.numericPackage === 'number' && !isNaN(drive.numericPackage) ? drive.numericPackage : 0;
                      const maxPackage = Math.max(...effectiveDrives.map(d => typeof d.numericPackage === 'number' && !isNaN(d.numericPackage) ? d.numericPackage : 0), 35);
                      const barHeight = maxPackage > 0 ? (pkgNum / maxPackage) * maxHeight : 0;

                      return (
                        <div key={drive.id} className="flex flex-col items-center group w-12 relative">
                          {/* Tooltip value */}
                          <span className="absolute -top-6 bg-slate-900 border border-indigo-500/20 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono z-10">
                            {drive.package}
                          </span>

                          {/* SVG Bar */}
                          <div
                            className="w-8 rounded-t-md custom-chart-bar"
                            style={{
                              height: `${barHeight}px`,
                              background: `linear-gradient(to top, hsl(var(--color-primary)), hsl(var(--color-secondary)))`,
                              boxShadow: '0 0 15px -3px hsl(var(--color-primary) / 30%)'
                            }}
                          ></div>

                          <p className="text-[10px] text-gray-500 mt-2 truncate w-full text-center" title={drive.companyName}>
                            {drive.companyName}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: Branch Placements rate */}
                <div className="glass-card flex flex-col gap-4">
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <Users size={16} className="text-sky-400" />
                    Placement Rates by Department
                  </h3>

                  <div className="flex flex-col gap-3.5 justify-center py-2 h-full">
                    {branchData.map((data) => (
                      <div key={data.name} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-300 font-medium">{data.name}</span>
                          <span className="text-sky-300 font-bold font-mono">{data.pct}% ({data.placed}/{data.total})</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-linear-to-r from-sky-400 to-blue-600 rounded-full transition-all duration-1000"
                            style={{ width: `${data.pct}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DRIVE MANAGEMENT */}
          {activeTab === 'drives' && (
            <div className="flex flex-col gap-6 animate-slide-in">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Manage Recruitment Drives</h2>
                  <p className="text-xs text-gray-400 mt-1">Configure selection criteria, branches eligibility, and recruitment steps.</p>
                </div>
                <button
                  onClick={() => setShowDriveForm(!showDriveForm)}
                  className="btn btn-primary"
                >
                  {showDriveForm ? <X size={16} /> : <Plus size={16} />}
                  {showDriveForm ? 'Close Editor' : 'Launch New Drive'}
                </button>
              </div>

              {/* Form Drawer */}
              {showDriveForm && (
                <form onSubmit={handleDriveSubmit} className="glass-card animate-slide-in grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderLeft: '4px solid hsl(var(--color-primary))' }}>
                  <div className="input-group">
                    <label className="input-label">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Company Location (HQ / office on file)</label>
                    <input
                      type="text"
                      required
                      value={companyLocation}
                      onChange={(e) => setCompanyLocation(e.target.value)}
                      placeholder="e.g. Bangalore, India"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Company Website (optional)</label>
                    <input
                      type="text"
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="e.g. https://google.com"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Job Role Name</label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Associate Software Engineer"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Job Location (this specific posting)</label>
                    <input
                      type="text"
                      required
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder="e.g. Hyderabad (may differ from company HQ)"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">CTC Package (Text)</label>
                    <input
                      type="text"
                      required
                      value={pkg}
                      onChange={(e) => setPkg(e.target.value)}
                      placeholder="e.g. 18 LPA"
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Package (Numeric, for charts)</label>
                    <input
                      type="number"
                      required
                      value={numericPkg}
                      onChange={(e) => setNumericPkg(Number(e.target.value))}
                      min={1}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">CGPA Cut-off threshold</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={cgpaCutoff}
                      onChange={(e) => setCgpaCutoff(Number(e.target.value))}
                      min={0}
                      max={10}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Max Active Backlogs Allowed</label>
                    <input
                      type="number"
                      required
                      value={maxBacklogs}
                      onChange={(e) => setMaxBacklogs(Number(e.target.value))}
                      min={0}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group md:col-span-2">
                    <label className="input-label">Eligible Branches</label>
                    <div className="flex flex-wrap gap-4 mt-1 bg-white/5 border border-white/10 p-3.5 rounded-xl">
                      {branches.map(br => (
                        <label key={br} className="flex items-center gap-2 text-xs cursor-pointer text-gray-300">
                          <input
                            type="checkbox"
                            checked={allowedBranches.includes(br)}
                            onChange={() => handleBranchCheckbox(br)}
                            className="accent-indigo-500"
                          />
                          {br}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Registration Deadline</label>
                    <input
                      type="date"
                      required
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Required Skills (Comma separated)</label>
                    <input
                      type="text"
                      required
                      value={skillsRequiredText}
                      onChange={(e) => setSkillsRequiredText(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group md:col-span-2">
                    <label className="input-label">Recruitment Pipeline Rounds (Comma separated order)</label>
                    <input
                      type="text"
                      required
                      value={roundsText}
                      onChange={(e) => setRoundsText(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="input-group md:col-span-2 mb-0">
                    <label className="input-label">Job Description summary</label>
                    <textarea
                      rows={4}
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      placeholder="Provide full description of job role expectations..."
                      className="input-field resize-none text-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary md:col-span-2 py-3"
                  >
                    Create and Launch Campaign
                  </button>
                </form>
              )}

              {/* Drives list */}
              <div className="flex flex-col gap-4">
                {effectiveDrives.map(drive => (
                  <div
                    key={drive.id}
                    className="glass-card flex flex-col md:flex-row justify-between md:items-center gap-4 hover:scale-[1.01] transition-all duration-300"
                    style={{
                      borderLeft: drive.status === "OPEN"
                        ? "4px solid #6366f1"
                        : "4px solid #ef4444"
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-xl text-white font-display">{drive.companyName}</h3>
                        <span className="badge badge-info">{drive.package}</span>
                        <span className={`badge ${drive.status === "OPEN" ? 'badge-success' : 'badge-danger'}`}>
                          {drive.status === "OPEN" ? 'Active' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-400 mt-1 font-semibold">{drive.title}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {drive.skillsRequired.slice(0, 4).map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-3xl mt-1.5">{drive.description}</p>

                      <div className="flex gap-4 flex-wrap mt-3 text-[10px] text-gray-500 font-semibold">
                        <span>Location: {('location' in drive && drive.location) || 'Not specified'}</span>
                        <span>Cut-off: {drive.cgpaCutoff} CGPA</span>
                        <span>Max Backlogs: {drive.maxBacklogs}</span>
                        <span>Candidates Registered: {drive.registeredCount}</span>
                        <span>Deadline: {drive.deadline}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleDriveStatus(drive)}
                        className={`btn btn-sm ${drive.status === "OPEN" ? 'btn-danger' : 'btn-success'}`}
                      >
                        {drive.status === "OPEN" ? 'Suspend Drive' : 'Reactivate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {
            activeTab === "scraped" &&
            (
              <ScrapedDrives />
            )
          }


          {/* TAB 3: STUDENT DATABASE */}
          {activeTab === 'students' && (
            <div className="flex flex-col gap-6 animate-slide-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">Student Placement Roster</h2>
                  <p className="text-xs text-gray-400 mt-1">Review student eligibility database, check academic status, edit placement statuses, and filter by Branch, CGPA & ATS score.</p>
                </div>
                <div className="px-3.5 py-1.5 bg-slate-800/80 border border-white/10 rounded-xl text-xs text-slate-300 self-start md:self-auto font-medium">
                  Showing <span className="font-bold text-sky-400">{filteredStudents.length}</span> of <span className="font-bold text-white">{allStudents.length}</span> Students
                </div>
              </div>

              {/* Filter tools bar */}
              <div className="glass-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 p-6 rounded-2xl border border-white/10 shadow-lg">
                <div className="input-group mb-0">
                  <label className="input-label font-semibold text-gray-300">Search Student</label>
                  <input
                    type="text"
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Name, email, reg no..."
                    className="input-field text-xs py-2.5 px-3.5 rounded-xl border border-white/10 bg-slate-900/60 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="input-group mb-0">
                  <label className="input-label font-semibold text-gray-300">Branch / Dept</label>
                  <select
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="input-field text-xs py-2.5 px-3.5 rounded-xl border border-white/10 bg-slate-900/60 focus:border-sky-500"
                  >
                    <option value="All">All Departments</option>
                    {branches.map(br => <option key={br} value={br}>{br}</option>)}
                  </select>
                </div>

                <div className="input-group mb-0">
                  <label className="input-label font-semibold text-gray-300">Placement Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input-field text-xs py-2.5 px-3.5 rounded-xl border border-white/10 bg-slate-900/60 focus:border-sky-500"
                  >
                    <option value="All">All Status</option>
                    <option value="Placed">Placed</option>
                    <option value="Unplaced">Unplaced</option>
                  </select>
                </div>

                <div className="input-group mb-0">
                  <label className="input-label flex justify-between font-semibold text-gray-300">
                    <span>Min CGPA</span>
                    <span className="font-bold text-sky-400">{minCgpaFilter.toFixed(1)}+</span>
                  </label>
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.1"
                    value={minCgpaFilter}
                    onChange={(e) => setMinCgpaFilter(Number(e.target.value))}
                    className="accent-sky-400 mt-3 w-full cursor-pointer"
                  />
                </div>

                <div className="input-group mb-0">
                  <label className="input-label flex justify-between font-semibold text-gray-300">
                    <span>Min ATS Score</span>
                    <span className="font-bold text-emerald-400">{minAtsFilter}%+</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={minAtsFilter}
                    onChange={(e) => setMinAtsFilter(Number(e.target.value))}
                    className="accent-emerald-400 mt-3 w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Student grid table */}
              <div className="glass-card p-0 border border-white/10 rounded-2xl overflow-hidden w-full shadow-xl">
                {/* Desktop View Table */}
                <table className="hidden md:table w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300 font-bold bg-slate-900/80 uppercase tracking-wider text-[11px]">
                      <th className="px-6 py-4">Student Info</th>
                      <th className="px-6 py-4">Branch</th>
                      <th className="px-6 py-4">CGPA / Backlogs</th>
                      <th className="px-6 py-4">Placement Status</th>
                      <th className="px-6 py-4">ATS Match</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-gray-300">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          <p className="text-sm font-semibold">No students match the selected filter parameters.</p>
                          <p className="text-xs text-gray-500 mt-1">Try resetting or adjusting Branch, CGPA, ATS score, or search input.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map(student => (
                        <tr
                          key={student.id}
                          className="hover:bg-sky-500/5 transition-all duration-200"
                        >
                          <td className="px-6 py-4.5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-sky-500 flex items-center justify-center font-bold text-white shrink-0 shadow-md">
                                {student.name.charAt(0)}
                              </div>

                              <div>
                                <p className="font-semibold text-white text-sm">
                                  {student.name}
                                </p>

                                <p className="text-xs text-gray-400 mt-0.5">
                                  {student.email} {student.registrationNumber ? `• ${student.registrationNumber}` : ''}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4.5 font-medium text-slate-300">{student.department}</td>
                          <td className="px-6 py-4.5 font-mono text-xs">
                            <span className="font-bold text-white">{student.cgpa}</span> CGPA
                            <span className="text-gray-400 text-[11px] ml-1">({student.backlogs} Backlogs)</span>
                          </td>
                          <td className="px-6 py-4.5">
                            {student.placementStatus === 'Placed' ? (
                              <div className="flex flex-col gap-1">
                                <span className="badge badge-success self-start">Placed</span>
                                <span className="text-[11px] text-sky-400 font-semibold truncate max-w-44" title={student.placedCompany}>
                                  {student.placedCompany} ({student.placedPackage})
                                </span>
                              </div>
                            ) : (
                              <span className="badge badge-warning self-start">Unplaced</span>
                            )}
                          </td>
                          <td className="px-6 py-4.5 font-mono font-bold text-emerald-400 text-sm">
                            {student.resumeScore}%
                          </td>
                          <td className="px-6 py-4.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setSelectedStudentForResume(student)}
                                className="btn btn-secondary btn-sm p-1.5"
                                title="Review Resume Text"
                              >
                                <FileText size={14} />
                              </button>

                              {statusChangeStudentId === student.id ? (
                                <div className="flex gap-1 items-center bg-slate-900 border border-white/10 p-2 rounded-xl text-left absolute right-4 z-55 animate-slide-in shadow-2xl">
                                  <div className="flex flex-col gap-1.5">
                                    <input
                                      type="text"
                                      placeholder="Company Name"
                                      value={placedCompanyInput}
                                      onChange={(e) => setPlacedCompanyInput(e.target.value)}
                                      className="input-field p-1 text-[10px] w-28 h-7"
                                    />
                                    <input
                                      type="text"
                                      placeholder="LPA Package"
                                      value={placedPackageInput}
                                      onChange={(e) => setPlacedPackageInput(e.target.value)}
                                      className="input-field p-1 text-[10px] w-28 h-7"
                                    />
                                    <div className="flex justify-end gap-1">
                                      <button
                                        onClick={() => setStatusChangeStudentId(null)}
                                        className="btn btn-danger btn-sm p-1 h-5 text-[9px]"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handleManualStatusSave(student.id)}
                                        className="btn btn-success btn-sm p-1 h-5 text-[9px]"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    if (student.placementStatus === 'Placed') {
                                      // Set back to unplaced
                                      onUpdateStudentStatus(student.id);
                                    } else {
                                      setStatusChangeStudentId(student.id);
                                    }
                                  }}
                                  className={`btn btn-sm ${student.placementStatus === 'Placed' ? 'btn-danger' : 'btn-success'}`}
                                >
                                  {student.placementStatus === 'Placed' ? 'Mark Unplaced' : 'Set Placed'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Mobile / Tablet Compact View */}
                <div className="md:hidden flex flex-col divide-y divide-white/5 w-full max-w-full min-width-0">
                  {filteredStudents.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No students match the selected filter parameters.
                    </div>
                  ) : (
                    filteredStudents.map(student => (
                      <div
                        key={student.id}
                        onClick={() => {
                          setActivePopoverStudent(student);
                          setStatusChangeStudentId(null);
                        }}
                        className="flex justify-between items-center p-4 hover:bg-blue-500/5 cursor-pointer transition-colors student-mobile-row w-full max-w-full min-w-0"
                      >
                        <div className="flex flex-col gap-1 min-w-0 flex-1 pr-3">
                          <span className="font-semibold text-white truncate student-mobile-name w-full block">
                            {student.name}
                          </span>
                          <span className="text-[10px] text-gray-500 truncate student-mobile-secondary w-full block">
                            {student.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 min-w-0">
                          {student.placementStatus === 'Placed' ? (
                            <span className="badge badge-success text-[10px] shrink-0">Placed</span>
                          ) : (
                            <span className="badge badge-warning text-[10px] shrink-0">Unplaced</span>
                          )}
                          <ChevronRight size={14} className="text-gray-400 shrink-0" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Responsive Student Detail Dialog popup (Sheet style for mobile) */}
              {activePopoverStudent && (
                <div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
                    onClick={() => {
                      setActivePopoverStudent(null);
                      setStatusChangeStudentId(null);
                    }}
                  />

                  {/* Content Dialog box */}
                  <div className="glass-card modal-box relative z-10 w-full max-w-md p-6 animate-scale-in max-h-[85vh] overflow-y-auto student-mobile-popover-content">
                    <div className="flex justify-between items-center border-b border-glass pb-3 mb-4" style={{ borderColor: 'var(--border-glass)' }}>
                      <h3 className="text-base font-bold font-display student-mobile-popover-title">Student Profile Record</h3>
                      <button
                        onClick={() => {
                          setActivePopoverStudent(null);
                          setStatusChangeStudentId(null);
                        }}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        aria-label="Close details"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      {/* Name and Email */}
                      <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                        <div className="w-12 h-12 rounded-full bg-linear-to-r from-blue-500 to-sky-500 flex items-center justify-center font-bold text-white text-lg shrink-0">
                          {activePopoverStudent.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-white truncate">{activePopoverStudent.name}</h4>
                          <p className="text-[10px] text-gray-500 truncate">{activePopoverStudent.email}</p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Branch/Dept</span>
                          <span className="font-semibold text-white truncate block">{activePopoverStudent.department}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">ATS Score</span>
                          <span className="font-semibold text-blue-400 font-mono">{activePopoverStudent.resumeScore}%</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">CGPA</span>
                          <span className="font-semibold text-white font-mono">{activePopoverStudent.cgpa} CGPA</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">Backlogs</span>
                          <span className="font-semibold text-white font-mono">{activePopoverStudent.backlogs}</span>
                        </div>
                      </div>

                      {/* Placement Status */}
                      <div className="border-t border-white/5 pt-3">
                        <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider mb-1">Placement Status</span>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <div>
                              {activePopoverStudent.placementStatus === 'Placed' ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="badge badge-success self-start">Placed</span>
                                  <span className="text-xs text-slate-400 mt-1 font-semibold block truncate max-w-44" title={activePopoverStudent.placedCompany}>
                                    @ {activePopoverStudent.placedCompany} ({activePopoverStudent.placedPackage})
                                  </span>
                                </div>
                              ) : (
                                <span className="badge badge-warning">Unplaced</span>
                              )}
                            </div>

                            {statusChangeStudentId !== activePopoverStudent.id && (
                              <button
                                onClick={() => {
                                  if (activePopoverStudent.placementStatus === 'Placed') {
                                    onUpdateStudentStatus(activePopoverStudent.id);
                                    setActivePopoverStudent(prev => prev ? { ...prev, placementStatus: 'Unplaced', placedCompany: undefined, placedPackage: undefined } : null);
                                  } else {
                                    setStatusChangeStudentId(activePopoverStudent.id);
                                  }
                                }}
                                className={`btn btn-sm ${activePopoverStudent.placementStatus === 'Placed' ? 'btn-danger' : 'btn-success'}`}
                              >
                                {activePopoverStudent.placementStatus === 'Placed' ? 'Mark Unplaced' : 'Set Placed'}
                              </button>
                            )}
                          </div>

                          {statusChangeStudentId === activePopoverStudent.id && (
                            <div className="flex flex-col gap-2 bg-slate-900/50 border border-white/5 p-3 rounded-lg mt-1 text-left w-full">
                              <div>
                                <label className="text-[9px] text-gray-400 block mb-1">Company Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Microsoft"
                                  value={placedCompanyInput}
                                  onChange={(e) => setPlacedCompanyInput(e.target.value)}
                                  className="input-field p-2 text-xs w-full font-sans"
                                />
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-400 block mb-1">LPA Package</label>
                                <input
                                  type="text"
                                  placeholder="e.g. 14 LPA"
                                  value={placedPackageInput}
                                  onChange={(e) => setPlacedPackageInput(e.target.value)}
                                  className="input-field p-2 text-xs w-full font-sans"
                                />
                              </div>
                              <div className="flex justify-end gap-1.5 mt-1">
                                <button
                                  onClick={() => setStatusChangeStudentId(null)}
                                  className="btn btn-danger btn-sm px-2.5 py-1 text-xs"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => {
                                    if (!placedCompanyInput.trim() || !placedPackageInput.trim()) {
                                      alert("Please enter both company name and package details.");
                                      return;
                                    }
                                    onUpdateStudentStatus(activePopoverStudent.id, placedCompanyInput, placedPackageInput);
                                    setActivePopoverStudent(prev => prev ? {
                                      ...prev,
                                      placementStatus: 'Placed',
                                      placedCompany: placedCompanyInput,
                                      placedPackage: placedPackageInput
                                    } : null);
                                    setStatusChangeStudentId(null);
                                    setPlacedCompanyInput('');
                                    setPlacedPackageInput('');
                                  }}
                                  className="btn btn-success btn-sm px-2.5 py-1 text-xs"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Resume actions */}
                      <div className="border-t border-white/5 pt-3 flex justify-end">
                        <button
                          onClick={() => {
                            setSelectedStudentForResume(activePopoverStudent);
                            setActivePopoverStudent(null);
                          }}
                          className="btn btn-secondary btn-sm flex items-center gap-2"
                        >
                          <FileText size={14} />
                          Review Resume Text
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Local Scoped Responsive Overrides Style Tag */}
              <style>{`
                .student-mobile-row {
                  background: var(--bg-card) !important;
                  border-bottom: 1px solid var(--border-glass) !important;
                  transition: var(--transition-smooth);
                }
                .student-mobile-row:hover {
                  background: var(--bg-card-secondary) !important;
                }
                .light .student-mobile-row:hover {
                  background: #E8ECE7 !important;
                }
                .dark .student-mobile-row:hover {
                  background: #35432E !important;
                }
                .student-mobile-name {
                  color: var(--text-primary) !important;
                }
                .light .student-mobile-name {
                  color: #2C3424 !important;
                }
                .student-mobile-secondary {
                  color: var(--text-secondary) !important;
                }
                .light .student-mobile-secondary {
                  color: #514D45 !important;
                }
                .dark .student-mobile-secondary {
                  color: #DADED8 !important;
                }
                .student-mobile-popover-content {
                  background: var(--bg-card) !important;
                  border: 1px solid var(--border-glass) !important;
                  color: var(--text-primary) !important;
                  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4) !important;
                }
                .light .student-mobile-popover-content {
                  background: #FFFDF8 !important;
                  border-color: #C9C4B8 !important;
                  color: #2E2923 !important;
                  box-shadow: 0 12px 30px rgba(46, 41, 35, 0.08) !important;
                }
                .student-mobile-popover-title {
                  color: hsl(var(--color-primary)) !important;
                }
                .light .student-mobile-popover-title {
                  color: #4C583E !important;
                }
                .dark .student-mobile-popover-title {
                  color: #B59E7D !important;
                }
                
                @keyframes fadeIn {
                  from { opacity: 0; }
                  to { opacity: 1; }
                }
                @keyframes scaleIn {
                  from { transform: scale(0.95); opacity: 0; }
                  to { transform: scale(1); opacity: 1; }
                }
                .animate-fade-in {
                  animation: fadeIn 0.2s ease-out forwards;
                }
                .animate-scale-in {
                  animation: scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
              `}</style>
            </div>
          )}

          {/* TAB 4: LIVE RECRUITMENT TRACKER */}
          {activeTab === 'tracker' && (
            <div className="flex flex-col gap-6 animate-slide-in">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Live Round Stage Tracker</h2>
                  <p className="text-xs text-gray-400 mt-1">Select an active placement campaign and coordinator pipeline. Drag-click students to coordinate rounds.</p>
                </div>

                <div className="input-group max-w-xs mb-0">
                  <select
                    value={trackerDriveId}
                    onChange={(e) => setTrackerDriveId(e.target.value)}
                    className="input-field text-xs h-9 py-1"
                  >
                    {effectiveDrives.map(drv => (
                      <option key={drv.id} value={drv.id}>{drv.companyName} - {drv.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {activeTrackerDrive ? (
                <div className="flex flex-col gap-4">
                  <div className="glass-card p-4 bg-slate-900/50 flex gap-4 text-xs">
                    <div className="flex-1">
                      <span className="text-gray-500 font-semibold">Recruiting:</span> <span className="text-white font-bold">{activeTrackerDrive.companyName}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 font-semibold">Package:</span> <span className="text-white font-bold">{activeTrackerDrive.package}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-500 font-semibold">Total Steps:</span> <span className="text-blue-400 font-bold">{('rounds' in activeTrackerDrive ? activeTrackerDrive.rounds : []).join(' ➔ ')}</span>
                    </div>
                  </div>

                  {/* Kanban board layout */}
                  <div className="live-tracker-board">
                    {('rounds' in activeTrackerDrive ? activeTrackerDrive.rounds : []).map((roundName, colIndex) => {
                      // Filter candidates in this specific round index
                      const columnApplications = activeTrackerApplications.filter(item =>
                        item.app.currentRoundIndex === colIndex
                      );

                      const isLastCol = colIndex === (('rounds' in activeTrackerDrive ? activeTrackerDrive.rounds.length : 0)) - 1;

                      return (
                        <div
                          key={roundName}
                          className="tracker-column animate-slide-in hover:border-indigo-500/30 transition-all duration-300"
                        >
                          <div className="column-header">
                            <h4 className="column-title truncate max-w-35" title={roundName}>{roundName}</h4>
                            <span className="column-count">{columnApplications.length}</span>
                          </div>

                          <div className="flex flex-col gap-2 pt-2">
                            {columnApplications.length === 0 ? (
                              <div className="text-center py-8 text-gray-600 text-[10px]">
                                Empty Stage
                              </div>
                            ) : (
                              columnApplications.map(({ student }) => (
                                <div key={student.id} className="candidate-card hover:scale-[1.02] hover:border-indigo-500/30 transition-all duration-300">
                                  <p className="candidate-name text-white truncate">{student.name}</p>
                                  <p className="candidate-details mt-0.5">{student.department} (CGPA: {student.cgpa})</p>

                                  <div className="candidate-actions">
                                    <button
                                      onClick={() => onRejectStudent(student.id, activeTrackerDrive.id)}
                                      className="btn btn-danger btn-sm p-1 h-5 text-[9px] flex items-center justify-center"
                                      title="Mark Rejected"
                                    >
                                      <X size={10} />
                                    </button>
                                    <button
                                      onClick={() => onPromoteStudent(student.id, activeTrackerDrive.id, colIndex + 1, isLastCol)}
                                      className="btn btn-success btn-sm p-1 h-5 text-[9px] flex items-center gap-1"
                                      title={isLastCol ? 'Select Candidate' : 'Move Next'}
                                    >
                                      {isLastCol ? 'Select' : <ArrowRight size={10} />}
                                    </button>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="glass-card text-center py-12 text-gray-500">
                  <Briefcase size={40} className="mx-auto opacity-20 mb-3" />
                  <p className="text-sm">Please launch recruitment drives to activate Tracker pipelines.</p>
                </div>
              )}
            </div>
          )}

          {
            activeTab === "calendar" &&

            <CalendarPage events={calendarEvents} onAddEvent={onAddCalendarEvent} />

          }
          {
            activeTab === "hr" &&
            <HROutreach />
          }

        </main>

        {/* Student Resume Review Modal overlay */}
        {selectedStudentForResume && (
          <div className="modal-overlay animate-slide-in">
            <div className="glass-card modal-content p-6 relative">
              <button
                onClick={() => setSelectedStudentForResume(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <FileText size={24} className="text-blue-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Resume Analyzer Report</h3>
                  <p className="text-xs text-gray-400">Candidate: {selectedStudentForResume.name} ({selectedStudentForResume.department})</p>
                </div>
              </div>

              <div className="flex gap-6 items-center p-3 bg-white/5 border border-white/10 rounded-xl mb-4 text-xs">
                <div>
                  <span className="text-gray-500 font-semibold">ATS Compatibility Score:</span>{' '}
                  <span className="font-mono font-bold text-blue-400 text-sm">{selectedStudentForResume.resumeScore}%</span>
                </div>
                <div>
                  <span className="text-gray-500 font-semibold">Projects count:</span>{' '}
                  <span className="text-white font-bold">{selectedStudentForResume.projectsCount}</span>
                </div>
              </div>

              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Resume Plain Text Body</h4>
              <div className="bg-black/30 p-4 rounded-xl text-xs text-gray-300 leading-relaxed font-mono overflow-y-auto max-h-60 border border-white/5 whitespace-pre-wrap">
                {selectedStudentForResume.resumeText}
              </div>

              <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 mt-4">Candidate Skills</h4>
              <div className="glass-card mt-6 p-5">

                <h3 className="text-lg font-bold text-white mb-4">

                  Resume Review

                </h3>

                <input
                  type="number"
                  className="input-field mb-3"
                  placeholder="Resume Score"
                  value={review.score}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      score: Number(e.target.value)
                    })
                  }
                />

                <select
                  className="input-field mb-3"
                  value={review.status}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      status: e.target.value
                    })
                  }
                >

                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Needs Improvement</option>

                </select>

                <textarea
                  rows={2}
                  placeholder="Projects Feedback"
                  className="input-field mb-3"
                  value={review.projects}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      projects: e.target.value
                    })
                  }
                />

                <textarea
                  rows={2}
                  placeholder="Skills Feedback"
                  className="input-field mb-3"
                  value={review.skills}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      skills: e.target.value
                    })
                  }
                />

                <textarea
                  rows={2}
                  placeholder="Experience Feedback"
                  className="input-field mb-3"
                  value={review.experience}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      experience: e.target.value
                    })
                  }
                />

                <textarea
                  rows={2}
                  placeholder="ATS Suggestions"
                  className="input-field mb-3"
                  value={review.ats}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      ats: e.target.value
                    })
                  }
                />

                <textarea
                  rows={4}
                  placeholder="Overall Feedback"
                  className="input-field"
                  value={review.overall}
                  onChange={(e) =>
                    setReview({
                      ...review,
                      overall: e.target.value
                    })
                  }
                />

                <button

                  className="btn btn-primary w-full mt-4"

                  onClick={() => {

                    if (!selectedStudentForResume) return;

                    onSaveFeedback(
                      selectedStudentForResume.id,
                      {
                        ...review,
                        // ensure status conforms to ResumeFeedback union
                        status: (() => {
                          const allowed = ['Good', 'Excellent', 'Needs Improvement'] as const;
                          return (allowed as readonly string[]).includes(review.status)
                            ? (review.status as 'Good' | 'Excellent' | 'Needs Improvement')
                            : 'Needs Improvement';
                        })(),
                        reviewedBy: 'TPO Admin',
                        reviewedOn: new Date().toLocaleDateString(),
                      }
                    );

                  }}

                >

                  Save Feedback

                </button>

              </div>

              <button
                onClick={() => setSelectedStudentForResume(null)}
                className="btn btn-secondary btn-sm w-full mt-6"
              >
                Close Analyzer
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};