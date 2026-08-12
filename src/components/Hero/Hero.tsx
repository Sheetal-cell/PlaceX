import React from 'react';
import { GraduationCap, ArrowDown } from 'lucide-react';
import { GravityStarsBackground } from './GravityStarsBackground';
import './Hero.css';

interface HeroProps {
  onScrollToLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onScrollToLogin }) => {
  return (
    <section className="hero-container">
      {/* New animated gravity stars particle field from Animate UI */}
      <GravityStarsBackground
        starsCount={90}
        starsSize={2.4}
        starsOpacity={0.75}
        glowIntensity={12}
        glowAnimation="ease"
        movementSpeed={0.65}
        mouseInfluence={220}
        mouseGravity="attract"
        gravityStrength={150}
        starsInteraction={false}
      />
      
      <div className="hero-content-wrapper">
        <div className="hero-logo-box">
          <GraduationCap className="hero-logo-icon" size={60} />
        </div>
        
        <h1 className="hero-title">PlaceX</h1>
        
        <span className="hero-subtitle-badge">
          AI Powered Placement Management
        </span>
        
        <h2 className="hero-heading">Transform Campus Placements</h2>
        
        <p className="hero-description">
          Track students, manage drives, analyze resumes,
          conduct mock interviews and improve placement rates.
        </p>

        {/* Hero statistics preserved exactly from the current landing page */}
        <div className="hero-stats-row">
          <div className="hero-stat-item">
            <h3>5000+</h3>
            <span>Students</span>
          </div>
          <div className="hero-stat-item">
            <h3>300+</h3>
            <span>Companies</span>
          </div>
          <div className="hero-stat-item">
            <h3>95%</h3>
            <span>Success Rate</span>
          </div>
        </div>

        {/* Scroll CTA Button */}
        <div className="hero-cta-entrance-wrapper">
          <div className="hero-cta-bob-wrapper">
            <button onClick={onScrollToLogin} className="hero-cta-btn" aria-label="Scroll to Login">
              <span>Get Started</span>
              <ArrowDown className="hero-cta-arrow" size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
