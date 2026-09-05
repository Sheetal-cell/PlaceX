import React from 'react';
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  MessageSquareText,
  UserRound
} from 'lucide-react';

import type { Student } from '../../mockData';
import './StudentSidebar.css';
export type StudentTabType =
  | 'dashboard'
  | 'drives'
  | 'calendar'
  | 'ats'
  | 'interview'
  | 'visualizer'
  | 'alumni'
  | 'profile';

interface StudentSidebarProps {
  activeTab: StudentTabType;
  setActiveTab: (tab: StudentTabType) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  currentStudent: Student;
}

interface SidebarItem {
  id: StudentTabType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  onToggleExpand,
  currentStudent
}) => {
  const navigationItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={19} />,
      description: 'Overview'
    },
    {
      id: 'drives',
      label: 'Placement Drives',
      icon: <BriefcaseBusiness size={19} />,
      description: 'Explore opportunities'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: <CalendarDays size={19} />,
      description: 'Your schedule'
    },
    {
      id: 'ats',
      label: 'ATS Resume Scorer',
      icon: <FileCheck2 size={19} />,
      description: 'Optimize your resume'
    },
    {
      id: 'interview',
      label: 'Mock Interview',
      icon: <MessageSquareText size={19} />,
      description: 'Practice interviews'
    },
    {
      id: 'visualizer',
      label: 'Application Pipeline',
      icon: <BarChart3 size={19} />,
      description: 'Track applications'
    },
    {
      id: 'alumni',
      label: 'Alumni Corner',
      icon: <GraduationCap size={19} />,
      description: 'Blogs & referrals'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <UserRound size={19} />,
      description: 'Manage your profile'
    }
  ];

  return (
    <aside
      className={`student-sidebar ${
        isExpanded ? 'student-sidebar-expanded' : 'student-sidebar-collapsed'
      }`}
    >
      {/* Sidebar Brand */}
      <div className="student-sidebar-brand">
        <div className="student-sidebar-brand-icon">
          <GraduationCap size={20} />
        </div>

        {isExpanded && (
          <div className="student-sidebar-brand-text">
            <strong>Student Portal</strong>
            <span>PlaceX</span>
          </div>
        )}
      </div>

      {/* Student mini profile */}
      <div className="student-sidebar-user">
        <div className="student-sidebar-avatar">
          {currentStudent.name.charAt(0).toUpperCase()}
        </div>

        {isExpanded && (
          <div className="student-sidebar-user-info">
            <strong>{currentStudent.name}</strong>
            <span>{currentStudent.department}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="student-sidebar-nav">
        <div className="student-sidebar-nav-label">
          {isExpanded ? 'NAVIGATION' : 'MENU'}
        </div>

        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`student-sidebar-item ${
                isActive ? 'student-sidebar-item-active' : ''
              }`}
              onClick={() => setActiveTab(item.id)}
              title={!isExpanded ? item.label : undefined}
            >
              <span className="student-sidebar-item-icon">
                {item.icon}
              </span>

              {isExpanded && (
                <span className="student-sidebar-item-content">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Expand / collapse */}
      <div className="student-sidebar-bottom">
        <button
          type="button"
          className="student-sidebar-expand-button"
          onClick={onToggleExpand}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <>
              <ChevronLeft size={18} />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight size={18} />
          )}
        </button>
      </div>
    </aside>
  );
};