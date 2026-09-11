import React, { useState } from 'react';
import {
  Menu,
  X,
  Building2,
  LayoutDashboard,
  Briefcase,
  GitMerge
} from 'lucide-react';
import type { Recruiter } from '../../mockData';

export type RecruiterTabType = 'dashboard' | 'drives' | 'tracker';

interface RecruiterSidebarProps {
  activeTab: RecruiterTabType;
  setActiveTab: (tab: RecruiterTabType) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  recruiter: Recruiter;
}

export const RecruiterSidebar: React.FC<RecruiterSidebarProps> = ({
  activeTab,
  setActiveTab,
  isExpanded,
  onToggleExpand,
  recruiter
}) => {
  const [hoveredItem, setHoveredItem] = useState<{ id: string; label: string; y: number } | null>(null);

  const navItems = [
    { id: 'dashboard' as RecruiterTabType, label: 'Hiring Dashboard', icon: LayoutDashboard },
    { id: 'drives' as RecruiterTabType, label: 'Company Drives', icon: Briefcase },
    { id: 'tracker' as RecruiterTabType, label: 'Applicant Tracker', icon: GitMerge }
  ];

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, id: string, label: string) => {
    if (isExpanded) return;
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
        className={`rp-sidebar hidden md:flex ${
          isExpanded ? 'rp-sidebar-expanded' : 'rp-sidebar-collapsed'
        }`}
      >
        {/* Top Header: Toggle Button (☰) when Collapsed OR Close Button (✕) when Expanded */}
        <div className="rp-sidebar-brand">
          {isExpanded ? (
            <div className="rp-brand-logo">
              <div className="rp-brand-icon-box">
                <Building2 size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="rp-brand-text truncate leading-none">{recruiter.companyName}</span>
                <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider mt-0.5">
                  Recruiter Console
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={onToggleExpand}
                onMouseEnter={(e) => handleMouseEnter(e, 'expand-btn', 'Expand Navigation')}
                onMouseLeave={handleMouseLeave}
                className="rp-sidebar-toggle-btn"
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
              className="rp-sidebar-toggle-btn"
              aria-label="Collapse Sidebar (✕)"
              title="Collapse Sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Recruiter Profile Card (Rendered when Expanded) */}
        {isExpanded && (
          <div className="rp-sidebar-profile-card">
            <div className="rp-avatar-circle">
              {recruiter.companyName.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-900 truncate" title={recruiter.name}>
                {recruiter.name}
              </span>
              <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider truncate">
                {recruiter.designation}
              </span>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="rp-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={(e) => handleMouseEnter(e, item.id, item.label)}
                onMouseLeave={handleMouseLeave}
                className={`rp-nav-item ${isActive ? 'active' : ''}`}
                aria-label={item.label}
              >
                <Icon size={20} className="rp-nav-icon" />
                {isExpanded && <span className="rp-nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Floating Hover Tooltip (Rendered outside overflow bounds when Collapsed) */}
      {!isExpanded && hoveredItem && (
        <div
          className="rp-fixed-tooltip"
          style={{ top: `${hoveredItem.y}px` }}
        >
          {hoveredItem.label}
        </div>
      )}
    </>
  );
};
