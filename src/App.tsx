import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { RecruiterPortal } from './components/RecruiterPortal';
import { Notification } from './components/Notification';
import type { ToastType } from './components/Notification';
import { INITIAL_STUDENTS, INITIAL_DRIVES, INITIAL_RECRUITERS } from './mockData';
import type { Student, PlacementDrive, Application, Recruiter } from './mockData';
import { GraduationCap, LogOut, Shield, Building2, Sun, Moon } from 'lucide-react';
import type { ResumeFeedback } from "./mockData";


function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

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
  const [session, setSession] = useState<{ role: 'student' | 'admin' | 'recruiter'; studentId?: string; recruiterId?: string } | null>(null);
  const [toast, setToast] = useState<ToastType | null>(null);

  const [headerHeight, setHeaderHeight] = useState(72);
  useEffect(() => {
    if (!session) return;
    const timer = setTimeout(() => {
      const header = document.querySelector('.app-header');
      if (header) {
        setHeaderHeight(header.clientHeight);
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            setHeaderHeight(entry.target.clientHeight);
          }
        });
        resizeObserver.observe(header);
        return () => resizeObserver.disconnect();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [session]);

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
      const std = students.find(s => s.id === id);
      triggerToast(`Welcome back, ${std?.name}!`, 'success');
    } else if (role === 'recruiter') {
      setSession({ role, recruiterId: id });
      const rec = recruiters.find(r => r.id === id);
      triggerToast(`Welcome back, ${rec?.name} from ${rec?.companyName}!`, 'success');
    } else {
      setSession({ role });
      triggerToast('Administrator authenticated successfully.', 'success');
    }
  };

  const handleLogout = () => {
    setSession(null);
    triggerToast('Logged out successfully.', 'info');
  };

  // Student apply to drive
  const handleApplyDrive = (driveId: string) => {
    if (!session || session.role !== 'student' || !session.studentId) return;

    const student = students.find(s => s.id === session.studentId);
    const drive = drives.find(d => d.id === driveId);
    if (!student || !drive) return;

    // Verify student hasn't already applied
    if (student.applications.some(a => a.driveId === driveId)) {
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

    setStudents(prevStudents =>
      prevStudents.map(s => {
        if (s.id === session.studentId) {
          return {
            ...s,
            applications: [newApp, ...s.applications]
          };
        }
        return s;
      })
    );

    setDrives(prevDrives =>
      prevDrives.map(d => {
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

    setStudents(prevStudents =>
      prevStudents.map(s => {
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
    setStudents(prevStudents =>
      prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
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

    setDrives(prevDrives => [newDrive, ...prevDrives]);
    triggerToast(`Recruitment drive for ${newDrive.companyName} created successfully!`, 'success');
  };

  // Admin suspends/reactivates drive
  const handleToggleDriveActive = (driveId: string) => {
  setDrives(prevDrives =>
    prevDrives.map(d => {
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
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    setStudents(prevStudents =>
      prevStudents.map(s => {
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
    const student = students.find(s => s.id === studentId);
    const drive = drives.find(d => d.id === driveId);
    if (!student || !drive) return;

    setStudents(prevStudents =>
      prevStudents.map(s => {
        if (s.id === studentId) {
          const updatedApps = s.applications.map(app => {
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

          // If final selection, automatically mark the student as Placed overall in their profile!
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
    const student = students.find(s => s.id === studentId);
    const drive = drives.find(d => d.id === driveId);
    if (!student || !drive) return;

    setStudents(prevStudents =>
      prevStudents.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            applications: s.applications.map(app => {
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

    setStudents(prev =>
        prev.map(student =>
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
  const loggedInStudent = session?.role === 'student'
    ? students.find(s => s.id === session.studentId)
    : undefined;

  // Get active logged in recruiter object
  const loggedInRecruiter = session?.role === 'recruiter'
    ? recruiters.find(r => r.id === session.recruiterId)
    : undefined;

  const handleRegisterStudent = (newStudent: Student) => {
    setStudents(prevStudents => [...prevStudents, newStudent]);
    triggerToast(`Student registration successful! Please sign in.`, 'success');
  };

  const handleRegisterRecruiter = (newRecruiter: Recruiter) => {
    setRecruiters(prevRecruiters => [...prevRecruiters, newRecruiter]);
    triggerToast(`Recruiter account created for ${newRecruiter.companyName}! Please sign in.`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background glow effects built into root */}
      <div className="bg-glow-container">
        <div className="bg-glow-orb bg-glow-orb-1"></div>
        <div className="bg-glow-orb bg-glow-orb-2"></div>
      </div>

      {/* Global Notification system */}
      <Notification toast={toast} onClose={() => setToast(null)} />

      {/* Main Header navigation bar */}
      {session && (
        <header className="app-header">
          <div className="app-logo">
            <GraduationCap className="logo-icon animate-pulse" size={24} />
            <span>PlaceX</span>
          </div>

          <div className="user-nav-profile">
            {session.role === 'student' && loggedInStudent ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-30">{loggedInStudent.name}</span>
                  <span className="text-[10px] text-gray-500 font-semibold uppercase">{loggedInStudent.department}</span>
                </div>
                <div className="avatar">{loggedInStudent.name.charAt(0)}</div>
              </div>
            ) : session.role === 'recruiter' && loggedInRecruiter ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white truncate max-w-30">{loggedInRecruiter.name}</span>
                  <span className="text-[10px] text-sky-400 font-bold uppercase tracking-wider">{loggedInRecruiter.companyName} Recruiter</span>
                </div>
                <div className="avatar bg-linear-to-br from-sky-400 to-blue-600">
                  <Building2 size={16} className="text-white" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white">TPO Coordinator</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Administrator</span>
                </div>
                <div className="avatar bg-linear-to-br from-blue-500 to-indigo-600">
                  <Shield size={16} className="text-white" />
                </div>
              </div>
            )}

            {/* Theme Change Button */}
            <button onClick={toggleTheme} className="theme-toggle-btn mr-3" aria-label="Toggle Theme" title="Toggle Theme Mode">
              <div className="theme-toggle-inner">
                {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-secondary btn-sm p-1.5 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>
      )}

      {/* Layout Router Router view switcher */}
      <div className="flex-1 flex flex-col" style={session ? { paddingTop: `${headerHeight}px` } : undefined}>
        {!session ? (
          <Auth
            students={students}
            recruiters={recruiters}
            onLogin={handleLogin}
            onRegister={handleRegisterStudent}
            onRegisterRecruiter={handleRegisterRecruiter}
            onSeedData={handleSeedData}
          />
        ) : session.role === 'student' && loggedInStudent ? (
          <StudentPortal
            currentStudent={loggedInStudent}
            drives={drives}
            onLogout={handleLogout}
            onApply={handleApplyDrive}
            onUpdateResumeScore={handleUpdateResumeScore}
            onUpdateStudentProfile={handleUpdateStudentProfile}
          />
        ) : session.role === 'recruiter' && loggedInRecruiter ? (
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
          <AdminPortal
            students={students}
            drives={drives}
            onLogout={handleLogout}
            onAddDrive={handleAddDrive}
            onToggleDriveActive={handleToggleDriveActive}
            onUpdateStudentStatus={handleUpdateStudentStatus}
            onPromoteStudent={handlePromoteStudent}
            onRejectStudent={handleRejectStudent}
            onSeedData={handleSeedData}
            onSaveFeedback={saveFeedback}
          />
        )}
      </div>
    </div>
  );
}

export default App;
