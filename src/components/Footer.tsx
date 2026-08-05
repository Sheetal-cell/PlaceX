import React from 'react';
import { GraduationCap, Mail, ShieldCheck, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-indigo-400" />
            <span className="font-semibold text-white text-sm">TPOHelper</span>
          </div>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            A unified placement & training portal connecting students,
            recruiters, and the Training &amp; Placement Office.
          </p>
        </div>

        <div className="site-footer-links">
          <div>
            <span className="site-footer-heading">Product</span>
            <a href="#">Placement Drives</a>
            <a href="#">Resume Insights</a>
            <a href="#">Student Directory</a>
          </div>
          <div>
            <span className="site-footer-heading">Institution</span>
            <a href="#">About TPO Cell</a>
            <a href="#">Placement Policy</a>
            <a href="mailto:tpo@university.edu">Contact</a>
          </div>
        </div>

        <div className="site-footer-meta">
          <span className="hero-badge" style={{ background: 'rgba(16,185,129,.1)' }}>
            <ShieldCheck size={12} />
            Data stored locally on this device
          </span>
          <div className="flex items-center gap-3 mt-3">
            <a href="mailto:tpo@university.edu" aria-label="Email TPO Cell" className="site-footer-icon">
              <Mail size={15} />
            </a>
            <a href="https://github.com/Sheetal-cell/TPOHelper-frontend" target="_blank" rel="noreferrer"
              aria-label="View source code" className="site-footer-icon">
              <Code2 size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} TPOHelper. Built for campus placement teams.</span>
        <span className="hidden sm:inline">v1.0 · Demo Environment</span>
      </div>
    </footer>
  );
};
