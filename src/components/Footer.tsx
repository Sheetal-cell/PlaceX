import React from 'react';
import { GraduationCap } from 'lucide-react';
import { ContributorAvatar, AvatarGroup, ContributorStyles } from './ContributorAvatar';

const contributors = [
  {
    name: "Prashanjit Mishra",
    image: "https://lh3.googleusercontent.com/d/1MGDVRNOt8JbFlbcWgCsY-CLdGBatzEij",
    github: "https://github.com/Prasanjit7485",
  },
  {
    name: "Shreyaushi Das",
    image: "https://avatars.githubusercontent.com/u/185457484?v=4",
    github: "https://github.com/shreyaushi-Das",
  },
  {
    name: "Sheetal Bajaj",
    image: "https://avatars.githubusercontent.com/u/183822317?v=4",
    github: "https://github.com/Sheetal-cell",
  },
  {
    name: "Arghya Roy Chowdhury",
    image: "https://avatars.githubusercontent.com/u/183939897?v=4",
    github: "https://github.com/roychowdhury-arghya",
  },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} style={{ color: '#B59E7D' }} />
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
        <div className="site-footer-contributors flex flex-col items-start md:items-end">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-4 flex gap-4 ">Built by</span>
          <AvatarGroup>
            {contributors.map((contrib, idx) => (
              <ContributorAvatar
                key={idx}
                name={contrib.name}
                image={contrib.image}
                github={contrib.github}
              />
            ))}
          </AvatarGroup>
          <ContributorStyles />
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {year} TPOHelper. Built for campus placement teams.</span>
        <span className="hidden sm:inline">v1.0 · Demo Environment</span>
      </div>
    </footer>
  );
};
