import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { Auth } from './components/Auth';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { RecruiterPortal } from './components/RecruiterPortal';
import { LandingPage } from './components/LandingPage';
import { FeaturesPage } from './components/FeaturesPage';
import { HowItWorksPage } from './components/HowItWorksPage';
import { AlumniPortal } from './components/AlumniPortal';
import { Notification } from './components/Notification';
import { RouteLoadingBar } from './components/RouteLoadingBar';
import type { ToastType } from './components/Notification';
import { INITIAL_STUDENTS, INITIAL_DRIVES, INITIAL_RECRUITERS } from './mockData';
import { INITIAL_CALENDAR_EVENTS } from './mockCalendar';
import type { Student, PlacementDrive, Application, Recruiter } from './mockData';
import type { CalendarEvent } from './api/types';
import { GraduationCap, LogOut, Shield, Building2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { ResumeFeedback } from './mockData';

// Protected route guard
const ProtectedRoute = ({
  children,
  allowedRole,
  session
}: {
  children: React.ReactElement;
  allowedRole: 'student' | 'recruiter' | 'admin';
  session: { role: 'student' | 'admin' | 'recruiter'; studentId?: string; recruiterId?: string } | null;
}) => {
  if (!session) {
    return <Navigate to="/auth?mode=login" replace />;
  }
  if (session.role !== allowedRole) {
    return <Navigate to={`/${session.role}`} replace />;
  }
  return children;
};

function NavLinksWithSlidingUnderline() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/how-it-works', label: 'How it Works' }
  ];

  const activePath = hoveredPath !== null ? hoveredPath : location.pathname;

  return (
    <nav className="landing-nav-links" onMouseLeave={() => setHoveredPath(null)}>
      {navItems.map((item) => {
        const isRouteActive = location.pathname === item.path;
        const isTargeted = activePath === item.path;

        return (
          <Link
            key={item.path}
            to={item.path}
            onMouseEnter={() => setHoveredPath(item.path)}
            className={`landing-nav-link relative py-1 px-1 transition-colors duration-200 ${
              isRouteActive ? 'text-blue-600 font-bold' : 'text-slate-700 hover:text-blue-600'
            }`}
          >
            <span className="relative z-10">{item.label}</span>
            {isTargeted && (
              <motion.div
                layoutId="landing-nav-sliding-underline"
                className="absolute bottom-[-2px] left-0 right-0 h-[2.5px] bg-blue-600 rounded-full pointer-events-none"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
          </Link>
        );
      })}
      <button onClick={() => navigate('/auth?mode=login')} className="landing-nav-btn">
        Sign In
      </button>
    </nav>
  );
}

function AppContent() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('tpo_students');
    return saved ? JSON.parse(saved) : [];
  });
  const [drives, setDrives] = useState<PlacementDrive[]>(() => {
    const saved = localStorage.getItem('tpo_drives');
    return saved ? JSON.parse(saved) : [];
  });
  const [recruiters, setRecruiters] = useState<Recruiter[]>(() => {
    const saved = localStorage.getItem('tpo_recruiters');
    return saved ? JSON.parse(saved) : [];
  });
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [session, setSession] = useState<{
    role: 'student' | 'admin' | 'recruiter';
    studentId?: string;
    recruiterId?: string;
  } | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);

  // Helper to trigger toast notifications
  const triggerToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({
      id: Math.random().toString(36).substr(2, 9),
      message,
      type
    });
  };

  // Synchronize state with localStorage
  useEffect(() => {
    localStorage.setItem('tpo_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('tpo_drives', JSON.stringify(drives));
  }, [drives]);

  useEffect(() => {
    localStorage.setItem('tpo_recruiters', JSON.stringify(recruiters));
  }, [recruiters]);

  // Seed sample data convenience helper
  const handleSeedData = () => {
    setStudents(INITIAL_STUDENTS);
    setDrives(INITIAL_DRIVES);
    setRecruiters(INITIAL_RECRUITERS);
    triggerToast('Sample data seeded successfully. Feel free to log in!', 'success');
  };

  const handleLogin = (role: 'student' | 'admin' | 'recruiter', id?: string) => {
    if (role === 'student') {
      setSession({ role, studentId: id });
      const std = students.find((s) => s.id === id);
      triggerToast(`Welcome back, ${std?.name || 'Student'}!`, 'success');
      navigate('/student');
    } else if (role === 'recruiter') {
      setSession({ role, recruiterId: id });
      const rec = recruiters.find((r) => r.id === id);
      triggerToast(`Welcome back, ${rec?.name || 'Recruiter'} from ${rec?.companyName || 'Company'}!`, 'success');
      navigate('/recruiter');
    } else {
      setSession({ role });
      triggerToast('Administrator authenticated successfully.', 'success');
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    setSession(null);
    triggerToast('Logged out successfully.', 'info');
    navigate('/auth?mode=login');
  };

  // Student apply to drive
  const handleApplyDrive = (driveId: string) => {
    if (!session || session.role !== 'student' || !session.studentId) return;

    const student = students.find((s) => s.id === session.studentId);
    const drive = drives.find((d) => d.id === driveId);
    if (!student || !drive) return;

    // Verify student hasn't already applied
    if (student.applications.some((a) => a.driveId === driveId)) {
      triggerToast('You have already submitted an application for this drive.', 'warning');
      return;
    }

    const newApp: Application = {
      driveId: drive.id,
      jobPostingId: drive.id,
      companyName: drive.companyName,
      role: drive.title,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      currentRoundIndex: 0
    };

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === session.studentId) {
          return {
            ...s,
            applications: [newApp, ...s.applications]
          };
        }
        return s;
      })
    );

    setDrives((prevDrives) =>
      prevDrives.map((d) => {
        if (d.id === driveId) {
          return {
            ...d,
            registeredCount: (d.registeredCount || 0) + 1
          };
        }
        return d;
      })
    );

    triggerToast(`Application submitted successfully for ${drive.companyName}!`, 'success');
  };

  // Student updates resume ATS text/score
  const handleUpdateResumeScore = (score: number, resumeText: string) => {
    if (!session || session.role !== 'student' || !session.studentId) return;

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === session.studentId) {
          return {
            ...s,
            resumeScore: score,
            resumeText
          };
        }
        return s;
      })
    );

    triggerToast(`Resume index optimized! New ATS Score: ${score}%`, 'success');
  };

  // Student updates profile details
  const handleUpdateStudentProfile = (updatedStudent: Student) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    triggerToast('Profile settings saved successfully.', 'success');
  };

  // Admin (or recruiter) launches new drive
  const handleAddDrive = (newDriveData: Omit<PlacementDrive, 'id' | 'registeredCount'>, recruiterId?: string) => {
    const newDrive: PlacementDrive = {
      ...newDriveData,
      id: `drv_${Math.random().toString(36).substr(2, 9)}`,
      registeredCount: 0,
      recruiterId
    };

    setDrives((prevDrives) => [newDrive, ...prevDrives]);

    // Create corresponding calendar event for the new drive
    if (newDriveData.deadline) {
      const driveCalEvent: CalendarEvent = {
        id: Date.now(),
        title: `${newDriveData.companyName} - ${newDriveData.title}`,
        eventType: 'Deadline',
        companyName: newDriveData.companyName,
        company: newDriveData.companyName,
        role: newDriveData.title,
        scheduledDate: newDriveData.deadline,
        startTime: '23:59',
        location: newDriveData.location || 'Campus / Online',
        description: `Registration deadline for ${newDriveData.companyName} (${newDriveData.title}). Package: ${newDriveData.package}.`,
        status: 'SCHEDULED'
      };
      setCalendarEvents((prev) => [driveCalEvent, ...prev]);
    }

    triggerToast(`Recruitment drive for ${newDrive.companyName} created successfully!`, 'success');
  };

  const handleAddCalendarEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents((prev) => [newEvent, ...prev]);
    triggerToast(`Calendar Event "${newEvent.title}" published!`, 'success');
  };

  // Admin suspends/reactivates drive
  const handleToggleDriveActive = (driveId: string) => {
    setDrives((prevDrives) =>
      prevDrives.map((d) => {
        if (d.id === driveId) {
          const nextStatus = d.status === 'OPEN' ? 'CLOSED' : 'OPEN';
          triggerToast(
            `Drive for ${d.companyName} has been ${nextStatus === 'OPEN' ? 'activated' : 'suspended'}.`,
            nextStatus === 'OPEN' ? 'success' : 'warning'
          );
          return { ...d, status: nextStatus as 'OPEN' | 'CLOSED' };
        }
        return d;
      })
    );
  };

  // Admin updates student placement status manually
  const handleUpdateStudentStatus = (studentId: string, company?: string, salaryPackage?: string) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === studentId) {
          if (company && salaryPackage) {
            triggerToast(`${s.name} marked as Placed @ ${company}!`, 'success');
            return {
              ...s,
              placementStatus: 'Placed' as const,
              placedCompany: company,
              placedPackage: salaryPackage
            };
          } else {
            triggerToast(`${s.name} status reset to Unplaced.`, 'info');
            return {
              ...s,
              placementStatus: 'Unplaced' as const,
              placedCompany: undefined,
              placedPackage: undefined
            };
          }
        }
        return s;
      })
    );
  };

  // Admin promotes candidate in tracker pipeline
  const handlePromoteStudent = (
    studentId: string,
    driveId: string,
    newRoundIndex: number,
    isFinalSelection: boolean
  ) => {
    const student = students.find((s) => s.id === studentId);
    const drive = drives.find((d) => d.id === driveId);
    if (!student || !drive) return;

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === studentId) {
          const updatedApps = s.applications.map((app) => {
            if (app.jobPostingId === driveId) {
              if (isFinalSelection) {
                return {
                  ...app,
                  status: 'Selected' as const,
                  currentRoundIndex: newRoundIndex - 1,
                  feedback: `Offer issued! Selected for the role of ${drive.title} with a salary package of ${drive.package}.`
                };
              } else {
                const nextRoundName = drive.rounds ? drive.rounds[newRoundIndex] : `Round ${newRoundIndex + 1}`;
                return {
                  ...app,
                  status: nextRoundName as any,
                  currentRoundIndex: newRoundIndex,
                  feedback: `Successfully cleared stage. Promoted to "${nextRoundName}".`
                };
              }
            }
            return app;
          });

          if (isFinalSelection) {
            return {
              ...s,
              placementStatus: 'Placed' as const,
              placedCompany: drive.companyName,
              placedPackage: String(drive.package),
              applications: updatedApps
            };
          }

          return {
            ...s,
            applications: updatedApps
          };
        }
        return s;
      })
    );

    if (isFinalSelection) {
      triggerToast(`Congratulations! ${student.name} has been selected for ${drive.companyName}!`, 'success');
    } else {
      triggerToast(`${student.name} promoted to "${drive.rounds[newRoundIndex]}" for ${drive.companyName}.`, 'success');
    }
  };

  // Admin rejects student candidate
  const handleRejectStudent = (studentId: string, driveId: string) => {
    const student = students.find((s) => s.id === studentId);
    const drive = drives.find((d) => d.id === driveId);
    if (!student || !drive) return;

    setStudents((prevStudents) =>
      prevStudents.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            applications: s.applications.map((app) => {
              if (app.jobPostingId === driveId) {
                return {
                  ...app,
                  status: 'Rejected' as const,
                  feedback: `Recruitment cycle concluded at stage "${drive.rounds[app.currentRoundIndex]}". Better luck next time!`
                };
              }
              return app;
            })
          };
        }
        return s;
      })
    );

    triggerToast(`${student.name} marked as Rejected for ${drive.companyName}.`, 'warning');
  };

  const saveFeedback = (studentId: string, feedback: ResumeFeedback) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              resumeFeedback: feedback
            }
          : student
      )
    );
  };

  // Get active logged in student object
  const loggedInStudent =
    session?.role === 'student' ? students.find((s) => s.id === session.studentId) : undefined;

  // Get active logged in recruiter object
  const loggedInRecruiter =
    session?.role === 'recruiter' ? recruiters.find((r) => r.id === session.recruiterId) : undefined;

  const handleRegisterStudent = (newStudent: Student) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
    triggerToast(`Student registration successful! Please sign in.`, 'success');
  };

  const handleRegisterRecruiter = (newRecruiter: Recruiter) => {
    setRecruiters((prevRecruiters) => [...prevRecruiters, newRecruiter]);
    triggerToast(`Recruiter account created for ${newRecruiter.companyName}! Please sign in.`, 'success');
  };

  return (
    <div className="app-shell">
      {/* Route Loading Transition Bar */}
      <RouteLoadingBar />

      {/* Global Notification system */}
      <Notification toast={toast} onClose={() => setToast(null)} />

      {/* Top-Level Global App Navbar */}
      <header className="app-header">
        <div className="app-logo">
          <GraduationCap className="logo-icon animate-pulse" size={26} />
          <Link to="/" className="font-display font-extrabold text-xl text-[hsl(var(--text-primary))] hover:opacity-90 no-underline">
            PlaceX
          </Link>
        </div>

        {session ? (
          <div className="user-nav-profile">
            {session.role === 'student' && loggedInStudent ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[hsl(var(--text-primary))] truncate max-w-30">{loggedInStudent.name}</span>
                  <span className="text-[10px] text-[hsl(var(--text-secondary))] font-semibold uppercase">{loggedInStudent.department}</span>
                </div>
                <div className="avatar">{loggedInStudent.name.charAt(0)}</div>
              </div>
            ) : session.role === 'recruiter' && loggedInRecruiter ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[hsl(var(--text-primary))] truncate max-w-30">{loggedInRecruiter.name}</span>
                  <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">{loggedInRecruiter.companyName} Recruiter</span>
                </div>
                <div className="avatar bg-linear-to-br from-sky-400 to-blue-600">
                  <Building2 size={16} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-[hsl(var(--text-primary))]">TPO Coordinator</span>
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Administrator</span>
                </div>
                <div className="avatar bg-linear-to-br from-blue-500 to-indigo-600">
                  <Shield size={16} className="text-white" />
                </div>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm p-1.5 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <NavLinksWithSlidingUnderline />
        )}
      </header>

      {/* Routes Switcher */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route
            path="/auth"
            element={
              <Auth
                students={students}
                recruiters={recruiters}
                onLogin={handleLogin}
                onRegister={handleRegisterStudent}
                onRegisterRecruiter={handleRegisterRecruiter}
                onSeedData={handleSeedData}
              />
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student" session={session}>
                {loggedInStudent ? (
                  <StudentPortal
                    currentStudent={loggedInStudent}
                    drives={drives}
                    calendarEvents={calendarEvents}
                    onLogout={handleLogout}
                    onApply={handleApplyDrive}
                    onUpdateResumeScore={handleUpdateResumeScore}
                    onUpdateStudentProfile={handleUpdateStudentProfile}
                  />
                ) : (
                  <Navigate to="/auth?mode=login" replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter"
            element={
              <ProtectedRoute allowedRole="recruiter" session={session}>
                {loggedInRecruiter ? (
                  <RecruiterPortal
                    recruiter={loggedInRecruiter}
                    students={students}
                    drives={drives}
                    onLogout={handleLogout}
                    onAddDrive={(driveData) => handleAddDrive(driveData, loggedInRecruiter.id)}
                    onToggleDriveActive={handleToggleDriveActive}
                    onPromoteStudent={handlePromoteStudent}
                    onRejectStudent={handleRejectStudent}
                  />
                ) : (
                  <Navigate to="/auth?mode=login" replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin" session={session}>
                <AdminPortal
                  students={students}
                  drives={drives}
                  calendarEvents={calendarEvents}
                  onAddCalendarEvent={handleAddCalendarEvent}
                  onLogout={handleLogout}
                  onAddDrive={handleAddDrive}
                  onToggleDriveActive={handleToggleDriveActive}
                  onUpdateStudentStatus={handleUpdateStudentStatus}
                  onPromoteStudent={handlePromoteStudent}
                  onRejectStudent={handleRejectStudent}
                  onSeedData={handleSeedData}
                  onSaveFeedback={saveFeedback}
                />
              </ProtectedRoute>
            }
          />
          <Route path="/alumni" element={<AlumniPortal onLogout={handleLogout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
