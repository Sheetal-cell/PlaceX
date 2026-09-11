import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const RouteLoadingBar: React.FC = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger fake loading animation on route change
    setVisible(true);
    setProgress(35);

    const timer1 = setTimeout(() => {
      setProgress(75);
    }, 100);

    const timer2 = setTimeout(() => {
      setProgress(100);
    }, 220);

    const timer3 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 380);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname, location.search]);

  if (!visible) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[999999] pointer-events-none transition-all duration-200 ease-out"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #2563EB 0%, #3B82F6 50%, #8B5CF6 100%)',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)'
      }}
    />
  );
};
