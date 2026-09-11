import React from 'react';
import { Hero } from './Hero/Hero';
import { Footer } from './Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen relative w-full bg-[#F8FAFC] text-[hsl(var(--text-primary))]">
      {/* Main Hero Section with enlarged logo, title, and action entry cards */}
      <Hero />
      <Footer />
    </div>
  );
};
