import React, { useState } from 'react';

interface ContributorAvatarProps {
  name: string;
  image: string;
  github: string;
}

export const ContributorAvatar: React.FC<ContributorAvatarProps> = ({ name, image, github }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="relative shrink-0"
      style={{ zIndex: showTooltip ? 100 : 10 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      {/* Custom Tooltip */}
      {showTooltip && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none select-none z-50"
          style={{ animation: 'tooltipIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
        >
          <div className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-lg contributor-tooltip">
            {name}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 rotate-45 contributor-tooltip-arrow" />
          </div>
        </div>
      )}

      {/* Avatar Link */}
      <a
        href={github}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-0 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#B59E7D] active:scale-95 contributor-avatar-anchor"
        aria-label={`Visit ${name}'s GitHub profile`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentNode as HTMLElement;
            parent.classList.add('flex', 'items-center', 'justify-center', 'font-bold', 'text-xs', 'contributor-avatar-fallback');
            parent.innerText = name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase();
          }}
        />
      </a>
    </div>
  );
};

interface AvatarGroupProps {
  children: React.ReactNode;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ children }) => {
  return (
    <div className="flex gap-2 md:gap-2 items-center justify-center pt-3 pb-2">
      {children}
    </div>
  );
};

export const ContributorStyles: React.FC = () => {
  return (
    <style>{`
      .contributor-tooltip {
        background-color: #182015 !important;
        color: #FFFDF8 !important;
        border: 1px solid rgba(241, 234, 218, 0.16) !important;
      }
      .light .contributor-tooltip {
        background-color: #FFFDF8 !important;
        color: #2E2923 !important;
        border: 1px solid #C9C4B8 !important;
      }
      .contributor-tooltip-arrow {
        background-color: #182015 !important;
        border-bottom: 1px solid rgba(241, 234, 218, 0.16) !important;
        border-right: 1px solid rgba(241, 234, 218, 0.16) !important;
      }
      .light .contributor-tooltip-arrow {
        background-color: #FFFDF8 !important;
        border-bottom: 1px solid #C9C4B8 !important;
        border-right: 1px solid #C9C4B8 !important;
      }
      .contributor-avatar-anchor {
        border-color: rgba(241, 234, 218, 0.16) !important;
        background: #2C3424 !important;
      }
      .light .contributor-avatar-anchor {
        border-color: #C9C4B8 !important;
        background: #FFFDF8 !important;
      }
      .contributor-avatar-anchor:hover {
        border-color: #B59E7D !important;
        transform: translateY(-2px);
        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25) !important;
      }
      .light .contributor-avatar-anchor:hover {
        border-color: #4C583E !important;
        box-shadow: 0 4px 10px rgba(46, 41, 35, 0.08) !important;
      }
      .contributor-avatar-fallback {
        background-color: #2C3424 !important;
        color: #FFFDF8 !important;
      }
      .light .contributor-avatar-fallback {
        background-color: #E8ECE7 !important;
        color: #2C3424 !important;
      }
      @keyframes tooltipIn {
        from { opacity: 0; transform: translate(-50%, 4px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
    `}</style>
  );
};
