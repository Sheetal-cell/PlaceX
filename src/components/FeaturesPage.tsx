import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  FileCheck2,
  BarChart2,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Zap,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Footer } from './Footer';
import './FeaturesPage.css';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileCheck2 size={28} className="text-blue-600" />,
      title: 'AI ATS Resume Scorer',
      badge: 'AI Engine',
      description: 'Parses resumes in real-time against company job descriptions to provide keyword matching, skill gap analysis, and ATS score optimization.',
      highlights: ['Keyword density extraction', 'Skill gap suggestions', 'ATS formatting compliance']
    },
    {
      icon: <BarChart2 size={28} className="text-purple-600" />,
      title: 'Multi-Stage Pipeline Visualizer',
      badge: 'Recruitment CRM',
      description: 'Track candidate progression stage-by-stage from Online Assessments and Technical Interviews to HR rounds and offer letters.',
      highlights: ['Visual candidate Kanban', 'Stage promotion buttons', 'Rejection feedback logs']
    },
    {
      icon: <Building2 size={28} className="text-emerald-600" />,
      title: 'Recruiter CRM & Drive Portal',
      badge: 'Corporate Suite',
      description: 'Empowers corporate recruiters to launch placement drives, set eligibility filters, evaluate applications, and export reports.',
      highlights: ['Custom drive creation', 'Branch & CGPA filters', 'CSV/Excel applicant export']
    },
    {
      icon: <Calendar size={28} className="text-amber-600" />,
      title: 'Automated Placement Calendar',
      badge: 'Event Operations',
      description: 'Schedule pre-placement talks, coding tests, deadline reminders, and interview slots with automated student notifications.',
      highlights: ['Real-time deadline alerts', 'Interactive calendar view', 'Sync across all portals']
    },
    {
      icon: <TrendingUp size={28} className="text-sky-600" />,
      title: 'TPO Analytics & Department Insights',
      badge: 'Admin Intelligence',
      description: 'Real-time department-wise placement statistics, package distribution graphs, company participation rates, and unplaced student tracking.',
      highlights: ['Branch placement ratio', 'Package range distribution', 'Unplaced student filter']
    },
    {
      icon: <Users size={28} className="text-indigo-600" />,
      title: 'Alumni Mentorship & Referral Network',
      badge: 'Network Hub',
      description: 'Connect verified alumni with current batches for internal referral programs, mock interview sessions, and career guidance.',
      highlights: ['Alumni directory access', 'Referral request routing', 'Mock interview scheduling']
    }
  ];

  // Motion animation variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.05
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 22, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: 'easeOut' as const }
    }
  };

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: 'easeOut' as const }
    }
  };

  return (
    <div className="features-page-container">
      {/* Hero Section Banner with Line-by-Line Reveal */}
      <motion.section
        className="features-hero-section"
        variants={heroContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={lineVariants} className="inline-block">
          <span className="features-hero-badge">
            <Sparkles size={14} /> Platform Features
          </span>
        </motion.div>

        <motion.h1 variants={lineVariants} className="features-hero-title">
          Everything You Need to Scale Placements
        </motion.h1>

        <motion.p variants={lineVariants} className="features-hero-subtitle">
          Comprehensive placement management tools designed specifically for Students, TPO Administrators, Corporate Recruiters, and Alumni.
        </motion.p>
      </motion.section>

      {/* Grid of 6 Staggered Animated Feature Cards */}
      <section className="features-grid-section">
        <motion.div
          className="features-grid"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className="feature-card"
            >
              <div>
                <div className="feature-card-header">
                  <div className="feature-icon-box">{feat.icon}</div>
                  <span className="feature-badge-pill">{feat.badge}</span>
                </div>
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.description}</p>
              </div>

              <div className="feature-highlights">
                <ul className="feature-highlights-list">
                  {feat.highlights.map((item, hIdx) => (
                    <li key={hIdx} className="feature-highlight-item">
                      <CheckCircle2 size={15} className="feature-check-icon" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Call to Action Bar */}
      <motion.section
        className="features-cta-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="features-cta-card">
          <Zap size={38} className="features-cta-icon" />
          <h2 className="features-cta-title">
            Ready to test out the features?
          </h2>
          <p className="features-cta-desc">
            Get started by creating your account or exploring our sample demonstration data.
          </p>
          <div className="features-cta-buttons">
            <button
              onClick={() => navigate('/auth?mode=register')}
              className="features-btn-primary"
            >
              Get Started Free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate('/auth?mode=login')}
              className="features-btn-secondary"
            >
              Sign In Now
            </button>
          </div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};
