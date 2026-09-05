import type {
  Alumni,
  Blog,
  Referral,
} from './api/alumniApi';

export type AlumniStatus = 'PENDING' | 'APPROVED';

export type BlogCategory =
  | 'Interview Experience'
  | 'Career Advice'
  | 'Referral Tips'
  | 'General';

export type { Alumni, Blog, Referral };


export const INITIAL_ALUMNI: Alumni[] = [
  {
    id: 'alum_1',
    name: 'Ananya Sen',
    email: 'ananya.alumni@university.edu',
    password: 'alumni123',
    graduationYear: 2022,
    currentCompany: 'Microsoft',
    currentRole: 'Software Engineer',
    department: 'Information Technology',
    linkedIn: 'https://www.linkedin.com/',
    alumniStatus: 'APPROVED'
  },
  {
    id: 'alum_2',
    name: 'Rahul Mehta',
    email: 'rahul.alumni@university.edu',
    password: 'alumni123',
    graduationYear: 2023,
    currentCompany: 'Deloitte',
    currentRole: 'Technology Analyst',
    department: 'Computer Science',
    linkedIn: 'https://www.linkedin.com/',
    alumniStatus: 'APPROVED'
  }
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog_1',
    title: 'How I Prepared for My First Technical Interview',
    content:
      'I started with data structures and algorithms, then focused on explaining my projects clearly. The biggest improvement came from doing timed practice and speaking my thought process aloud during mock interviews.',
    category: 'Interview Experience',
    postedDate: '2026-08-21',
    alumniId: 'alum_1',
    published: true
  },
  {
    id: 'blog_2',
    title: 'Three Things I Wish I Knew Before My First Job',
    content:
      'Do not optimize only for interview preparation. Build strong fundamentals, learn to communicate your work, and keep a simple record of your projects and achievements.',
    category: 'Career Advice',
    postedDate: '2026-08-28',
    alumniId: 'alum_2',
    published: true
  },
  {
    id: 'blog_3',
    title: 'What Makes a Referral Request Easy to Say Yes To',
    content:
      'A concise introduction, the exact role, a relevant resume and a clear explanation of why you fit the role make referral requests much easier to evaluate.',
    category: 'Referral Tips',
    postedDate: '2026-09-01',
    alumniId: 'alum_1',
    published: true
  }
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref_1',
    alumniId: 'alum_1',
    companyName: 'Microsoft',
    role: 'Software Engineer Intern',
    description: 'Referral opportunity for students with strong DSA and programming fundamentals. Share your resume and a short introduction through LinkedIn.',
    postedDate: '2026-08-30',
    active: true
  },
  {
    id: 'ref_2',
    alumniId: 'alum_2',
    companyName: 'Deloitte',
    role: 'Technology Analyst',
    description: 'Suitable for students interested in software engineering, cloud and enterprise technology. Reach out with your resume and target role.',
    postedDate: '2026-09-02',
    active: true
  }
];
