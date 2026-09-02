import React, { useState } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  GitMerge,
  LogOut,
  Plus,
  X,
  FileText,
  ArrowRight,
  Building2,
  Users,
  TrendingUp,
  Award,
  Mail
} from 'lucide-react';
import type { Student, PlacementDrive, Recruiter } from '../mockData';
import { Footer } from './Footer';

interface RecruiterPortalProps {
  recruiter: Recruiter;
  students: Student[];
  drives: PlacementDrive[];
  onLogout: () => void;
  onAddDrive: (drive: Omit<PlacementDrive, 'id' | 'registeredCount' | 'recruiterId'>) => void;
  onToggleDriveActive: (driveId: string) => void;
  onPromoteStudent: (studentId: string, driveId: string, newRoundIndex: number, isFinalSelection: boolean) => void;
  onRejectStudent: (studentId: string, driveId: string) => void;
}

const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Electrical'];

export const RecruiterPortal: React.FC<RecruiterPortalProps> = ({
  recruiter,
  students,
  drives,
  onLogout,
  onAddDrive,
  onToggleDriveActive,
  onPromoteStudent,
  onRejectStudent
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drives' | 'tracker'>('dashboard');

  // Scoped to this recruiter's own company drives only
  const myDrives = drives.filter(d => d.recruiterId === recruiter.id);

  // New Drive Form State
  const [showDriveForm, setShowDriveForm] = useState(false);
  const [role, setRole] = useState('');
  const [pkg, setPkg] = useState('');
  const [numericPkg, setNumericPkg] = useState(6);
  const [cgpaCutoff, setCgpaCutoff] = useState(7.0);
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [allowedBranches, setAllowedBranches] = useState<string[]>(['Computer Science', 'Information Technology']);
  const [eligibleBatch, setEligibleBatch] = useState('2026 Batch');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [jobDesc, setJobDesc] = useState('');
  const [skillsRequiredText, setSkillsRequiredText] = useState('React, JavaScript, Node.js');
  const [roundsText, setRoundsText] = useState('Aptitude Test, Technical Interview, HR Interview');

  const [selectedStudentForResume, setSelectedStudentForResume] = useState<Student | null>(null);
  const [trackerDriveId, setTrackerDriveId] = useState<string>(myDrives[0]?.id || '');

  // ----------------------------------------------------
  // KPI computations, scoped to this recruiter's drives
  // ----------------------------------------------------
  const activeDrivesCount = myDrives.filter(d => d.status === 'OPEN').length;

  const myApplications = students.flatMap(s =>
    s.applications
      .filter(app => myDrives.some(d => d.id === app.jobPostingId))
      .map(app => ({ student: s, app }))
  );
  const totalApplicants = myApplications.length;

  const selectedCandidates = myApplications.filter(item => item.app.status === 'Selected');
  const placedCount = selectedCandidates.length;

  const totalPackageSum = myDrives.reduce((sum, d) => sum + (d.numericPackage || 0), 0);
  const averagePackage = myDrives.length > 0 ? (totalPackageSum / myDrives.length).toFixed(1) : '0.0';

  const handleDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !pkg) return;

    onAddDrive({
      companyName: recruiter.companyName,
      role,
      package: pkg.includes('LPA') ? pkg : `${pkg} LPA`,
      numericPackage: Number(numericPkg),
      cgpaCutoff: Number(cgpaCutoff ),
      maxBacklogs: Number(maxBacklogs),
      allowedBranches,
      eligibleBatch,
      deadline,
      jobDesc,
      skillsRequired: skillsRequiredText.split(',').map(s => s.trim()).filter(Boolean),
      rounds: roundsText.split(',').map(s => s.trim()).filter(Boolean),
      title: role,      
      description: jobDesc,
      status: 'OPEN',
      companyId: 0
    });

    // Reset form
    setRole('');
    setPkg('');
    setNumericPkg(6);
    setCgpaCutoff(7.0);
    setMaxBacklogs(0);
    setAllowedBranches(['Computer Science', 'Information Technology']);
    setEligibleBatch('2026 Batch');
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

  const activeTrackerDrive = myDrives.find(d => d.id === trackerDriveId);
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
            {recruiter.companyName.charAt(0)}
          </div>

          <h3>{recruiter.companyName}</h3>
          <p>{recruiter.designation}</p>

          <div className="admin-stats">
            <div>
              <span>{activeDrivesCount}</span>
              <small>Active Drives</small>
            </div>

            <div>
              <span>{totalApplicants}</span>
              <small>Applicants</small>
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
            My Drives
          </button>
          <button
            onClick={() => setActiveTab('tracker')}
            className={`menu-item ${activeTab === 'tracker' ? 'active' : ''}`}
          >
            <GitMerge size={18} />
            Applicant Tracker
          </button>

          <div className="border-t border-white/5 my-3"></div>

          <button
            onClick={onLogout}
            className="menu-item hover:bg-red-500/10 hover:text-red-400 text-gray-400"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content grid */}
      <main className="flex flex-col gap-6 animate-slide-in">

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6 animate-slide-in">
            <div className="dashboard-hero">
              <div className="hero-icon">
                <Building2 size={80} />
              </div>

              <div className="hero-content">
                <span className="hero-badge">
                  ● VERIFIED RECRUITER ACCOUNT
                </span>

                <h1>{recruiter.companyName} Hiring Console</h1>

                <div className="hero-pills">
                  <span>{activeDrivesCount} Active Drives</span>
                  <span>{totalApplicants} Applicants</span>
                  <span>{placedCount} Offers Made</span>
                </div>

                <p>
                  Post placement drives for {recruiter.companyName}, track applicants
                  through your own hiring pipeline, and extend offers — without
                  touching any other company's data.
                </p>
              </div>
            </div>

            <div className="metrics-grid">
              <div className="dashboard-stat-card">
                <div className="metric-icon-box">
                  <Briefcase size={20} />
                </div>
                <div className="metric-value text-4xl font-black">{activeDrivesCount}</div>
                <div className="metric-label">Active Drives Running</div>
              </div>

              <div className="dashboard-stat-card">
                <div className="metric-icon-box">
                  <Users size={20} />
                </div>
                <div className="metric-value text-4xl font-black">{totalApplicants}</div>
                <div className="metric-label">Total Applicants</div>
              </div>

              <div className="dashboard-stat-card">
                <div className="metric-icon-box">
                  <Award size={20} />
                </div>
                <div className="metric-value text-4xl font-black">{placedCount}</div>
                <div className="metric-label">Candidates Selected</div>
              </div>

              <div className="dashboard-stat-card">
                <div className="metric-icon-box">
                  <TrendingUp size={20} />
                </div>
                <div className="metric-value text-4xl font-black">{averagePackage} LPA</div>
                <div className="metric-label">Average Package Offered</div>
              </div>
            </div>

            {myDrives.length === 0 && (
              <div className="glass-card text-center py-12 text-gray-500">
                <Briefcase size={40} className="mx-auto opacity-20 mb-3" />
                <p className="text-sm mb-4">You haven't posted any drives yet.</p>
                <button onClick={() => { setActiveTab('drives'); setShowDriveForm(true); }} className="btn btn-primary btn-sm mx-auto">
                  <Plus size={14} />
                  Post Your First Drive
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY DRIVES */}
        {activeTab === 'drives' && (
          <div className="flex flex-col gap-6 animate-slide-in">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Manage {recruiter.companyName} Drives</h2>
                <p className="text-xs text-gray-400 mt-1">Post new openings and manage recruitment criteria for your own company only.</p>
              </div>
              <button
                onClick={() => setShowDriveForm(!showDriveForm)}
                className="btn btn-primary"
              >
                {showDriveForm ? <X size={16} /> : <Plus size={16} />}
                {showDriveForm ? 'Close Editor' : 'Post New Drive'}
              </button>
            </div>

            {showDriveForm && (
              <form onSubmit={handleDriveSubmit} className="glass-card animate-slide-in grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderLeft: '4px solid hsl(var(--color-primary))' }}>
                <div className="input-group md:col-span-2">
                  <label className="input-label">Company (locked to your recruiter account)</label>
                  <input type="text" value={recruiter.companyName} disabled className="input-field opacity-60 cursor-not-allowed" />
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
                    {BRANCHES.map(br => (
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
                  <label className="input-label">Eligible Graduation Batch</label>
                  <select
                    value={eligibleBatch}
                    onChange={(e) => setEligibleBatch(e.target.value)}
                    className="input-field"
                  >
                    <option value="2026 Batch">2026 Batch</option>
                    <option value="2025/2026 Batch">2025 / 2026 Batch</option>
                    <option value="2027 Batch">2027 Batch</option>
                    <option value="All Batches">All Batches</option>
                  </select>
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
                  <label className="input-label">Interview Pipeline Rounds (Comma separated order)</label>
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

                <button type="submit" className="btn btn-primary md:col-span-2 py-3">
                  Post Drive to Placement Board
                </button>
              </form>
            )}

            <div className="flex flex-col gap-4">
              {myDrives.length === 0 && !showDriveForm && (
                <div className="glass-card text-center py-12 text-gray-500">
                  <Briefcase size={40} className="mx-auto opacity-20 mb-3" />
                  <p className="text-sm">No drives posted yet for {recruiter.companyName}.</p>
                </div>
              )}
              {myDrives.map(drive => (
                <div
                  key={drive.id}
                  className="glass-card flex flex-col md:flex-row justify-between md:items-center gap-4 hover:scale-[1.01] transition-all duration-300"
                  style={{ borderLeft: drive.status === "OPEN" ? "4px solid #6366f1" : "4px solid #ef4444" }}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl text-white font-display">{drive.title}</h3>
                      <span className="badge badge-info">{drive.package}</span>
                      <span className={`badge ${drive.status === "OPEN" ? 'badge-success' : 'badge-danger'}`}>
                        {drive.status === "OPEN" ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {drive.skillsRequired.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300 text-[10px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 bg-slate-900/60 p-3 rounded-xl border border-white/5 text-xs text-gray-300">
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Min CGPA</span>
                        <span className="font-bold text-sky-400">{drive.cgpaCutoff} CGPA</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Max Backlogs</span>
                        <span className="font-bold text-amber-400">{drive.maxBacklogs}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Eligible Branches</span>
                        <span className="font-semibold text-white truncate block" title={Array.isArray(drive.allowedBranches) ? drive.allowedBranches.join(', ') : (drive.allowedBranches || 'All Branches')}>
                          {Array.isArray(drive.allowedBranches) ? drive.allowedBranches.join(', ') : (drive.allowedBranches || 'All Branches')}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase block font-semibold">Eligible Batch</span>
                        <span className="font-bold text-indigo-400">{drive.eligibleBatch || '2026 Batch'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => onToggleDriveActive(drive.id)}
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

        {/* TAB 3: APPLICANT TRACKER */}
        {activeTab === 'tracker' && (
          <div className="flex flex-col gap-6 animate-slide-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Applicant Pipeline</h2>
                <p className="text-xs text-gray-400 mt-1">Move candidates through your interview rounds and extend offers.</p>
              </div>

              {myDrives.length > 0 && (
                <div className="input-group max-w-xs mb-0">
                  <select
                    value={trackerDriveId}
                    onChange={(e) => setTrackerDriveId(e.target.value)}
                    className="input-field text-xs h-9 py-1"
                  >
                    {myDrives.map(drv => (
                      <option key={drv.id} value={drv.id}>{drv.role}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {activeTrackerDrive ? (
              <div className="flex flex-col gap-4">
                <div className="glass-card p-4 bg-slate-900/50 flex gap-4 text-xs">
                  <div className="flex-1">
                    <span className="text-gray-500 font-semibold">Role:</span> <span className="text-white font-bold">{activeTrackerDrive.title}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500 font-semibold">Package:</span> <span className="text-white font-bold">{activeTrackerDrive.package}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-500 font-semibold">Pipeline:</span> <span className="text-blue-400 font-bold">{activeTrackerDrive.rounds.join(' ➔ ')}</span>
                  </div>
                </div>

                <div className="live-tracker-board">
                  {activeTrackerDrive.rounds.map((roundName, colIndex) => {
                    const columnApplications = activeTrackerApplications.filter(item =>
                      item.app.currentRoundIndex === colIndex
                    );
                    const isLastCol = colIndex === activeTrackerDrive.rounds.length - 1;

                    return (
                      <div key={roundName} className="tracker-column animate-slide-in hover:border-blue-500/30 transition-all duration-300">
                        <div className="column-header">
                          <h4 className="column-title truncate max-w-35" title={roundName}>{roundName}</h4>
                          <span className="column-count">{columnApplications.length}</span>
                        </div>

                        <div className="flex flex-col gap-2 pt-2">
                          {columnApplications.length === 0 ? (
                            <div className="text-center py-8 text-gray-600 text-[10px]">Empty Stage</div>
                          ) : (
                            columnApplications.map(({ student }) => (
                              <div key={student.id} className="candidate-card hover:scale-[1.02] hover:border-blue-500/30 transition-all duration-300">
                                <button
                                  onClick={() => setSelectedStudentForResume(student)}
                                  className="candidate-name text-white truncate text-left hover:text-blue-300 transition-colors"
                                  title="View resume"
                                >
                                  {student.name}
                                </button>
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
                                    title={isLastCol ? 'Extend Offer' : 'Move Next'}
                                  >
                                    {isLastCol ? 'Offer' : <ArrowRight size={10} />}
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
                <p className="text-sm">Post a drive first to start tracking applicants.</p>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Candidate Resume Review Modal */}
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
                <h3 className="text-lg font-bold text-white font-display">Candidate Resume</h3>
                <p className="text-xs text-gray-400">{selectedStudentForResume.name} ({selectedStudentForResume.department})</p>
              </div>
            </div>

            <div className="flex gap-6 items-center p-3 bg-white/5 border border-white/10 rounded-xl mb-4 text-xs">
              <div>
                <span className="text-gray-500 font-semibold">ATS Score:</span>{' '}
                <span className="font-mono font-bold text-blue-400 text-sm">{selectedStudentForResume.resumeScore}%</span>
              </div>
              <div>
                <span className="text-gray-500 font-semibold">Projects:</span>{' '}
                <span className="text-white font-bold">{selectedStudentForResume.projectsCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail size={12} className="text-gray-500" />
                <span className="text-white">{selectedStudentForResume.email}</span>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Resume Summary</h4>
            <div className="bg-black/30 p-4 rounded-xl text-xs text-gray-300 leading-relaxed font-mono overflow-y-auto max-h-60 border border-white/5 whitespace-pre-wrap">
              {selectedStudentForResume.resumeText}
            </div>

            <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2 mt-4">Skills</h4>
            <div className="flex flex-wrap gap-1">
              {selectedStudentForResume.skills.map(s => (
                <span key={s} className="px-2.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded text-[10px]">{s}</span>
              ))}
            </div>

            <button
              onClick={() => setSelectedStudentForResume(null)}
              className="btn btn-secondary btn-sm w-full mt-6"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>

      <Footer />
    </div>
  );
};
