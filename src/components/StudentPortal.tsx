import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import type { Student, PlacementDrive } from '../mockData';
import type { CalendarEvent } from '../api/types';
import { Footer } from './Footer';
import CalendarPage from './calendar/CalendarPage';

// Import Redesigned Student Sub-components & Scoped CSS
import './student/StudentPortal.css';
import { StudentSidebar, type StudentTabType } from './student/StudentSidebar';
import { StudentMobileDrawer } from './student/StudentMobileDrawer';
import { StudentDashboardView } from './student/StudentDashboardView';
import { StudentDrivesView } from './student/StudentDrivesView';
import { StudentAtsView } from './student/StudentAtsView';
import { StudentInterviewView } from './student/StudentInterviewView';
import { StudentVisualizerView } from './student/StudentVisualizerView';
import { StudentProfileView } from './student/StudentProfileView';

interface StudentPortalProps {
  currentStudent: Student;
  drives: PlacementDrive[];
  calendarEvents?: CalendarEvent[];
  onLogout: () => void;
  onApply: (driveId: string) => void;
  onUpdateResumeScore: (score: number, resumeText: string) => void;
  onUpdateStudentProfile: (updatedStudent: Student) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentStudent,
  drives,
  calendarEvents,
  onLogout: _onLogout,
  onApply,
  onUpdateResumeScore,
  onUpdateStudentProfile
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to map pathname to StudentTabType
  const getTabFromPath = (path: string): StudentTabType => {
    if (path.includes('/student/drives')) return 'drives';
    if (path.includes('/student/calendar')) return 'calendar';
    if (path.includes('/student/ats')) return 'ats';
    if (path.includes('/student/interview')) return 'interview';
    if (path.includes('/student/pipeline') || path.includes('/student/visualizer')) return 'visualizer';
    if (path.includes('/student/profile')) return 'profile';
    return 'dashboard';
  };

  const activeTab = getTabFromPath(location.pathname);

  // Function to navigate when tab is changed
  const handleTabChange = (tab: StudentTabType) => {
    const routeMap: Record<StudentTabType, string> = {
      dashboard: '/student/dashboard',
      drives: '/student/drives',
      calendar: '/student/calendar',
      ats: '/student/ats-scorer',
      interview: '/student/interview',
      visualizer: '/student/pipeline',
      profile: '/student/profile'
    };
    navigate(routeMap[tab]);
  };

  // Redirect base /student to /student/dashboard
  useEffect(() => {
    if (location.pathname === '/student' || location.pathname === '/student/') {
      navigate('/student/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Profile Settings States
  const [profileName, setProfileName] = useState(currentStudent.name);
  const [profileEmail, setProfileEmail] = useState(currentStudent.email);
  const [profilePassword, setProfilePassword] = useState(currentStudent.password || '');
  const [profileBranch, setProfileBranch] = useState(currentStudent.department);
  const [profileCgpa, setProfileCgpa] = useState(currentStudent.cgpa.toString());
  const [profileBacklogs, setProfileBacklogs] = useState(currentStudent.backlogs.toString());
  const [profileSkills, setProfileSkills] = useState(currentStudent.skills.join(', '));
  const [profileProjects, setProfileProjects] = useState(currentStudent.projectsCount.toString());
  const [profileResume, setProfileResume] = useState(currentStudent.resumeText || '');
  const [uploadedResumeName, setUploadedResumeName] = useState('');
  const [uploadedResumeFile, setUploadedResumeFile] = useState<File | null>(null);
  const [uploadedCVFile, setUploadedCVFile] = useState<File | null>(null);
  const [uploadedCVName, setUploadedCVName] = useState('');

  // Reset profile inputs if active logged-in student changes
  useEffect(() => {
    setProfileName(currentStudent.name);
    setProfileEmail(currentStudent.email);
    setProfilePassword(currentStudent.password || '');
    setProfileBranch(currentStudent.department);
    setProfileCgpa(currentStudent.cgpa.toString());
    setProfileBacklogs(currentStudent.backlogs.toString());
    setProfileSkills(currentStudent.skills.join(', '));
    setProfileProjects(currentStudent.projectsCount.toString());
    setProfileResume(currentStudent.resumeText || '');
    setResumeTextInput(currentStudent.resumeText || '');
  }, [currentStudent.id]);

  // ATS Resume Scorer State
  const [resumeTextInput, setResumeTextInput] = useState(currentStudent.resumeText || '');
  const [atsReport, setAtsReport] = useState<{
    score: number;
    foundKeywords: string[];
    missingKeywords: string[];
    foundVerbs: string[];
    hasMetrics: boolean;
    recommendations: string[];
  } | null>(null);

  // Mock Interview State
  const [interviewRole, setInterviewRole] = useState<'Software Engineer' | 'Analyst' | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'bot' | 'feedback'; text: string }>>([]);
  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [interviewScores, setInterviewScores] = useState<number[]>([]);

  // Pipeline Visualizer State
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>(
    currentStudent.applications[0]?.driveId || ''
  );

  // File Upload Handlers (EXACT UNTOUCHED IMPLEMENTATION)
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedExtensions.includes(file.type)) {
      alert('Upload only PDF, DOC, or DOCX files');
      return;
    }

    setUploadedResumeFile(file);
    setUploadedResumeName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      setProfileResume(text);
      setResumeTextInput(text);
    };
    reader.readAsText(file);
  };

  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only PDF, DOC or DOCX files.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Maximum CV size is 5 MB.');
      return;
    }

    setUploadedCVFile(file);
    setUploadedCVName(file.name);
  };

  // Profile Save Form Handler (EXACT UNTOUCHED IMPLEMENTATION)
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cgpaNum = parseFloat(profileCgpa);
    if (isNaN(cgpaNum) || cgpaNum < 0 || cgpaNum > 10) {
      alert('CGPA must be a number between 0 and 10.');
      return;
    }
    const backlogsNum = parseInt(profileBacklogs);
    if (isNaN(backlogsNum) || backlogsNum < 0) {
      alert('Backlogs cannot be negative.');
      return;
    }

    const updatedStudent: Student = {
      ...currentStudent,
      name: profileName.trim(),
      email: profileEmail.trim(),
      password: profilePassword,
      department: profileBranch,
      cgpa: cgpaNum,
      backlogs: backlogsNum,
      skills: profileSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      projectsCount: parseInt(profileProjects) || 0,
      resumeText: profileResume
    };

    onUpdateStudentProfile(updatedStudent);
  };

  return (
    <div className="sp-layout">
      {/* Mobile Top Bar (Only visible on mobile screens < 768px) */}
      <div className="md:hidden sticky top-[64px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-xs border border-blue-200/80 transition-all cursor-pointer flex items-center gap-2 shadow-2xs active:scale-95"
        >
          <Menu size={18} className="text-blue-600 shrink-0" />
          <span>Navigation Menu</span>
        </button>
        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/80 font-mono">
          {activeTab}
        </span>
      </div>

      <div className="sp-main-shell">
        {/* Persistent Desktop Sidebar (ChatGPT / Gemini Style 72px -> 280px Width Expansion) */}
        <StudentSidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          isExpanded={isSidebarExpanded}
          onToggleExpand={() => setIsSidebarExpanded((prev) => !prev)}
          currentStudent={currentStudent}
        />

        {/* Mobile Navigation Drawer (Off-Canvas overlay for mobile screens) */}
        <StudentMobileDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          currentStudent={currentStudent}
        />

        {/* Content Workspace Area (Smoothly resizes margin-left 72px -> 280px on desktop) */}
        <div className="sp-content-wrapper">
          <main className="sp-workspace">
            {activeTab === 'dashboard' && (
              <StudentDashboardView
                currentStudent={currentStudent}
                setActiveTab={handleTabChange}
                onTrackApplication={(driveId) => {
                  setSelectedApplicationId(driveId);
                  handleTabChange('visualizer');
                }}
              />
            )}

            {activeTab === 'drives' && (
              <StudentDrivesView
                currentStudent={currentStudent}
                drives={drives}
                onApply={onApply}
              />
            )}

            {activeTab === 'calendar' && (
              <div className="sp-card animate-fade-in">
                <CalendarPage readOnly={true} events={calendarEvents} />
              </div>
            )}

            {activeTab === 'ats' && (
              <StudentAtsView
                currentStudent={currentStudent}
                resumeTextInput={resumeTextInput}
                setResumeTextInput={setResumeTextInput}
                atsReport={atsReport}
                setAtsReport={setAtsReport}
                onUpdateResumeScore={onUpdateResumeScore}
              />
            )}

            {activeTab === 'interview' && (
              <StudentInterviewView
                interviewRole={interviewRole}
                setInterviewRole={setInterviewRole}
                interviewQuestions={interviewQuestions}
                setInterviewQuestions={setInterviewQuestions}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                userAnswer={userAnswer}
                setUserAnswer={setUserAnswer}
                chatHistory={chatHistory}
                setChatHistory={setChatHistory}
                isInterviewFinished={isInterviewFinished}
                setIsInterviewFinished={setIsInterviewFinished}
                interviewScores={interviewScores}
                setInterviewScores={setInterviewScores}
              />
            )}

            {activeTab === 'visualizer' && (
              <StudentVisualizerView
                currentStudent={currentStudent}
                drives={drives}
                selectedApplicationId={selectedApplicationId}
                setSelectedApplicationId={setSelectedApplicationId}
              />
            )}

            {activeTab === 'profile' && (
              <StudentProfileView
                profileName={profileName}
                setProfileName={setProfileName}
                profileEmail={profileEmail}
                setProfileEmail={setProfileEmail}
                profilePassword={profilePassword}
                setProfilePassword={setProfilePassword}
                profileBranch={profileBranch}
                setProfileBranch={setProfileBranch}
                profileCgpa={profileCgpa}
                setProfileCgpa={setProfileCgpa}
                profileBacklogs={profileBacklogs}
                setProfileBacklogs={setProfileBacklogs}
                profileSkills={profileSkills}
                setProfileSkills={setProfileSkills}
                profileProjects={profileProjects}
                setProfileProjects={setProfileProjects}
                profileResume={profileResume}
                setProfileResume={setProfileResume}
                uploadedResumeName={uploadedResumeName}
                uploadedResumeFile={uploadedResumeFile}
                uploadedCVName={uploadedCVName}
                uploadedCVFile={uploadedCVFile}
                handleResumeUpload={handleResumeUpload}
                handleCVUpload={handleCVUpload}
                handleSaveProfile={handleSaveProfile}
                onGoToAts={() => handleTabChange('ats')}
              />
            )}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
};
