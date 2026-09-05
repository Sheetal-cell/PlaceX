import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Mail,
  Search,
  UserRound,
  UsersRound
} from 'lucide-react';

import type { Alumni, Blog, Referral } from '../../api/alumniApi';

interface StudentAlumniViewProps {
  blogs: Blog[];
  referrals: Referral[];
  alumni: Alumni[];
}

type BlogCategory =
  | 'Interview Experience'
  | 'Career Advice'
  | 'Referral Tips'
  | 'General';

const BLOG_CATEGORIES: Array<'All' | BlogCategory> = [
  'All',
  'Interview Experience',
  'Career Advice',
  'Referral Tips',
  'General'
];

export const StudentAlumniView: React.FC<StudentAlumniViewProps> = ({
  blogs,
  referrals,
  alumni
}) => {
  const [activeSection, setActiveSection] = useState<'blogs' | 'referrals'>(
    'blogs'
  );

  const [selectedCategory, setSelectedCategory] = useState<
    'All' | BlogCategory
  >('All');

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  /*
   * Only published blogs are visible to students.
   */
  const publishedBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return blogs.filter((blog) => {
      if (!blog.published) return false;

      const categoryMatches =
        selectedCategory === 'All' ||
        blog.category === selectedCategory;

      if (!categoryMatches) return false;

      if (!query) return true;

      return (
        blog.title.toLowerCase().includes(query) ||
        blog.content.toLowerCase().includes(query)
      );
    });
  }, [blogs, selectedCategory, searchQuery]);

  /*
   * Only active referrals are visible to students.
   */
  const activeReferrals = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return referrals.filter((referral) => {
      if (!referral.active) return false;

      if (!query) return true;

      return (
        referral.companyName.toLowerCase().includes(query) ||
        referral.role.toLowerCase().includes(query) ||
        referral.description.toLowerCase().includes(query)
      );
    });
  }, [referrals, searchQuery]);

  const getAlumni = (alumniId: string) => {
    return alumni.find((item) => item.id === alumniId);
  };

  const getAuthorName = (blog: Blog) => {
    const author = getAlumni(blog.alumniId);
    return author?.name || 'Alumni';
  };

  const getAuthorCompany = (blog: Blog) => {
    const author = getAlumni(blog.alumniId);
    return author?.currentCompany || 'Professional';
  };

  const getReferralAlumni = (referral: Referral) => {
    return getAlumni(referral.alumniId);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  };

  const formatDate = (date: string) => {
    if (!date) return 'Date unavailable';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Interview Experience':
        return 'student-alumni-category interview';
      case 'Career Advice':
        return 'student-alumni-category career';
      case 'Referral Tips':
        return 'student-alumni-category referral';
      default:
        return 'student-alumni-category general';
    }
  };

  return (
    <section className="student-alumni-page">
      {/* Header */}
      <div className="student-alumni-header">
        <div>
          <div className="student-alumni-eyebrow">
            <UsersRound size={16} />
            Alumni Corner
          </div>

          <h1>Learn from your Alumni</h1>

          <p>
            Read career experiences, interview advice and explore referral
            opportunities shared by alumni.
          </p>
        </div>

        <div className="student-alumni-header-icon">
          <GraduationCapIcon />
        </div>
      </div>

      {/* Statistics */}
      <div className="student-alumni-stats">
        <div className="student-alumni-stat-card">
          <div className="student-alumni-stat-icon blue">
            <BookOpen size={20} />
          </div>

          <div>
            <span>Published Blogs</span>
            <strong>{blogs.filter((blog) => blog.published).length}</strong>
          </div>
        </div>

        <div className="student-alumni-stat-card">
          <div className="student-alumni-stat-icon green">
            <BriefcaseBusiness size={20} />
          </div>

          <div>
            <span>Active Referrals</span>
            <strong>{referrals.filter((referral) => referral.active).length}</strong>
          </div>
        </div>

        <div className="student-alumni-stat-card">
          <div className="student-alumni-stat-icon amber">
            <UsersRound size={20} />
          </div>

          <div>
            <span>Alumni Community</span>
            <strong>{alumni.length}</strong>
          </div>
        </div>
      </div>

      {/* Section Switcher */}
      <div className="student-alumni-toolbar">
        <div className="student-alumni-tabs">
          <button
            type="button"
            className={activeSection === 'blogs' ? 'active' : ''}
            onClick={() => {
              setActiveSection('blogs');
              setSearchQuery('');
            }}
          >
            <BookOpen size={17} />
            Alumni Blogs
          </button>

          <button
            type="button"
            className={activeSection === 'referrals' ? 'active' : ''}
            onClick={() => {
              setActiveSection('referrals');
              setSearchQuery('');
            }}
          >
            <BriefcaseBusiness size={17} />
            Referral Opportunities
          </button>
        </div>

        <div className="student-alumni-search">
          <Search size={17} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              activeSection === 'blogs'
                ? 'Search blogs...'
                : 'Search company or role...'
            }
          />
        </div>
      </div>

      {/* BLOGS */}
      {activeSection === 'blogs' && (
        <>
          {/* Category Filter */}
          <div className="student-alumni-filter-row">
            <div className="student-alumni-filter-label">
              <span>Filter by category</span>

              <div className="student-alumni-select-wrapper">
                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(
                      event.target.value as 'All' | BlogCategory
                    )
                  }
                >
                  {BLOG_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown size={16} />
              </div>
            </div>

            <span className="student-alumni-result-count">
              {publishedBlogs.length}{' '}
              {publishedBlogs.length === 1 ? 'blog' : 'blogs'}
            </span>
          </div>

          {publishedBlogs.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={30} />}
              title="No published blogs found"
              description={
                searchQuery || selectedCategory !== 'All'
                  ? 'Try changing your search or category filter.'
                  : 'Alumni have not published any blogs yet.'
              }
            />
          ) : (
            <div className="student-alumni-blog-grid">
              {publishedBlogs.map((blog) => {
                const authorName = getAuthorName(blog);
                const authorCompany = getAuthorCompany(blog);

                return (
                  <article
                    key={blog.id}
                    className="student-alumni-blog-card"
                  >
                    <div className="student-alumni-blog-top">
                      <span className={getCategoryClass(blog.category)}>
                        {blog.category}
                      </span>

                      <div className="student-alumni-date">
                        <CalendarDays size={14} />
                        {formatDate(blog.postedDate)}
                      </div>
                    </div>

                    <h2>{blog.title}</h2>

                    <p className="student-alumni-blog-preview">
                      {blog.content.length > 180
                        ? `${blog.content.slice(0, 180)}...`
                        : blog.content}
                    </p>

                    <div className="student-alumni-author">
                      <div className="student-alumni-avatar">
                        {getInitials(authorName)}
                      </div>

                      <div className="student-alumni-author-info">
                        <strong>{authorName}</strong>
                        <span>{authorCompany}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="student-alumni-read-button"
                      onClick={() => setSelectedBlog(blog)}
                    >
                      Read Full Blog
                      <ExternalLink size={15} />
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* REFERRALS */}
      {activeSection === 'referrals' && (
        <>
          <div className="student-alumni-filter-row">
            <div>
              <div className="student-alumni-filter-label">
                <span>Active referral opportunities</span>
              </div>
            </div>

            <span className="student-alumni-result-count">
              {activeReferrals.length}{' '}
              {activeReferrals.length === 1
                ? 'opportunity'
                : 'opportunities'}
            </span>
          </div>

          {activeReferrals.length === 0 ? (
            <EmptyState
              icon={<BriefcaseBusiness size={30} />}
              title="No active referrals found"
              description={
                searchQuery
                  ? 'Try searching for another company or role.'
                  : 'There are no active alumni referrals at the moment.'
              }
            />
          ) : (
            <div className="student-alumni-referral-list">
              {activeReferrals.map((referral) => {
                const referralAlumni = getReferralAlumni(referral);

                return (
                  <article
                    key={referral.id}
                    className="student-alumni-referral-card"
                  >
                    <div className="student-alumni-referral-main">
                      <div className="student-alumni-company-icon">
                        <BriefcaseBusiness size={22} />
                      </div>

                      <div className="student-alumni-referral-content">
                        <div className="student-alumni-referral-title-row">
                          <div>
                            <h2>{referral.companyName}</h2>
                            <h3>{referral.role}</h3>
                          </div>

                          <span className="student-alumni-active-badge">
                            Active
                          </span>
                        </div>

                        <p>{referral.description}</p>

                        <div className="student-alumni-referral-meta">
                          <span>
                            <UserRound size={14} />
                            {referralAlumni?.name || 'Alumni'}
                          </span>

                          <span>
                            <CalendarDays size={14} />
                            {formatDate(referral.postedDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="student-alumni-contact-actions">
                      {referralAlumni?.linkedIn && (
                        <a
                          href={referralAlumni.linkedIn}
                          target="_blank"
                          rel="noreferrer"
                          className="student-alumni-contact linkedin"
                        >
                          <ExternalLink size={16} />
                          LinkedIn
                        </a>
                      )}

                      {referralAlumni?.email && (
                        <a
                          href={`mailto:${referralAlumni.email}`}
                          className="student-alumni-contact email"
                        >
                          <Mail size={16} />
                          Email Alumni
                        </a>
                      )}

                      {!referralAlumni?.linkedIn &&
                        !referralAlumni?.email && (
                          <span className="student-alumni-no-contact">
                            Contact details unavailable
                          </span>
                        )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Full Blog Modal */}
      {selectedBlog && (
        <div
          className="student-alumni-modal-backdrop"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="student-alumni-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="student-alumni-modal-header">
              <div>
                <span
                  className={getCategoryClass(selectedBlog.category)}
                >
                  {selectedBlog.category}
                </span>

                <h2>{selectedBlog.title}</h2>

                <div className="student-alumni-modal-author">
                  <div className="student-alumni-avatar">
                    {getInitials(getAuthorName(selectedBlog))}
                  </div>

                  <div>
                    <strong>{getAuthorName(selectedBlog)}</strong>
                    <span>
                      {getAuthorCompany(selectedBlog)} ·{' '}
                      {formatDate(selectedBlog.postedDate)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="student-alumni-modal-close"
                onClick={() => setSelectedBlog(null)}
                aria-label="Close blog"
              >
                ×
              </button>
            </div>

            <div className="student-alumni-modal-content">
              {selectedBlog.content.split('\n').map((paragraph, index) => (
                <p key={`${selectedBlog.id}-paragraph-${index}`}>
                  {paragraph || '\u00A0'}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const GraduationCapIcon = () => (
  <div className="student-alumni-graduation-icon">
    <svg
      width="38"
      height="38"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
      <path d="M22 10v6" />
    </svg>
  </div>
);

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="student-alumni-empty-state">
      <div className="student-alumni-empty-icon">{icon}</div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
};