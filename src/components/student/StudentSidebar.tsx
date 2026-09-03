import React, { useState } from 'react';
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  Briefcase,
  Calendar as CalendarIcon,
  Sparkles,
  MessageSquare,
  TrendingUp,
  User
} from 'lucide-react';
import type { Student } from '../../mockData';

export type StudentTabType =
  | 'dashboard'
  | 'drives'
  | 'calendar'
  | 'ats'
  | 'interview'
  | 'visualizer'
  | 'profile';

interface StudentSidebarProps {
  activeTab: StudentTabType;
  setActiveTab: (tab: StudentTabType) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  currentStudent: Student;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  onToggleExpand,
  currentStudent
}) => {
  const [hoveredItem, setHoveredItem] = useState<{ id: string; label: string; y: number } | null>(null);

  const navItems = [
    { id: 'dashboard' as StudentTabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'drives' as StudentTabType, label: 'Placement Drives', icon: Briefcase },
    { id: 'calendar' as StudentTabType, label: 'Placement Calendar', icon: CalendarIcon },
    { id: 'ats' as StudentTabType, label: 'ATS Resume Scorer', icon: Sparkles },
    { id: 'interview' as StudentTabType, label: 'Mock Interview Simulator', icon: MessageSquare },
    { id: 'visualizer' as StudentTabType, label: 'Recruitment Pipeline', icon: TrendingUp },
    { id: 'profile' as StudentTabType, label: 'Profile Settings', icon: User }
  ];

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, id: string, label: string) => {
    if (isExpanded) return; // Do not show floating tooltip if sidebar is expanded
    const rect = e.currentTarget.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    setHoveredItem({ id, label, y: centerY });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <aside
        className={`sp-sidebar hidden md:flex ${
          isExpanded ? 'sp-sidebar-expanded' : 'sp-sidebar-collapsed'
        }`}
      >
        {/* Top Header: Menu Button (☰) when Collapsed OR Close Button (✕) when Expanded */}
        <div className="sp-sidebar-header">
          {isExpanded ? (
            <div className="sp-brand-box">
              <div className="sp-brand-icon-box">
                <GraduationCap size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="sp-brand-text leading-none">PlaceX</span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mt-0.5">
                  Student Portal
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={onToggleExpand}
                onMouseEnter={(e) => handleMouseEnter(e, 'expand-btn', 'Expand Sidebar')}
                onMouseLeave={handleMouseLeave}
                className="sp-sidebar-toggle-btn"
                aria-label="Expand Sidebar (☰)"
                title="Expand Sidebar"
              >
                <Menu size={20} />
              </button>
            </div>
          )}

          {isExpanded && (
            <button
              onClick={onToggleExpand}
              className="sp-sidebar-toggle-btn"
              aria-label="Collapse Sidebar (✕)"
              title="Collapse Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Student Profile Card (Rendered when Expanded) */}
        {isExpanded && (
          <div className="sp-sidebar-profile-card">
            <div className="sp-avatar-circle">
              {currentStudent.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate" title={currentStudent.name}>
                {currentStudent.name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {currentStudent.department} • {currentStudent.cgpa} CGPA
              </span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="sp-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={(e) => handleMouseEnter(e, item.id, item.label)}
                onMouseLeave={handleMouseLeave}
                className={`sp-nav-item ${isActive ? 'active' : ''}`}
                aria-label={item.label}
              >
                <Icon size={20} className="sp-nav-icon" />
                {isExpanded && <span className="sp-nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Floating Hover Tooltip (Rendered outside overflow bounds when Collapsed) */}
      {!isExpanded && hoveredItem && (
        <div
          className="sp-fixed-tooltip"
          style={{ top: `${hoveredItem.y}px` }}
        >
          {hoveredItem.label}
        </div>
      )}
    </>
  );
};
